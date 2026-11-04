// Demo canlı akışın anlık durumunu servis katmanıyla paylaşır (piyasa açık mı, hangi tur).
export type LiveMatchState = { status: 'live' | 'ht' | 'ft'; round: number; home: number; away: number };

const registry = new Map<string, LiveMatchState>();

export const setMatchState = (eventId: string, state: LiveMatchState) => { registry.set(eventId, state); };
export const getMatchState = (eventId: string): LiveMatchState | undefined => registry.get(eventId);
