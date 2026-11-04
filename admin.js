// LovelyCam V4.0 - Admin Panel Controller
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initAdminPanel, 120);
});

function initAdminPanel() {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (user && document.getElementById('admin-name-display')) {
        document.getElementById('admin-name-display').textContent = user.username;
    }
    renderAdminStats();
    renderAdminUsers();
    renderAdminProfiles();
    renderAdminReports();
    renderAdminKYC();
    renderAdminLogs();

    const searchInput = document.getElementById('admin-user-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => renderAdminUsers(e.target.value));
    }
}

window.switchAdminTab = function(tabId, btnEl) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-nav button').forEach(b => b.classList.remove('active'));
    const target = document.getElementById('admin-tab-' + tabId);
    if (target) target.classList.add('active');
    if (btnEl) btnEl.classList.add('active');
};

function renderAdminStats() {
    const users = JSON.parse(localStorage.getItem('lovelycam_users') || '[]');
    const profiles = typeof getAllProfiles === 'function' ? getAllProfiles() : MOCK_USERS;
    const reports = Security.moderation.getReports();
    const allTx = JSON.parse(localStorage.getItem('lovelycam_all_transactions') || '[]');

    const totalRevenue = allTx.reduce((acc, tx) => acc + Math.abs(Number(tx.amount) || 0), 0) + 48500;

    document.getElementById('stat-total-users').textContent = users.length;
    document.getElementById('stat-vip-profiles').textContent = profiles.length;
    document.getElementById('stat-total-revenue').textContent = totalRevenue.toLocaleString('tr-TR') + ' ₺';
    document.getElementById('stat-pending-reports').textContent = reports.filter(r => r.status === 'pending').length;

    const txBody = document.getElementById('admin-tx-tbody');
    if (txBody) {
        if (allTx.length === 0) {
            txBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">Henüz yeni işlem kaydı yok.</td></tr>';
        } else {
            txBody.innerHTML = allTx.slice(0, 10).map(tx => `
                <tr>
                    <td><code>${escapeHtml(tx.id)}</code></td>
                    <td>${escapeHtml(tx.userId)}</td>
                    <td>${escapeHtml(tx.title)}</td>
                    <td style="color:#22c55e; font-weight:600;">${Math.abs(tx.amount)} ₺</td>
                    <td>${new Date(tx.timestamp).toLocaleString('tr-TR')}</td>
                </tr>
            `).join('');
        }
    }
}

function renderAdminUsers(query = '') {
    const users = JSON.parse(localStorage.getItem('lovelycam_users') || '[]');
    const q = query.toLowerCase().trim();
    const filtered = users.filter(u => !q || u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    const tbody = document.getElementById('admin-users-tbody');
    if (!tbody) return;

    tbody.innerHTML = filtered.map(u => `
        <tr>
            <td><strong>${escapeHtml(u.username)}</strong></td>
            <td>${escapeHtml(u.email)}</td>
            <td><span class="badge-pill ${u.role === 'admin' ? 'badge-warning' : 'badge-success'}">${escapeHtml(u.role || 'customer')}</span></td>
            <td>${Number(u.balance || 0).toLocaleString('tr-TR')} ₺</td>
            <td><span class="badge-pill ${u.isBanned ? 'badge-danger' : 'badge-success'}">${u.isBanned ? 'Askıda' : 'Aktif'}</span></td>
            <td style="display:flex; gap:6px;">
                <button class="filter-btn secondary" style="padding:5px 10px; font-size:0.75rem;" onclick="toggleUserVIP('${u.id}')">VIP</button>
                <button class="filter-btn secondary" style="padding:5px 10px; font-size:0.75rem; color:#ef4444;" onclick="toggleUserBan('${u.id}')">${u.isBanned ? 'Aç' : 'Banla'}</button>
            </td>
        </tr>
    `).join('');
}

window.toggleUserVIP = function(userId) {
    const users = JSON.parse(localStorage.getItem('lovelycam_users') || '[]');
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
        users[idx].isPremium = !users[idx].isPremium;
        localStorage.setItem('lovelycam_users', JSON.stringify(users));
        renderAdminUsers();
    }
};

window.toggleUserBan = function(userId) {
    const users = JSON.parse(localStorage.getItem('lovelycam_users') || '[]');
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
        users[idx].isBanned = !users[idx].isBanned;
        localStorage.setItem('lovelycam_users', JSON.stringify(users));
        Security.logger.log('WARN', `Kullanıcı durumu değiştirildi: ${users[idx].username} (Ban: ${users[idx].isBanned})`);
        renderAdminUsers();
        renderAdminLogs();
    }
};

function renderAdminProfiles() {
    const profiles = typeof getAllProfiles === 'function' ? getAllProfiles() : MOCK_USERS;
    const tbody = document.getElementById('admin-profiles-tbody');
    if (!tbody) return;

    tbody.innerHTML = profiles.map(p => `
        <tr>
            <td style="display:flex; align-items:center; gap:10px;">
                <img src="${p.thumbnail}" style="width:38px; height:38px; border-radius:50%; object-fit:cover;">
                <strong>${escapeHtml(p.name)}</strong>
            </td>
            <td>${escapeHtml(p.city)} / ${p.age}</td>
            <td>${p.pricing ? p.pricing.hourly + ' ₺' : '-'}</td>
            <td>
                ${p.isPremium ? '<span class="badge-pill badge-warning">Premium</span>' : ''}
                ${p.isVerified ? '<span class="badge-pill badge-success">Onaylı</span>' : ''}
            </td>
            <td>⭐ ${p.rating}</td>
            <td><a href="profile-detail.html?id=${p.id}" class="filter-btn secondary" style="padding:5px 12px; font-size:0.75rem; text-decoration:none;">Görüntüle</a></td>
        </tr>
    `).join('');
}

window.openAddProfileModal = function() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width:480px; padding:25px;">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h3 style="margin-bottom:15px;">Yeni Vitrin Profili Ekle</h3>
            <form id="add-profile-form" style="display:grid; gap:12px;">
                <input type="text" id="np-name" placeholder="Profil Adı (Örn: Lara S.)" required style="padding:11px; border-radius:8px; border:1px solid var(--glass-border); background:var(--bg-secondary); color:var(--text-color);">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <input type="text" id="np-city" placeholder="Şehir (Örn: İstanbul)" required style="padding:11px; border-radius:8px; border:1px solid var(--glass-border); background:var(--bg-secondary); color:var(--text-color);">
                    <input type="number" id="np-age" placeholder="Yaş" value="24" required style="padding:11px; border-radius:8px; border:1px solid var(--glass-border); background:var(--bg-secondary); color:var(--text-color);">
                </div>
                <input type="number" id="np-price" placeholder="Saatlik Ücret (₺)" value="3000" required style="padding:11px; border-radius:8px; border:1px solid var(--glass-border); background:var(--bg-secondary); color:var(--text-color);">
                <input type="url" id="np-photo" placeholder="Fotoğraf URL" value="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop" required style="padding:11px; border-radius:8px; border:1px solid var(--glass-border); background:var(--bg-secondary); color:var(--text-color);">
                <textarea id="np-desc" placeholder="Profil açıklaması..." required style="padding:11px; border-radius:8px; border:1px solid var(--glass-border); background:var(--bg-secondary); color:var(--text-color); height:80px;"></textarea>
                <button type="submit" class="auth-submit">Profili Yayınla</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#add-profile-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const custom = JSON.parse(localStorage.getItem('lovelycam_custom_profiles') || '[]');
        const photo = document.getElementById('np-photo').value;
        const hourly = parseInt(document.getElementById('np-price').value) || 2500;
        const newProf = {
            id: 'custom-' + Date.now(),
            name: document.getElementById('np-name').value,
            gender: 'female',
            city: document.getElementById('np-city').value,
            age: parseInt(document.getElementById('np-age').value) || 24,
            height: 170,
            weight: 55,
            tags: 'VIP',
            description: document.getElementById('np-desc').value,
            interests: ['Seyahat', 'Müzik', 'Sanat'],
            languages: ['Türkçe', 'İngilizce'],
            phone: '+90 532 *** ** **',
            whatsapp: '+905320000000',
            telegram: '@lovelycam_vip',
            availability: { 'Pazartesi': 90, 'Cuma': 100, 'Cumartesi': 100 },
            photos: [photo],
            thumbnail: photo,
            rating: 5.0,
            reviewCount: 1,
            views: 120,
            meetings: 5,
            isPremium: true,
            isVerified: true,
            isFeatured: true,
            isOnline: true,
            pricing: { hourly: hourly, nightly: hourly * 4 },
            attributes: { bust: '90C', waist: 60, hips: 90 },
            comments: []
        };
        custom.unshift(newProf);
        localStorage.setItem('lovelycam_custom_profiles', JSON.stringify(custom));
        modal.remove();
        renderAdminProfiles();
        renderAdminStats();
    });
};

function renderAdminReports() {
    const reports = Security.moderation.getReports();
    const tbody = document.getElementById('admin-reports-tbody');
    if (!tbody) return;

    if (reports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">Bekleyen şikâyet bildirimi bulunmuyor.</td></tr>';
        return;
    }

    tbody.innerHTML = reports.map(r => `
        <tr>
            <td><strong>${escapeHtml(r.targetName)}</strong></td>
            <td>${escapeHtml(r.reporterName)}</td>
            <td><span class="badge-pill badge-danger">${escapeHtml(r.reason)}</span></td>
            <td>${escapeHtml(r.details)}</td>
            <td><span class="badge-pill ${r.status === 'resolved' ? 'badge-success' : 'badge-warning'}">${r.status === 'resolved' ? 'Çözüldü' : 'İnceleniyor'}</span></td>
            <td>
                <button class="filter-btn secondary" style="padding:4px 10px; font-size:0.75rem;" onclick="resolveReport('${r.id}')">Onayla / Kapat</button>
            </td>
        </tr>
    `).join('');
}

window.resolveReport = function(id) {
    Security.moderation.updateReportStatus(id, 'resolved');
    renderAdminReports();
    renderAdminStats();
};

function renderAdminKYC() {
    const kycList = JSON.parse(localStorage.getItem('lovelycam_kyc_requests') || '[]');
    const tbody = document.getElementById('admin-kyc-tbody');
    if (!tbody) return;

    if (kycList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">Bekleyen KYC kimlik doğrulama başvurusu yok.</td></tr>';
        return;
    }

    tbody.innerHTML = kycList.map(k => `
        <tr>
            <td><strong>${escapeHtml(k.username)}</strong></td>
            <td>Kimlik Ön Yüz + Selfie Doğrulaması</td>
            <td>${new Date(k.submittedAt).toLocaleString('tr-TR')}</td>
            <td><span class="badge-pill ${k.status === 'approved' ? 'badge-success' : 'badge-warning'}">${k.status}</span></td>
            <td>
                <button class="filter-btn primary" style="padding:5px 12px; font-size:0.75rem;" onclick="approveKYC('${k.id}')">Onayla</button>
            </td>
        </tr>
    `).join('');
}

window.approveKYC = function(kycId) {
    const kycList = JSON.parse(localStorage.getItem('lovelycam_kyc_requests') || '[]');
    const idx = kycList.findIndex(k => k.id === kycId);
    if (idx !== -1) {
        kycList[idx].status = 'approved';
        localStorage.setItem('lovelycam_kyc_requests', JSON.stringify(kycList));
        renderAdminKYC();
    }
};

function renderAdminLogs() {
    const logs = Security.logger.getLogs();
    const tbody = document.getElementById('admin-logs-tbody');
    if (!tbody) return;

    if (logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">Kayıtlı sistem veya hata logu yok.</td></tr>';
        return;
    }

    tbody.innerHTML = logs.map(l => `
        <tr>
            <td><span class="badge-pill ${l.level === 'ERROR' ? 'badge-danger' : (l.level === 'WARN' ? 'badge-warning' : 'badge-success')}">${escapeHtml(l.level)}</span></td>
            <td>${escapeHtml(l.message)}</td>
            <td><code>${escapeHtml(l.page)}</code></td>
            <td>${new Date(l.timestamp).toLocaleString('tr-TR')}</td>
        </tr>
    `).join('');
}

window.clearSystemLogs = function() {
    Security.logger.clearLogs();
    renderAdminLogs();
};
