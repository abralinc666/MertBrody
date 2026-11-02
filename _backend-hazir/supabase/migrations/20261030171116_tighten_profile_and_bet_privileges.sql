/*
# Tighten profile and betting data privileges

1. Modified Tables
- `profiles`: remove broad anon and authenticated table grants; keep private SELECT and only display_name/avatar_url updates for authenticated users.
- `bets`: remove broad anon and authenticated write grants; keep private SELECT for authenticated users.

2. Security Changes
- Anonymous users can no longer reach private account or betting history tables.
- Authenticated users cannot insert, update, or delete bets directly.
- The existing `place_bet` SECURITY DEFINER function remains the only betting write path and continues to derive ownership from auth.uid().
*/

REVOKE ALL ON public.profiles FROM anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (display_name, avatar_url) ON public.profiles TO authenticated;

REVOKE ALL ON public.bets FROM anon, authenticated;
GRANT SELECT ON public.bets TO authenticated;

REVOKE EXECUTE ON FUNCTION public.place_bet(text, text, text, text, text, numeric, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.place_bet(text, text, text, text, text, numeric, numeric) TO authenticated;
