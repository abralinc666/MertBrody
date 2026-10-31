import { ArrowRight } from 'lucide-react';
import { heroSlides } from '@/data/sports';

type Props = {
  slideIndex: number;
  onDotClick: (index: number) => void;
  onCtaClick: () => void;
};

export function HeroCarousel({ slideIndex, onDotClick, onCtaClick }: Props) {
  return (
    <section className="hero-card">
      <div className="hero-slide-track" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
        {heroSlides.map((s, i) => (
          <div className="hero-slide" key={s.title} aria-hidden={i !== slideIndex}>
            <div className="hero-copy">
              <span className="eyebrow">{s.kicker}</span>
              <strong>{s.value}</strong>
              <p>{s.title}</p>
              <small className="hero-description">{s.description}</small>
              <button className="cta-btn" onClick={onCtaClick} tabIndex={i === slideIndex ? 0 : -1}>
                Şimdi Faydalan <ArrowRight size={17} />
              </button>
            </div>
            <div className="hero-player"><div className="player-aura" /><div className="player-silhouette">B</div></div>
          </div>
        ))}
      </div>
      <div className="hero-dots">
        {heroSlides.map((s, i) => (
          <button
            aria-label={`${s.title} kampanyasına geç`}
            className={i === slideIndex ? 'selected' : ''}
            key={s.title}
            onClick={() => onDotClick(i)}
          />
        ))}
      </div>
      <div className="hero-progress">
        <span style={{ width: `${((slideIndex + 1) / heroSlides.length) * 100}%` }} />
      </div>
    </section>
  );
}
