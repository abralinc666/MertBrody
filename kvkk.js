// LovelyCam V4.0 - KVKK & Gizlilik Uyumluluğu Modülü (6698 Sayılı KVKK)
const KVKKManager = {
    CONSENT_KEY: 'lovelycam_kvkk_consent',

    init() {
        if (!localStorage.getItem(this.CONSENT_KEY)) {
            this.renderBanner();
        }
    },

    renderBanner() {
        if (document.getElementById('kvkk-consent-banner')) return;
        const banner = document.createElement('div');
        banner.id = 'kvkk-consent-banner';
        banner.className = 'kvkk-banner';
        banner.innerHTML = `
            <div>
                <strong style="color: var(--text-color); display:block; margin-bottom:4px;">
                    <i class="fas fa-user-shield" style="color: var(--primary-color);"></i> 6698 Sayılı KVKK ve Çerez Aydınlatma Metni
                </strong>
                <p>
                    LovelyCam olarak kişisel verilerinizi 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında uçtan uca şifreli (AES-256-GCM) olarak işliyor ve koruyoruz. 
                    Detaylı bilgi için <a onclick="KVKKManager.openModal()">Aydınlatma Metni ve Gizlilik Sözleşmesi</a>'ni inceleyebilirsiniz.
                </p>
            </div>
            <div class="kvkk-actions">
                <button class="filter-btn secondary" onclick="KVKKManager.accept('essential')" style="padding: 8px 16px; font-size: 0.82rem;">Sadece Zorunlu</button>
                <button class="filter-btn primary" onclick="KVKKManager.accept('all')" style="padding: 8px 18px; font-size: 0.82rem;"><i class="fas fa-check"></i> Kabul Et</button>
            </div>
        `;
        document.body.appendChild(banner);
    },

    accept(level) {
        localStorage.setItem(this.CONSENT_KEY, JSON.stringify({
            level,
            acceptedAt: new Date().toISOString(),
            version: '4.0'
        }));
        const banner = document.getElementById('kvkk-consent-banner');
        if (banner) banner.remove();
        if (typeof showNotification === 'function') {
            showNotification('KVKK ve gizlilik tercihleriniz kaydedildi.', 'success');
        }
    },

    openModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px; padding: 28px; max-height: 85vh; overflow-y: auto;">
                <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h3 style="margin-bottom: 15px;"><i class="fas fa-scale-balanced" style="color: var(--primary-color);"></i> 6698 Sayılı KVKK Aydınlatma Metni</h3>
                <div style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.7; display: grid; gap: 12px;">
                    <p><strong>1. Veri Sorumlusu:</strong> LovelyCam Dijital Platform Hizmetleri olarak kişisel verilerinizin güvenliğine en üst düzeyde önem veriyoruz.</p>
                    <p><strong>2. İşlenen Veriler ve Güvenlik:</strong> Parolalarınız Argon2id algoritması ile tuzlanarak hashlenir; özel mesajlarınız ve medya paylaşımlarınız AES-256-GCM uçtan uca şifreleme (E2EE) ile korunur.</p>
                    <p><strong>3. KVKK Madde 11 Kapsamındaki Haklarınız:</strong> Kullanıcı Paneli > Ayarlar sekmesinden tüm kişisel verilerinizi JSON formatında indirebilir (Veri Taşınabilirliği) veya hesabınızı ve tüm mesaj geçmişinizi kalıcı olarak silebilirsiniz (Unutulma Hakkı).</p>
                </div>
                <button class="auth-submit" style="margin-top: 20px;" onclick="KVKKManager.accept('all'); this.parentElement.parentElement.remove();">Okudum, Onaylıyorum</button>
            </div>
        `;
        document.body.appendChild(modal);
    },

    exportUserData() {
        const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        if (!user) {
            if (typeof showNotification === 'function') showNotification('Veri indirmek için giriş yapmalısınız.', 'warning');
            return;
        }
        const allMessages = JSON.parse(localStorage.getItem('lovelycam_messages') || '[]')
            .filter(m => m.senderId === user.id || m.recipientId === user.id);
        const transactions = JSON.parse(localStorage.getItem('lovelycam_transactions_' + user.id) || '[]');
        const payload = {
            exportDate: new Date().toISOString(),
            kvkkCompliance: '6698 Sayılı KVKK Madde 11 - Veri Taşınabilirliği',
            profile: user,
            encryptedMessagesCount: allMessages.length,
            messages: allMessages,
            transactions: transactions
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lovelycam_kvkk_verilerim_${user.username}.json`;
        a.click();
        URL.revokeObjectURL(url);
        if (typeof showNotification === 'function') {
            showNotification('KVKK veri paketiniz indirildi.', 'success');
        }
    },

    deleteAccountPermanently() {
        const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        if (!user) return;
        if (!confirm('KVKK Unutulma Hakkı kapsamında hesabınız, mesajlarınız ve cüzdan verileriniz KALICI olarak silinecektir. Onaylıyor musunuz?')) return;

        const users = JSON.parse(localStorage.getItem('lovelycam_users') || '[]').filter(u => u.id !== user.id);
        localStorage.setItem('lovelycam_users', JSON.stringify(users));

        const msgs = JSON.parse(localStorage.getItem('lovelycam_messages') || '[]')
            .filter(m => m.senderId !== user.id && m.recipientId !== user.id);
        localStorage.setItem('lovelycam_messages', JSON.stringify(msgs));

        localStorage.removeItem('e2ee_keys_' + user.id);
        localStorage.removeItem('lovelycam_transactions_' + user.id);
        localStorage.removeItem('lovelycam_session');

        window.location.href = 'index.html';
    }
};

window.KVKKManager = KVKKManager;
document.addEventListener('DOMContentLoaded', () => KVKKManager.init());
