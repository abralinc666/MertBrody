import { ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

type Props = {
  onClose: () => void;
  label: string;
  className?: string;
  children: ReactNode;
};

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Ortak modal kabuğu: Esc ile kapanma, sayfa kaydırmasını kilitleme, odak yakalama, erişilebilirlik. */
export function ModalShell({ onClose, label, className = '', children }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const pressStartedOnBackdrop = useRef(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    cardRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeRef.current(); return; }
      if (e.key !== 'Tab' || !cardRef.current) return;
      const items = Array.from(cardRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, []);

  return (
    <div
      className="modal-backdrop"
      // Metin seçerken fare dışarı kayınca pencerenin kapanmasını önlemek için basma + bırakma ikisi de arka planda olmalı
      onMouseDown={(e) => { pressStartedOnBackdrop.current = e.target === e.currentTarget; }}
      onClick={(e) => { if (pressStartedOnBackdrop.current && e.target === e.currentTarget) onClose(); }}
    >
      <div ref={cardRef} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} className={`modal-card ${className}`.trim()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Pencereyi kapat"><X size={18} /></button>
        {children}
      </div>
    </div>
  );
}
