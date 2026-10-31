import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type EspnCompetitor = { team?: { displayName?: string }; score?: string; winner?: boolean };
type EspnEvent = { id?: string; name?: string; status?: { type?: { shortDetail?: string; state?: string } }; competitions?: Array<{ competitors?: EspnCompetitor[] }> };

type Score = { id: string; sport: string; home: string; away: string; homeScore: string; awayScore: string; time: string; status: string };

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

async function fetchUpstream(league: string): Promise<Score[]> {
  const upstream = `https://site.api.espn.com/apis/site/v2/sports/soccer/${encodeURIComponent(league)}/scoreboard`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(upstream, { headers: { Accept: "application/json" }, signal: controller.signal });
    if (!response.ok) throw new Error(`Upstream scores request failed: ${response.status}`);
    const payload = await response.json() as { events?: EspnEvent[] };
    return (payload.events || []).map((event) => {
      const competitors = event.competitions?.[0]?.competitors || [];
      const home = competitors.find((c) => c.winner || c.team?.displayName === event.name?.split(' at ')[1]) || competitors[1] || competitors[0];
      const away = competitors.find((c) => c !== home) || competitors[0];
      return {
        id: event.id || crypto.randomUUID(),
        sport: "Futbol",
        home: home?.team?.displayName || "Ev sahibi",
        away: away?.team?.displayName || "Deplasman",
        homeScore: home?.score || "0",
        awayScore: away?.score || "0",
        time: event.status?.type?.shortDetail || "Yakında",
        status: event.status?.type?.state === "in" ? "CANLI" : "PROGRAMDA",
      };
    });
  } finally {
    clearTimeout(timeout);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const league = url.searchParams.get("league") || "eng.1";

    // Check DB cache first
    const { data: cached } = await supabase
      .from("live_scores_cache")
      .select("payload, fetched_at, ttl_seconds")
      .eq("id", 1)
      .maybeSingle();

    const now = Date.now();
    if (cached && cached.payload && now - new Date(cached.fetched_at).getTime() < cached.ttl_seconds * 1000) {
      return new Response(
        JSON.stringify({ scores: cached.payload, source: "ESPN", cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Fetch fresh data from upstream with timeout
    const scores: Score[] = await fetchUpstream(league);

    // Persist to DB cache
    await supabase
      .from("live_scores_cache")
      .upsert({ id: 1, payload: scores, fetched_at: new Date().toISOString(), ttl_seconds: 15 })
      .eq("id", 1);

    return new Response(
      JSON.stringify({ scores, source: "ESPN", cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("live-scores failed", error);

    // On failure, try returning stale cache
    const { data: stale } = await supabase
      .from("live_scores_cache")
      .select("payload")
      .eq("id", 1)
      .maybeSingle();

    if (stale?.payload) {
      return new Response(
        JSON.stringify({ scores: stale.payload, source: "ESPN", stale: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ error: "Canlı skorlar şu anda alınamıyor." }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});