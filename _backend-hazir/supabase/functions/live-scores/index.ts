import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const LEAGUES = ["eng.1", "esp.1", "ita.1", "ger.1", "tur.1"];
const CACHE_TTL_SECONDS = 15;

type EspnCompetitor = { homeAway?: "home" | "away"; team?: { displayName?: string }; score?: string };
type EspnEvent = {
  id?: string;
  status?: { type?: { shortDetail?: string; state?: "pre" | "in" | "post" } };
  competitions?: Array<{ competitors?: EspnCompetitor[] }>;
};
type Score = {
  id: string; sport: string; league: string; home: string; away: string;
  homeScore: string; awayScore: string; time: string; status: "CANLI" | "BİTTİ" | "PROGRAMDA";
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

async function fetchLeague(league: string): Promise<Score[]> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${encodeURIComponent(league)}/scoreboard`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" }, signal: controller.signal });
    if (!res.ok) throw new Error(`Upstream ${league} failed: ${res.status}`);
    const payload = await res.json() as { events?: EspnEvent[] };
    const out: Score[] = [];
    for (const event of payload.events ?? []) {
      const competitors = event.competitions?.[0]?.competitors ?? [];
      const home = competitors.find((c) => c.homeAway === "home");
      const away = competitors.find((c) => c.homeAway === "away");
      if (!home?.team?.displayName || !away?.team?.displayName) continue; // takımlar belirsizse atla
      const state = event.status?.type?.state;
      out.push({
        id: `${league}:${event.id ?? crypto.randomUUID()}`,
        sport: "Futbol",
        league,
        home: home.team.displayName,
        away: away.team.displayName,
        homeScore: home.score ?? "0",
        awayScore: away.score ?? "0",
        time: event.status?.type?.shortDetail ?? "Yakında",
        status: state === "in" ? "CANLI" : state === "post" ? "BİTTİ" : "PROGRAMDA",
      });
    }
    return out;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchAll(): Promise<Score[]> {
  const results = await Promise.allSettled(LEAGUES.map(fetchLeague));
  const ok = results.filter((r): r is PromiseFulfilledResult<Score[]> => r.status === "fulfilled");
  if (ok.length === 0) throw new Error("All upstream requests failed");
  return ok.flatMap((r) => r.value);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });

  try {
    const { data: cached } = await supabase
      .from("live_scores_cache")
      .select("payload, fetched_at, ttl_seconds")
      .eq("id", 1)
      .maybeSingle();

    if (cached?.payload && Date.now() - new Date(cached.fetched_at).getTime() < cached.ttl_seconds * 1000) {
      return json({ scores: cached.payload, source: "ESPN", cached: true });
    }

    const scores = await fetchAll();
    await supabase
      .from("live_scores_cache")
      .upsert({ id: 1, payload: scores, fetched_at: new Date().toISOString(), ttl_seconds: CACHE_TTL_SECONDS });

    return json({ scores, source: "ESPN", cached: false });
  } catch (error) {
    console.error("live-scores failed", error);
    const { data: stale } = await supabase.from("live_scores_cache").select("payload").eq("id", 1).maybeSingle();
    if (stale?.payload) return json({ scores: stale.payload, source: "ESPN", stale: true });
    return json({ error: "Canlı skorlar şu anda alınamıyor." }, 502);
  }
});
