import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { LiveScore } from '@/types';

export function useLiveScores(refreshIntervalMs = 60000) {
  const [liveScores, setLiveScores] = useState<LiveScore[]>([]);
  const [liveError, setLiveError] = useState('');

  useEffect(() => {
    const loadLiveScores = async () => {
      const { data, error } = await supabase.functions.invoke<unknown>('live-scores', { body: undefined });
      if (error || !data) { setLiveError('Canlı veri şu an güncellenemedi.'); return; }
      const parsed = data as { scores?: LiveScore[] };
      if (!Array.isArray(parsed.scores)) { setLiveError('Canlı veri şu an güncellenemedi.'); return; }
      setLiveScores(parsed.scores);
    };
    void loadLiveScores();
    const timer = window.setInterval(() => void loadLiveScores(), refreshIntervalMs);
    return () => window.clearInterval(timer);
  }, [refreshIntervalMs]);

  return { liveScores, liveError };
}
