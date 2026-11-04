// LovelyCam V4.0 - Ticari Sistem, Premium Üyelik, Ödeme ve Abonelik Yönetimi
const PaymentSystem = {
    PLANS: {
        gold: { id: 'gold', name: 'Gold Üyelik', price: 499, period: 'Ay', badge: 'GOLD', features: ['Kilitli Fotoğrafları Açma', 'Sınırsız Mesajlaşma', 'Özel Gold Çerçeve', 'Reklamsız Deneyim'] },
        vip: { id: 'vip', name: 'VIP Üyelik', price: 999, period: 'Ay', badge: 'VIP', popular: true, features: ['Tüm Gold Özellikleri', 'WhatsApp & Telefon Numaralarını Görme', 'Öncelikli Mesaj Gösterimi', 'Şifreli Fotoğraf Gönderimi'] },
        elite: { id: 'elite', name: 'Elite Royal', price: 1999, period: 'Ay', badge: 'ELITE', elite: true, features: ['Tüm VIP Özellikleri', 'Elite Altın Profil Çerçevesi', '7/24 Özel Concierge Desteği', 'Keşfet Vitrininde Öncelik'] }
    },

    getUserWallet(userId) {
        const users = JSON.parse(localStorage.getItem('lovelycam_users') || '[]');
        const u = users.find(x => x.id === userId);
        return u ? (Number(u.balance) || 0) : 0;
    },

    getTransactions(userId) {
        try {
            return JSON.parse(localStorage.getItem('lovelycam_transactions_' + userId) || '[]');
        } catch {
            return [];
        }
    },

    addTransaction(userId, tx) {
        const list = this.getTransactions(userId);
        const item = {
            id: 'tx_' + Date.now(),
            timestamp: new Date().toISOString(),
            ...tx
        };
        list.unshift(item);
        localStorage.setItem('lovelycam_transactions_' + userId, JSON.stringify(list));

        // Global revenue log for Admin Panel
        const allTx = JSON.parse(localStorage.getItem('lovelycam_all_transactions') || '[]');
        allTx.unshift({ userId, ...item });
        localStorage.setItem('lovelycam_all_transactions', JSON.stringify(allTx));
        return item;
    },

    depositFunds(userId, amount, method = 'Kredi Kartı (3D Secure)') {
        const num = Number(amount);
        if (!num || num <= 0) return { success: false, message: 'Geçerli bir tutar girin.' };

        const users = JSON.parse(localStorage.getItem('lovelycam_users') || '[]');
        const idx = users.findIndex(u => u.id === userId);
        if (idx === -1) return { success: false, message: 'Kullanıcı bulunamadı.' };

        users[idx].balance = (Number(users[idx].balance) || 0) + num;
        localStorage.setItem('lovelycam_users', JSON.stringify(users));

        this.addTransaction(userId, {
            type: 'deposit',
            title: `Bakiye Yükleme (${method})`,
            amount: num,
            status: 'completed'
        });

        return { success: true, balance: users[idx].balance };
    },

    subscribePlan(userId, planId, payWithCard = false) {
        const plan = this.PLANS[planId];
        if (!plan) return { success: false, message: 'Geçersiz paket.' };

        const users = JSON.parse(localStorage.getItem('lovelycam_users') || '[]');
        const idx = users.findIndex(u => u.id === userId);
        if (idx === -1) return { success: false, message: 'Kullanıcı bulunamadı.' };

        const currentBalance = Number(users[idx].balance) || 0;
        if (!payWithCard && currentBalance < plan.price) {
            return { success: false, message: `Cüzdan bakiyeniz yetersiz (${currentBalance} ₺). Lütfen bakiye yükleyin veya kartla ödeyin.` };
        }

        if (!payWithCard) {
            users[idx].balance = currentBalance - plan.price;
        }

        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        users[idx].isPremium = true;
        users[idx].subscription = {
            planId: plan.id,
            planName: plan.name,
            badge: plan.badge,
            price: plan.price,
            startedAt: new Date().toISOString(),
            expiresAt: expiresAt,
            autoRenew: true,
            status: 'active'
        };

        localStorage.setItem('lovelycam_users', JSON.stringify(users));

        this.addTransaction(userId, {
            type: 'subscription',
            title: `${plan.name} Aboneliği`,
            amount: -plan.price,
            method: payWithCard ? 'Kredi Kartı (Direkt Çekim)' : 'Cüzdan Bakiyesi',
            status: 'completed'
        });

        return { success: true, subscription: users[idx].subscription, balance: users[idx].balance };
    },

    cancelSubscription(userId) {
        const users = JSON.parse(localStorage.getItem('lovelycam_users') || '[]');
        const idx = users.findIndex(u => u.id === userId);
        if (idx === -1 || !users[idx].subscription) return false;

        users[idx].subscription.autoRenew = false;
        users[idx].subscription.status = 'cancelled';
        localStorage.setItem('lovelycam_users', JSON.stringify(users));
        return true;
    },

    openDepositModal(onSuccessCallback) {
        const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        if (!user) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 460px; padding: 28px;">
                <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h3 style="margin-bottom: 18px;"><i class="fas fa-credit-card" style="color: var(--primary-color);"></i> Güvenli Bakiye Yükle (256-Bit SSL)</h3>
                <form id="deposit-modal-form" style="display: grid; gap: 14px;">
                    <div>
                        <label style="font-size: 0.85rem; color: var(--text-muted);">Yüklenecek Tutar (₺)</label>
                        <div style="display: flex; gap: 8px; margin: 8px 0;">
                            <button type="button" class="filter-btn secondary" style="padding:6px 12px; font-size:0.8rem;" onclick="document.getElementById('dep-amount').value=500">500 ₺</button>
                            <button type="button" class="filter-btn secondary" style="padding:6px 12px; font-size:0.8rem;" onclick="document.getElementById('dep-amount').value=1000">1.000 ₺</button>
                            <button type="button" class="filter-btn secondary" style="padding:6px 12px; font-size:0.8rem;" onclick="document.getElementById('dep-amount').value=2500">2.500 ₺</button>
                        </div>
                        <input type="number" id="dep-amount" min="100" max="100000" value="1000" required style="width:100%; padding:12px; border-radius:10px; border:1px solid var(--glass-border); background:var(--bg-secondary); color:var(--text-color);">
                    </div>
                    <div>
                        <label style="font-size: 0.85rem; color: var(--text-muted);">Ödeme Yöntemi</label>
                        <select id="dep-method" style="width:100%; padding:12px; border-radius:10px; border:1px solid var(--glass-border); background:var(--bg-secondary); color:var(--text-color); margin-top:5px;">
                            <option value="Kredi / Banka Kartı (3D Secure)">💳 Kredi / Banka Kartı (3D Secure)</option>
                            <option value="USDT (TRC20 Kripto)">🪙 USDT (TRC20 Kripto Transfer)</option>
                            <option value="FAST / Havale">🏦 Anında FAST / Banka Havalesi</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size: 0.85rem; color: var(--text-muted);">Kart Numarası</label>
                        <input type="text" placeholder="4543 •••• •••• ••••" maxlength="19" required style="width:100%; padding:12px; border-radius:10px; border:1px solid var(--glass-border); background:var(--bg-secondary); color:var(--text-color); margin-top:5px;">
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <input type="text" placeholder="AA / YY" maxlength="5" required style="padding:12px; border-radius:10px; border:1px solid var(--glass-border); background:var(--bg-secondary); color:var(--text-color);">
                        <input type="text" placeholder="CVV (3 Hane)" maxlength="3" required style="padding:12px; border-radius:10px; border:1px solid var(--glass-border); background:var(--bg-secondary); color:var(--text-color);">
                    </div>
                    <button type="submit" class="auth-submit" style="margin-top:8px;"><i class="fas fa-lock"></i> Ödemeyi Tamamla</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#deposit-modal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = document.getElementById('dep-amount').value;
            const method = document.getElementById('dep-method').value;
            const res = this.depositFunds(user.id, amount, method);
            modal.remove();
            if (res.success) {
                if (typeof showNotification === 'function') showNotification(`${amount} ₺ cüzdanınıza yüklendi!`, 'success');
                if (typeof onSuccessCallback === 'function') onSuccessCallback(res);
            }
        });
    }
};

window.PaymentSystem = PaymentSystem;
