import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", serviceKey);

type Outcome = "won" | "lost" | "void";
type Selection = { id: string; home_team: string; away_team: string; selection_label: string; market_type: string };
type PendingSlip = { id: string; bet_selections: Selection[] };
type Score = { home: string; away: string; homeScore: string; awayScore: string; status: string };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

// Sabit zamanlı karşılaştırma
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function isAuthorized(req: Request): boolean {
  if (!serviceKey) return false;
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  return safeEqual(token, serviceKey);
}

const norm = (s: string) => s.toLocaleLowerCase("tr").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

function sameTeam(a: string, b: string): boolean {
  const x = norm(a), y = norm(b);
  return x.length > 0 && y.length > 0 && (x === y || x.includes(y) || y.includes(x));
}

/** Sonucu belirlenemeyen marketler için null döner; kupon beklemede kalır (asla otomatik 'void' veya 'won' değil). */
function determineOutcome(sel: Selection, home: number, away: number): Outcome | null {
  const label = sel.selection_label.trim();
  const lower = label.toLocaleLowerCase("tr");

  switch (sel.market_type) {
    case "match_result": {
      if (label.startsWith("1 ")) return home > away ? "won" : "lost";
      if (/^x\b/i.test(label)) return home === away ? "won" : "lost";
      if (label.startsWith("2 ")) return away > home ? "won" : "lost";
      return null;
    }
    case "double_chance": {
      if (label === "1X") return home >= away ? "won" : "lost";
      if (label === "X2") return away >= home ? "won" : "lost";
      if (label === "12") return home !== away ? "won" : "lost";
      return null;
    }
    case "btts": {
      const both = home > 0 && away > 0;
      if (lower === "var") return both ? "won" : "lost";
      if (lower === "yok") return both ? "lost" : "won";
      return null;
    }
    case "over_under": {
      const line = parseFloat(label.match(/\d+(?:\.\d+)?/)?.[0] ?? "");
      if (Number.isNaN(line)) return null;
      const total = home + away;
      if (lower.startsWith("alt")) return total < line ? "won" : "lost";
      if (lower.startsWith("üst") || lower.startsWith("ust")) return total > line ? "won" : "lost";
      return null;
    }
    case "handicap": {
      if (label.startsWith("1 (+1)")) return home + 1 > away ? "won" : "lost";
      if (label.startsWith("2 (-1)")) return away - 1 > home ? "won" : "lost";
      return null;
    }
    default:
      return null; // corners, cards, first_half, player_bet: istatistik kaynağı yok
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (!isAuthorized(req)) return json({ error: "Unauthorized" }, 401);

  try {
    const { data: pending, error: slipsError } = await supabase
      .from("bet_slips")
      .select("id, bet_selections(id, home_team, away_team, selection_label, market_type)")
      .eq("status", "pending");
    if (slipsError) throw slipsError;
    if (!pending || pending.length === 0) return json({ settled: 0, total_pending: 0 });

    const { data: cached } = await supabase.from("live_scores_cache").select("payload").eq("id", 1).maybeSingle();
    const finished = ((cached?.payload as Score[] | null) ?? []).filter((s) => s.status === "BİTTİ");

    let settled = 0;
    for (const slip of pending as unknown as PendingSlip[]) {
      const results: Record<string, { outcome: Outcome }> = {};

      for (const sel of slip.bet_selections ?? []) {
        // Her iki takım da eşleşmeli (önceden VEYA idi: yanlış maça bağlanıyordu)
        const score = finished.find((s) => sameTeam(s.home, sel.home_team) && sameTeam(s.away, sel.away_team));
        if (!score) continue;
        const home = Number(score.homeScore), away = Number(score.awayScore);
        if (Number.isNaN(home) || Number.isNaN(away)) continue;
        const outcome = determineOutcome(sel, home, away);
        if (outcome) results[sel.id] = { outcome };
      }

      if (Object.keys(results).length === 0) continue;
      const { data, error } = await supabase.rpc("settle_bet_slip", { p_slip_id: slip.id, p_results: results });
      if (error) { console.error("settle_bet_slip failed", slip.id, error.message); continue; }
      if ((data as { status?: string } | null)?.status === "settled") settled++;
    }

    return json({ settled, total_pending: pending.length });
  } catch (error) {
    console.error("bet-settlement failed", error);
    return json({ error: "Settlement failed" }, 500);
  }
});
