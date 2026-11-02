// Marka ve yasal bilgiler tek yerden yönetilir.
// Lisans bilgisi yalnızca gerçek bir lisansın varsa .env ile verilmelidir;
// boş bırakılırsa footer'da hiçbir lisans/doğrulama iddiası gösterilmez.
export const SITE = {
  name: 'RockstarBet',
  nameParts: ['Rockstar', 'Bet'] as const,
  year: new Date().getFullYear(),
  helpline: '190',
  license: {
    authority: (import.meta.env.VITE_LICENSE_AUTHORITY as string | undefined) || '',
    number: (import.meta.env.VITE_LICENSE_NUMBER as string | undefined) || '',
    verifyUrl: (import.meta.env.VITE_LICENSE_VERIFY_URL as string | undefined) || '',
  },
} as const;

export const hasLicense = Boolean(SITE.license.authority && SITE.license.number);
