"""Mackolik geniş iddaa programı. Oranlar sitede +0.25 gösterilir."""
from __future__ import annotations

import json
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from urllib.request import Request, urlopen

BOOST = 0.25
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
ROOT = "https://arsiv.mackolik.com/AjaxHandlers"
REFERER = "https://arsiv.mackolik.com/Genis-Iddaa-Programi"
DAYS = ["Pazar", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"]
_cache = {"at": 0.0, "body": None}


class ParseError(ValueError):
    pass


def _loads(text: str):
    s = text.lstrip("\ufeff").strip()
    i = 0
    n = len(s)

    def skip():
        nonlocal i
        while i < n and s[i] in " \t\r\n":
            i += 1

    def parse_string(quote: str) -> str:
        nonlocal i
        i += 1
        out = []
        while i < n:
            c = s[i]
            if c == "\\":
                i += 1
                if i >= n:
                    break
                esc = s[i]
                out.append({"n": "\n", "r": "\r", "t": "\t", "'": "'", '"': '"', "\\": "\\"}.get(esc, esc))
                i += 1
                continue
            if c == quote:
                i += 1
                return "".join(out)
            out.append(c)
            i += 1
        raise ParseError("string")

    def parse_value():
        nonlocal i
        skip()
        if i >= n:
            raise ParseError("eof")
        c = s[i]
        if c == "{":
            return parse_object()
        if c == "[":
            return parse_array()
        if c in "'\"":
            return parse_string(c)
        if s.startswith("null", i):
            i += 4
            return None
        if s.startswith("true", i):
            i += 4
            return True
        if s.startswith("false", i):
            i += 5
            return False
        j = i
        if s[j] == "-":
            j += 1
        start = j
        if j >= n or not s[j].isdigit():
            raise ParseError(repr(s[i : i + 16]))
        while j < n and s[j].isdigit():
            j += 1
        if j < n and s[j] == "." and j + 1 < n and s[j + 1].isdigit():
            j += 1
            while j < n and s[j].isdigit():
                j += 1
            num = s[i:j]
            i = j
            return float(num)
        if start == j:
            raise ParseError("number")
        num = s[i:j]
        i = j
        return int(num)

    def parse_array():
        nonlocal i
        i += 1
        out = []
        while True:
            skip()
            if i < n and s[i] == "]":
                i += 1
                return out
            out.append(parse_value())
            skip()
            if i < n and s[i] == ",":
                i += 1
                continue
            if i < n and s[i] == "]":
                i += 1
                return out
            raise ParseError("array")

    def parse_object():
        nonlocal i
        i += 1
        out = {}
        while True:
            skip()
            if i < n and s[i] == "}":
                i += 1
                return out
            if i < n and s[i] in "'\"":
                key = parse_string(s[i])
            else:
                j = i
                while j < n and (s[j].isalnum() or s[j] == "_"):
                    j += 1
                if j == i:
                    raise ParseError("key")
                key = s[i:j]
                i = j
            skip()
            if i >= n or s[i] != ":":
                raise ParseError("colon")
            i += 1
            out[key] = parse_value()
            skip()
            if i < n and s[i] == ",":
                i += 1
                continue
            if i < n and s[i] == "}":
                i += 1
                return out
            raise ParseError("object")

    if not s.startswith("{"):
        raise ParseError("payload")
    value = parse_value()
    return value


def _istanbul_now() -> datetime:
    return datetime.now(timezone(timedelta(hours=3)))


def _stamp(dt: datetime) -> str:
    return dt.strftime("%d.%m.%Y")


def _ymd(stamp: str) -> str:
    day, month, year = stamp.split(".")
    return f"{year}{month}{day}"


def _pull(url: str):
    req = Request(url, headers={
        "User-Agent": UA,
        "Accept": "*/*",
        "Referer": REFERER,
        "Accept-Language": "tr-TR,tr;q=0.9",
    })
    with urlopen(req, timeout=12) as res:
        raw = res.read().decode("utf-8", "replace")
    return _loads(raw)


def _price(value):
    if value is None:
        return None
    text = str(value).strip().replace(",", ".")
    if not text or text in {"-", "0", "0.0", "0.00"}:
        return None
    try:
        number = float(text)
    except ValueError:
        return None
    if number <= 1:
        return None
    return round(number + BOOST, 2)


def _logo(team_id) -> str:
    text = str(team_id or "").strip()
    if not text.isdigit():
        return ""
    return f"https://im.mackolik.com/img/logo/kucuk/{text}.gif"


def _when(date_str: str, kick: str, today: str) -> str:
    try:
        match_day = datetime.strptime(date_str, "%d.%m.%Y")
        today_day = datetime.strptime(today, "%d.%m.%Y")
    except ValueError:
        return kick
    diff = (match_day - today_day).days
    if diff == 0:
        return f"Bugün {kick}"
    if diff == 1:
        return f"Yarın {kick}"
    return f"{DAYS[(match_day.weekday() + 1) % 7]} {kick}"


def _sort_key(match: dict) -> tuple:
    day, month, year = [int(x) for x in match["date"].split(".")]
    hour, minute = [int(x) for x in (match["kickoff"] or "00:00").split(":")[:2]]
    return (year, month, day, hour, minute, match["league"], match["home"])


def _map_row(row, leagues: dict, today: str):
    if not isinstance(row, list) or len(row) < 19:
        return None
    try:
        status = int(row[5])
    except (TypeError, ValueError):
        return None
    if status >= 4:
        return None
    odds = {"1": _price(row[16]), "X": _price(row[17]), "2": _price(row[18])}
    if odds["1"] is None and odds["X"] is None and odds["2"] is None:
        return None
    live = status in (2, 3)
    date = str(row[7] or today)
    kick = str(row[6] or "")
    league_id = str(row[28]) if len(row) > 28 and row[28] not in (None, "") else ""
    short = str(row[26] or "").strip() if len(row) > 26 else ""
    league = leagues.get(league_id) or short or "Futbol"
    group = str(row[27]).strip() if len(row) > 27 and str(row[27]).strip().isdigit() else ""
    home_score = row[8] if str(row[8]).strip().isdigit() else 0
    away_score = row[9] if str(row[9]).strip().isdigit() else 0
    return {
        "id": "mk" + str(row[0]),
        "source": "mackolik",
        "league": league[:80],
        "leagueIcon": f"https://im.mackolik.com/img/groups/{group}.gif" if group else "",
        "sport": "Futbol",
        "home": str(row[1] or "").strip(),
        "away": str(row[3] or "").strip(),
        "homeLogo": _logo(row[2]),
        "awayLogo": _logo(row[4]),
        "date": date,
        "kickoff": kick,
        "time": "Canlı" if live else _when(date, kick, today),
        "live": live,
        "score": f"{int(home_score)}-{int(away_score)}" if live else "",
        "odds": odds,
    }


def get_matches(force: bool = False):
    now = datetime.now().timestamp()
    if not force and _cache["body"] is not None and now - _cache["at"] < 20:
        return _cache["body"]
    today = _stamp(_istanbul_now())
    combo = _pull(
        f"{ROOT}/ProgramComboHandler.ashx?sport=1&type=6&sortValue=DATE&day={today}&sortDir=-1&groupId=-1&np=0"
    )
    leagues = {}
    for row in combo.get("l") or []:
        if isinstance(row, list) and len(row) >= 2 and str(row[0]) not in {"", "-1"}:
            leagues[str(row[0])] = str(row[1] or "").strip()
    days = []
    for row in combo.get("d") or []:
        if not isinstance(row, list) or not row:
            continue
        stamp = str(row[0])
        if len(stamp) == 10 and stamp[2] == "." and _ymd(stamp) >= _ymd(today):
            days.append(stamp)
    if not days:
        days = [today]
    days = days[:6]

    def board(day: str):
        try:
            return _pull(
                f"{ROOT}/ProgramDataHandler.ashx?type=6&sortValue=DATE&day={day}&sort=-1&sortDir=-1&groupId=-1&np=0&sport=1"
            )
        except Exception:
            return None

    with ThreadPoolExecutor(max_workers=6) as pool:
        boards = list(pool.map(board, days))

    seen = set()
    matches = []
    for payload in boards:
        if not payload:
            continue
        for bucket in payload.get("m") or []:
            for row in (bucket or {}).get("m") or []:
                match_id = row[0] if isinstance(row, list) and row else None
                if match_id in seen:
                    continue
                seen.add(match_id)
                match = _map_row(row, leagues, today)
                if match and match["home"] and match["away"]:
                    matches.append(match)
    matches.sort(key=_sort_key)
    _cache["at"] = now
    _cache["body"] = matches
    return matches


def dumps(matches) -> str:
    return json.dumps({"matches": matches, "updatedAt": int(datetime.now().timestamp() * 1000)}, ensure_ascii=False)
