import { ArrowRight, Gift, ShieldCheck } from 'lucide-react';
import type { ModalType } from '@/types';
import { SITE, hasLicense } from '@/config/site';
import { Brand } from '@/components/Brand';

type Props = {
  onOpen: (modal: ModalType, infoTitle?: string) => void;
  onGoMatches: () => void;
  onGoCasino: () => void;
};

export function SiteFooter({ onOpen, onGoMatches, onGoCasino }: Props) {
  const info = (title: string) => () => onOpen('info', title);

  const columns: Array<{ title: string; links: Array<[string, () => void]> }> = [
    { title: 'Bahis', links: [['Canlı Bahis', onGoMatches], ['Spor Bahisleri', onGoMatches], ['Maç Sonuçları', onGoMatches], ['Bahis Kuralları', info('Bahis Kuralları')]] },
    { title: 'Casino', links: [['Casino Oyunları', onGoCasino], ['Canlı Casino', onGoCasino], ['Slotlar', onGoCasino], ['Jackpot Oyunları', onGoCasino]] },
    { title: 'Yardım', links: [['Canlı Destek', info('Canlı Destek')], ['Sıkça Sorulanlar', info('Sıkça Sorulanlar')], ['AML / KYC Politikası', () => onOpen('aml')], ['Güvenli Oyun', () => onOpen('responsible')], ['İletişim', info('İletişim')]] },
  ];

  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Brand />
          <p>Güvenli, hızlı ve keyifli bahis deneyimi. Bahis eğlence amaçlıdır; kaybetmeyi göze alabileceğinden fazlasını oynama.</p>
          <div className="trust-row"><ShieldCheck size={17} /> <span>18+ · Sorumlu oyun</span></div>
        </div>

        {columns.map((col) => (
          <nav className="footer-column" key={col.title} aria-label={col.title}>
            <h3>{col.title}</h3>
            {col.links.map(([label, action]) => <button type="button" key={label} onClick={action}>{label}</button>)}
          </nav>
        ))}

        <div className="footer-promo">
          <Gift size={22} />
          <strong>Bonusları kaçırma</strong>
          <span>Yeni kampanyalardan ilk sen haberdar ol.</span>
          <button type="button" onClick={() => onOpen('promotions')}>Promosyonları Gör <ArrowRight size={15} /></button>
        </div>
      </div>

      {/* Lisans bilgisi yalnızca gerçek lisans .env ile tanımlıysa gösterilir. */}
      {hasLicense && (
        <div className="footer-license">
          <ShieldCheck size={16} />
          <span>
            {SITE.license.authority} · Lisans No: {SITE.license.number}
            {SITE.license.verifyUrl && <> · <a href={SITE.license.verifyUrl} target="_blank" rel="noopener noreferrer">Doğrula</a></>}
          </span>
        </div>
      )}

      <div className="footer-bottom">
        <span className="footer-copy">© {SITE.year} {SITE.name}. Tüm hakları saklıdır.</span>
        <div className="footer-legal">
          <button type="button" onClick={info('Gizlilik Politikası')}>Gizlilik Politikası</button>
          <button type="button" onClick={info('Kullanım Koşulları')}>Kullanım Koşulları</button>
          <button type="button" onClick={() => onOpen('aml')}>AML Politikası</button>
          <button type="button" onClick={() => onOpen('responsible')}>Sorumlu Bahis</button>
        </div>
        <span className="footer-age"><b>18+</b> Sorumlu oynayın.</span>
      </div>
    </footer>
  );
}
