import { Star } from 'lucide-react';
import { SITE } from '@/config/site';

export function Brand() {
  return (
    <div className="brand" aria-label={SITE.name}>
      <span className="brand-mark" aria-hidden><Star size={34} fill="currentColor" strokeWidth={1.5} /></span>
      <span className="brand-name">{SITE.nameParts[0]}<span>{SITE.nameParts[1]}</span></span>
    </div>
  );
}
