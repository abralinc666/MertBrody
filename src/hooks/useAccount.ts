import { useSyncExternalStore } from 'react';
import { api } from '@/services/api';

/** Oturum ve hesap verisi. Demo arka uçtaki her değişiklik ekrana anında yansır. */
export function useAccount() {
  return useSyncExternalStore(api.subscribe, api.getSnapshot, api.getSnapshot);
}
