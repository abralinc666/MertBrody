import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

type PendingSlip = {
  id: string;
  selections: Array<{ id: string; event_id: string; home_team: string; away_team: string; selection_label: string; market_type: string }>;
};

function determineOutcome(selection: PendingSlip['selections'][0], score: { homeScore: string; awayScore: string }): 'won' | 'lost' | 'void' {
  const home = Number(score.homeScore);
  const away = Number(score.awayScore);
  if (isNaN(home) || isNaN(away)) return 'void';

  const label = selection.selection_label.toLowerCase();

  if (selection.market_type === 'match_result') {
    if (label.includes('1') || label.includes('ev') || label.includes('home')) return home > away ? 'won' : 'lost';
    if (label.includes('x') || label.includes('beraber') || label.includes('draw')) return home === away ? 'won' : 'lost';
    if (label.includes('2') || label.includes('dep') || label.includes('away')) return away > home ? 'won' : 'lost';
  }
  if (selection.market_type === 'btts') {
    const both = home > 0 && away > 0;
    if (label.includes('var') || label.includes('yes')) return both ? 'won' : 'lost';
    if (label.includes('yok') || label.includes('no')) return !both ? 'won' : 'lost';
  }
  if (selection.market_type === 'over_under') {
    const total = home + away;
    if (label.includes('alt') || label.includes('under')) {
      const line = parseFloat(label.match(/[\d.]+/)?.[0] || '2.5');
      return total < line ? 'won' : 'lost';
    }
    if (label.includes('üst') || label.includes('over')) {
      const line = parseFloat(label.match(/[\d.]+/)?.[0] || '2.5');
      return total > line ? 'won' : 'lost';
    }
  }
  return 'void';
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    // Fetch all pending bet slips with their selections
    const { data: pendingSlips, error: slipsError } = await supabase
      .from("bet_slips")
      .select(`
        id,
        bet_selections (
          id, event_id, home_team, away_team, selection_label, market_type
        )
      `)
      .eq("status", "pending");

    if (slipsError) throw slipsError;
    if (!pendingSlips || pendingSlips.length === 0) {
      return new Response(
        JSON.stringify({ settled: 0, message: "No pending slips to settle" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Fetch cached live scores
    const { data: cached } = await supabase
      .from("live_scores_cache")
      .select("payload")
      .eq("id", 1)
      .maybeSingle();

    const liveScores = (cached?.payload as Array<{ id: string; home: string; away: string; homeScore: string; awayScore: string; status: string }>) || [];
    const finishedScores = liveScores.filter((s) => s.status === "PROGRAMDA" || s.status === "FINAL" || s.status === "Bitti");

    let settledCount = 0;

    for (const slip of pendingSlips as unknown as PendingSlip[]) {
      if (!slip.selections || slip.selections.length === 0) continue;

      const results: Record<string, { outcome: string }> = {};
      let allResolved = true;

      for (const selection of slip.selections) {
        // Try to match selection to a live score by team name
        const matchingScore = finishedScores.find(
          (s) => s.home.includes(selection.home_team) || s.away.includes(selection.away_team) ||
                 selection.home_team.includes(s.home) || selection.away_team.includes(s.away)
        );

        if (matchingScore) {
          results[selection.id] = { outcome: determineOutcome(selection, matchingScore) };
        } else {
          allResolved = false;
        }
      }

      if (allResolved && Object.keys(results).length > 0) {
        const { error: settleError } = await supabase.rpc("settle_bet_slip", {
          p_slip_id: slip.id,
          p_results: results,
        });

        if (!settleError) settledCount++;
      }
    }

    return new Response(
      JSON.stringify({ settled: settledCount, total_pending: pendingSlips.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("bet-settlement failed", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});