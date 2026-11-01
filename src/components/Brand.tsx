import { ShieldCheck } from 'lucide-react';
import { SITE } from '@/config/site';

export function Brand() {
  return (
    <div className="brand" aria-label={SITE.name}>
      <span className="brand-mark" aria-hidden><ShieldCheck size={22} /></span>
      <span className="brand-name">{SITE.nameParts[0]}<span>{SITE.nameParts[1]}</span></span>
    </div>
  );
}
