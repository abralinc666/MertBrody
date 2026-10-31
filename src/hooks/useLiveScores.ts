import type { LiveScore } from '@/types';

// Live data is intentionally disabled in the frontend-only design preview.
export function useLiveScores(_refreshIntervalMs = 60000) {
  const liveScores: LiveScore[] = [];
  const liveError = '';
  return { liveScores, liveError };
}
