# RockstarBet – Frontend Preview Mode

This package is configured for visual/UI review only.

## What changed
- Removed the Supabase client bootstrap and all runtime imports from the UI.
- Authentication forms remain visible but show a preview-only notice instead of creating accounts or signing in.
- Account data is empty/demo-safe; no user, balance, wallet, bonus, or bet data is persisted.
- Betting, cashout, bonus claims, freebet claims, and responsible-gambling settings do not execute backend actions.
- Match tracker uses illustrative local sample statistics/events.
- Live scores are disabled until a data provider/backend is connected.

## Backend files
The `supabase/` folder is retained as dormant project material for a later backend setup. It is not imported or contacted by the frontend in this preview build.

## Important
This is not a functional betting service. All displayed odds, match details, tracker events, and sample UI content are for interface preview only. No real transactions or account operations occur.

## Restore backend later
When backend work resumes, restore the Supabase client, runtime hooks, and API actions, then configure the required Vite environment variables in the hosting platform.
