import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides } from '@/data/sports';

type Props = {
  slideIndex: number;
  ctaLabel: string;
  onDotClick: (index: number) => void;
  onCtaClick: () => void;
};

/** Deterministik (rastgelesiz) gökdelen listesi. */
function skyline(start: number, count: number, minH: number, maxH: number, minW: number, maxW: number) {
  const items: Array<{ x: number; w: number; h: number }> = [];
  let x = start;
  for (let i = 0; i < count; i++) {
    const r1 = Math.abs(Math.sin((i + 1) * 12.9898 + start));
    const r2 = Math.abs(Math.sin((i + 1) * 78.233 + start));
    const w = Math.round(minW + r1 * (maxW - minW));
    const h = Math.round(minH + r2 * (maxH - minH));
    items.push({ x, w, h });
    x += w + 2;
  }
  return items;
}

const FAR = skyline(430, 20, 90, 250, 34, 62);
const MID = skyline(520, 18, 70, 190, 40, 70);
const NEAR = skyline(380, 22, 40, 120, 46, 90);

function Palm({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} fill="#14052b">
      <path d="M0 0 C 6 -60 -4 -120 10 -190 L 19 -190 C 7 -120 17 -60 13 0 Z" />
      {[-110, -70, -32, 8, 48, 88, 125].map((a) => (
        <path key={a} transform={`translate(14 -190) rotate(${a})`} d="M0 0 C 30 -34 84 -34 126 12 C 84 -8 40 -8 0 8 Z" />
      ))}
    </g>
  );
}

/** Özgün vektör çizim: gün batımında şehir silüeti, palmiyeler ve helikopter. */
function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 1200 420" preserveAspectRatio="xMaxYMax slice" aria-hidden focusable="false">
      <defs>
        <linearGradient id="hk-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a0e5c" />
          <stop offset=".5" stopColor="#a02a9d" />
          <stop offset="1" stopColor="#ff8a3d" />
        </linearGradient>
        <radialGradient id="hk-sun" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff2b0" stopOpacity=".95" />
          <stop offset=".45" stopColor="#ffb04a" stopOpacity=".7" />
          <stop offset="1" stopColor="#ff5aa8" stopOpacity="0" />
        </radialGradient>
        <pattern id="hk-win" width="14" height="18" patternUnits="userSpaceOnUse">
          <rect x="4" y="5" width="4" height="7" fill="#ffd98a" opacity=".7" />
        </pattern>
      </defs>
      <rect width="1200" height="420" fill="url(#hk-sky)" />
      <circle cx="800" cy="290" r="190" fill="url(#hk-sun)" />
      {[...Array(14)].map((_, i) => (
        <circle key={i} cx={40 + ((i * 97) % 1100)} cy={20 + ((i * 53) % 130)} r={i % 3 === 0 ? 1.6 : 1} fill="#fff" opacity=".6" />
      ))}
      {FAR.map((b, i) => <rect key={`f${i}`} x={b.x} y={420 - b.h - 40} width={b.w} height={b.h + 40} fill="#8a2f95" opacity=".75" />)}
      {MID.map((b, i) => <rect key={`m${i}`} x={b.x + 60} y={420 - b.h - 20} width={b.w} height={b.h + 20} fill="#4a1a7d" />)}
      {NEAR.map((b, i) => (
        <g key={`n${i}`}>
          <rect x={b.x + 90} y={420 - b.h} width={b.w} height={b.h} fill="#240b48" />
          <rect x={b.x + 90} y={420 - b.h} width={b.w} height={b.h} fill="url(#hk-win)" opacity=".8" />
        </g>
      ))}
      <rect x="0" y="392" width="1200" height="28" fill="#12051f" />
      <Palm x={1120} y={420} s={1.15} />
      <Palm x={1190} y={420} s={.8} flip />
      <Palm x={330} y={420} s={.9} />
      <g transform="translate(640 112)" fill="#1a0833">
        <ellipse cx="0" cy="0" rx="28" ry="13" />
        <path d="M-24 -3 L-86 -9 L-88 -2 L-26 6 Z" />
        <rect x="-3" y="-20" width="6" height="8" />
        <rect x="-52" y="-22" width="104" height="3" rx="1.5" />
        <path d="M-20 16 H22" stroke="#1a0833" strokeWidth="3" />
      </g>
    </svg>
  );
}

export function HeroCarousel({ slideIndex, ctaLabel, onDotClick, onCtaClick }: Props) {
  const n = heroSlides.length;
  return (
    <section className="hero-card" aria-roledescription="carousel" aria-label="Kampanyalar">
      <div className="hero-slide-track" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
        {heroSlides.map((s, i) => (
          <div className="hero-slide" key={s.title} aria-hidden={i !== slideIndex}>
            <HeroArt />
            <div className="hero-copy">
              <span className="eyebrow">{s.kicker}</span>
              <strong>{s.value}</strong>
              <p>{s.title}</p>
              <small className="hero-description">{s.description}</small>
              <button type="button" className="cta-btn" onClick={onCtaClick} tabIndex={i === slideIndex ? 0 : -1}>
                {ctaLabel} <ArrowRight size={17} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="hero-arrow prev" onClick={() => onDotClick((slideIndex - 1 + n) % n)} aria-label="Önceki kampanya"><ChevronLeft size={22} /></button>
      <button type="button" className="hero-arrow next" onClick={() => onDotClick((slideIndex + 1) % n)} aria-label="Sonraki kampanya"><ChevronRight size={22} /></button>
      <div className="hero-dots">
        {heroSlides.map((s, i) => (
          <button type="button" aria-label={`${s.title} kampanyasına geç`} aria-current={i === slideIndex} className={i === slideIndex ? 'selected' : ''} key={s.title} onClick={() => onDotClick(i)} />
        ))}
      </div>
    </section>
  );
}
