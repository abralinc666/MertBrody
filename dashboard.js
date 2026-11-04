// LovelyCam - Dashboard Logic
// Depends on auth.js and data.js

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    // Wait slightly for auth.js to init
    setTimeout(() => {
        initializeDashboard();
    }, 100);
});

function initializeDashboard() {
    // Use auth.js function
    if (typeof getCurrentUser !== 'function') {
        console.error('Auth system not loaded!');
        return;
    }

    currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update UI headers
    document.getElementById('header-username').textContent = currentUser.username;
    
    // If element exists (in sidebar)
    if (document.getElementById('dash-username')) {
        document.getElementById('dash-username').textContent = currentUser.username;
        document.getElementById('dash-avatar').src = currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.username}&background=ff1a5c&color=fff`;
        document.getElementById('header-avatar').src = currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.username}&background=ff1a5c&color=fff`;
    }

    setupDashboardEvents();
    
    // Handle URL Params for tabs (e.g. dashboard.html?tab=favorites)
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab) {
        switchTab(tab);
    }

    loadProfileData();
    loadFavorites();
    loadMessages();
}

function setupDashboardEvents() {
    // Tab switching
    window.switchTab = function(tabName) {
        // Update Nav
        document.querySelectorAll('.dash-nav button').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.dash-nav button[onclick="switchTab('${tabName}')"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
        // Update Content
        document.querySelectorAll('.section-tab').forEach(tab => tab.classList.remove('active'));
        const activeTab = document.getElementById(`${tabName}-tab`);
        if (activeTab) activeTab.classList.add('active');
        
        // Update URL without reload
        const url = new URL(window.location);
        url.searchParams.set('tab', tabName);
        window.history.pushState({}, '', url);
    };
    
    // Bio character counter
    const bioInput = document.getElementById('edit-bio');
    const bioCount = document.getElementById('bio-count');
    
    if (bioInput) {
        bioInput.addEventListener('input', () => {
            const len = bioInput.value.length;
            bioCount.textContent = len;
            if (len >= 50) bioCount.style.color = 'red';
            else bioCount.style.color = 'var(--text-muted)';
        });
    }

    // Profile Save
    const profileForm = document.getElementById('profile-edit-form');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProfile();
        });
    }

    // Avatar File Input Handling
    const avatarFile = document.getElementById('edit-avatar-file');
    const avatarPreview = document.getElementById('edit-avatar-preview');
    const avatarHidden = document.getElementById('edit-avatar');

    if (avatarFile) {
        avatarFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            // Size check (512KB)
            if (file.size > 512 * 1024) {
               showNotification('Dosya boyutu çok büyük! Maksimum 512KB olmalı.', 'error');
               this.value = ''; // Reset input
               return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                // Resize logic could go here if we had a canvas helper,
                // but for now we just accept the base64 string.
                // It's good to at least display it.
                avatarPreview.src = e.target.result;
                avatarHidden.value = e.target.result; // Store base64 in hidden input
            };
            reader.readAsDataURL(file);
        });
    }
    
    // Message Modal Close
    const msgModalClose = document.getElementById('dash-msg-close');
    const msgModal = document.getElementById('dash-msg-modal');
    if (msgModalClose && msgModal) {
        msgModalClose.onclick = () => {
             msgModal.style.display = 'none';
             loadMessages(); // Refresh list on close
        };
        window.onclick = (e) => {
            if (e.target == msgModal) {
                msgModal.style.display = 'none';
                loadMessages();
            }
        };
    }
    
    // Message Form Submit
    const msgForm = document.getElementById('dash-msg-form');
    if (msgForm) {
        msgForm.addEventListener('submit', handleDashboardSendMessage);
    }
    
    // Global Theme func
    window.setTheme = function(mode) {
        if (mode === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    };
}

function loadProfileData() {
    if (!currentUser) return;
    
    const usernameInput = document.getElementById('edit-username');
    if (usernameInput) usernameInput.value = currentUser.username;
    
    const emailInput = document.getElementById('edit-email');
    if (emailInput) emailInput.value = currentUser.email;
    
    const avatarInput = document.getElementById('edit-avatar');
    const avatarPreview = document.getElementById('edit-avatar-preview');
    if (avatarInput) avatarInput.value = currentUser.avatar || '';
    if (avatarPreview) avatarPreview.src = currentUser.avatar || 'user.png';
    
    const bioInput = document.getElementById('edit-bio');
    if (bioInput) {
        bioInput.value = currentUser.bio || '';
        document.getElementById('bio-count').textContent = (currentUser.bio || '').length;
    }
    
    checkCooldown();
}

function checkCooldown() {
    const lastUpdate = currentUser.lastProfileUpdate || 0;
    const createdAt = currentUser.createdAt ? new Date(currentUser.createdAt).getTime() : 0;
    const now = Date.now();
    const cooldownTime = 14 * 24 * 60 * 60 * 1000; // 14 Days
    const gracePeriod = 24 * 60 * 60 * 1000; // 24 Hours (Grace Period)
    
    // Allow edit if account is new OR cooldown passed
    // If account is new, we ignore lastUpdate check
    if ((now - createdAt) < gracePeriod) {
        return; // Allow editing
    }

    if (now - lastUpdate < cooldownTime) {
        
        const timer = document.getElementById('cooldown-timer');
        if (timer) {
            timer.style.display = 'block';
            document.getElementById('timer-val').textContent = `${remainingDays} Gün`;
        }
        
        const alertUpdate = document.getElementById('update-alert');
        if (alertUpdate) alertUpdate.style.display = 'flex';
        
        // Disable inputs
        document.getElementById('edit-avatar').disabled = true;
        document.getElementById('edit-bio').disabled = true;
        
        const saveBtn = document.getElementById('save-profile-btn');
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-lock"></i> Kilitli';
            saveBtn.style.opacity = '0.6';
            saveBtn.style.cursor = 'not-allowed';
        }
    }
}

function saveProfile() {
    // Double check logic (client-side)
    // Double check logic (client-side)
    const lastUpdate = currentUser.lastProfileUpdate || 0;
    const createdAt = currentUser.createdAt ? new Date(currentUser.createdAt).getTime() : 0;
    const now = Date.now();
    const cooldownTime = 14 * 24 * 60 * 60 * 1000;
    const gracePeriod = 24 * 60 * 60 * 1000;
    
    const isNewAccount = (now - createdAt) < gracePeriod;
    
    if (!isNewAccount && (now - lastUpdate < cooldownTime)) {
        showNotification('Profilinizi güncellemek için bekleme süreniz bitmedi!', 'error');
        return;
    }
    
    const newAvatar = document.getElementById('edit-avatar').value.trim();
    const newBio = document.getElementById('edit-bio').value.trim();
    
    if (newBio.length > 50) {
        showNotification('Biyografi 50 karakterden uzun olamaz!', 'warning');
        return;
    }
    
    // Update User Object
    currentUser.avatar = newAvatar;
    currentUser.bio = newBio;
    currentUser.lastProfileUpdate = Date.now();
    
    // Save to LocalStorage using auth.js helper if possible, or manual
    // auth.js doesn't export 'saveUsers' or update function easily.
    // We must manually update.
    
    const users = JSON.parse(localStorage.getItem('lovelycam_users') || '[]');
    const index = users.findIndex(u => u.id === currentUser.id);
    
    if (index !== -1) {
        users[index] = currentUser;
        localStorage.setItem('lovelycam_users', JSON.stringify(users));
        showNotification('Profil başarıyla güncellendi! 14 gün boyunca değişiklik yapamazsınız.', 'success');
        
        // Refresh UI
        setTimeout(() => location.reload(), 1500);
    }
}

function loadFavorites() {
    const container = document.getElementById('favorites-container');
    if (!container) return;
    
    const favorites = currentUser.favorites || [];
    
    if (favorites.length === 0) {
        container.innerHTML = '<p class="empty-msg" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">Henüz favori profiliniz yok.</p>';
        return;
    }
    
    container.innerHTML = '';
    
    favorites.forEach(favId => {
        // Find in MOCK_USERS (from data.js)
        const profile = MOCK_USERS.find(u => u.id === favId);
        if (profile) {
            const card = document.createElement('div');
            card.className = 'fav-card';
            const safeName = escapeHtml(profile.name);
            const safeCity = escapeHtml(profile.city);
            card.innerHTML = `
                <button class="remove-fav" onclick="removeFavorite('${profile.id}')"><i class="fas fa-times"></i></button>
                <img src="${profile.thumbnail}" class="fav-img" alt="${safeName}">
                <div class="fav-info">
                    <h4>${safeName}</h4>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">${safeCity}, ${profile.age}</p>
                    <a href="profile-detail.html?id=${profile.id}" style="display: block; margin-top: 10px; font-size: 0.9rem; color: var(--primary-color);">Profili Gör</a>
                </div>
            `;
            container.appendChild(card);
        }
    });
}

window.removeFavorite = function(profileId) {
    if (!confirm('Favorilerden kaldırmak istiyor musunuz?')) return;
    
    let favs = currentUser.favorites || [];
    favs = favs.filter(id => id !== profileId);
    currentUser.favorites = favs;
    
    // Save
    const users = JSON.parse(localStorage.getItem('lovelycam_users') || '[]');
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
        users[index] = currentUser;
        localStorage.setItem('lovelycam_users', JSON.stringify(users));
        loadFavorites(); // Reload
        showNotification('Favorilerden kaldırıldı.', 'info');
    }
};

async function loadMessages() {
    const container = document.getElementById('messages-container');
    const emptyState = document.getElementById('messages-empty');
    if (!container) return;

    // Şifreli mesaj sistemini kullan
    if (typeof secureMessaging !== 'undefined' && currentUser) {
        try {
            await loadSecureMessages();
        } catch (error) {
            console.error('Şifreli mesajlar yüklenirken hata:', error);
            // Fallback to old system
            loadLegacyMessages();
        }
        return;
    }

    // Fallback: Eski sistem
    loadLegacyMessages();
}

function loadLegacyMessages() {
    const container = document.getElementById('messages-container');
    const emptyState = document.getElementById('messages-empty');
    
    if (typeof getMessages !== 'function') {
        console.warn('Mesaj sistemi yüklenemedi');
        return;
    }
    
    const allMessages = getMessages();
    
    // Group messages by conversation partner (Instagram style)
    const conversations = {};
    let hasMessages = false;
    
    allMessages.forEach(msg => {
        if (msg.senderId === currentUser.id || msg.recipientId === currentUser.id) {
            const otherUserId = msg.senderId === currentUser.id ? msg.recipientId : msg.senderId;
            
            if (!conversations[otherUserId]) {
                conversations[otherUserId] = {
                    partnerId: otherUserId,
                    partnerName: null,
                    partnerAvatar: null,
                    messages: [],
                    unreadCount: 0
                };
            }
            
            conversations[otherUserId].messages.push(msg);
            
            // Partner bilgilerini al
            if (msg.senderId === otherUserId) {
                conversations[otherUserId].partnerName = msg.senderName;
                conversations[otherUserId].partnerAvatar = msg.senderAvatar;
            }
            
            if (msg.recipientId === currentUser.id && !msg.read) {
                conversations[otherUserId].unreadCount++;
            }
            
            hasMessages = true;
        }
    });
    
    if (!hasMessages) {
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    container.innerHTML = '';
    
    // Sırala ve render et
    const sortedConversations = Object.values(conversations)
        .map(conv => {
            conv.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            conv.lastMessage = conv.messages[conv.messages.length - 1];
            conv.totalMessages = conv.messages.length;
            return conv;
        })
        .sort((a, b) => new Date(b.lastMessage?.timestamp) - new Date(a.lastMessage?.timestamp));
    
    sortedConversations.forEach(conv => {
        container.appendChild(createMessageItem(conv));
    });
}

// Şifreli mesajları yükle
async function loadSecureMessages() {
    const container = document.getElementById('messages-container');
    const emptyState = document.getElementById('messages-empty');
    
    try {
        const conversations = await secureMessaging.getUserConversations(currentUser.id);
        
        if (conversations.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        container.innerHTML = '';
        
        conversations.forEach(conv => {
            // MOCK_USERS'dan profil bilgisi al
            const profile = MOCK_USERS.find(u => u.id === conv.partnerId);
            if (profile) {
                conv.partnerName = conv.partnerName || profile.name;
                conv.partnerAvatar = conv.partnerAvatar || profile.thumbnail;
                conv.isVerified = profile.isVerified;
            }
            
            container.appendChild(createMessageItem(conv));
        });
    } catch (error) {
        console.error('Mesajlar yüklenirken hata:', error);
        if (emptyState) emptyState.style.display = 'block';
    }
}

// Instagram tarzı mesaj öğesi oluştur
function createMessageItem(conv) {
    const item = document.createElement('div');
    item.className = 'msg-item' + (conv.unreadCount > 0 ? ' unread' : '');
    
    const profile = MOCK_USERS.find(u => u.id === conv.partnerId);
    const isOnline = Math.random() > 0.5; // Simüle edilmiş çevrimiçi durumu
    
    const lastMsg = conv.lastMessage;
    const timeStr = lastMsg ? formatMessageTime(lastMsg.timestamp) : '';
    const previewText = lastMsg ? (lastMsg.senderId === currentUser.id ? 'Sen: ' : '') + (lastMsg.text || '[Şifreli Mesaj]') : '';
    
    item.innerHTML = `
        <div class="msg-avatar-wrapper">
            <img src="${conv.partnerAvatar || 'https://ui-avatars.com/api/?name=User&background=ff1a5c&color=fff'}" 
                 class="msg-avatar" alt="${conv.partnerName || 'Kullanıcı'}">
            ${isOnline ? '<div class="msg-avatar-badge"></div>' : ''}
        </div>
        <div class="msg-content">
            <div class="msg-header">
                <span class="msg-name">
                    ${conv.partnerName || 'Kullanıcı'}
                    ${conv.isVerified ? '<i class="fas fa-check-circle verified-badge"></i>' : ''}
                </span>
                <span class="msg-time">${timeStr}</span>
            </div>
            <div class="msg-preview-row">
                <span class="msg-preview">${escapeHtml(previewText).substring(0, 50)}${previewText.length > 50 ? '...' : ''}</span>
                ${conv.unreadCount > 0 ? `<span class="msg-count-badge">${conv.unreadCount}</span>` : ''}
            </div>
            <div class="msg-stats">
                <span class="msg-stat"><i class="fas fa-comment"></i> ${conv.totalMessages} mesaj</span>
                <span class="msg-stat"><i class="fas fa-lock"></i> Şifreli</span>
            </div>
        </div>
    `;
    
    // Tıklandığında profil sayfasına git
    item.onclick = () => {
    // Tıklandığında direkt mesaj modalını aç (SAYFA DEĞİŞMEDEN)
    item.onclick = () => {
        openDashboardMessageModal(conv);
    };
    };
    
    return item;
}

// Mesaj zamanını formatla
function formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Şimdi';
    if (minutes < 60) return `${minutes}dk`;
    if (hours < 24) return `${hours}sa`;
    if (days < 7) return `${days}g`;
    
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

// HTML escape fonksiyonu
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Mesaj arama fonksiyonunu ayarla
function setupMessageSearch() {
    const searchInput = document.getElementById('message-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.msg-item');
            
            items.forEach(item => {
                const name = item.querySelector('.msg-name')?.textContent.toLowerCase() || '';
                const preview = item.querySelector('.msg-preview')?.textContent.toLowerCase() || '';
                
                if (name.includes(query) || preview.includes(query)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// Sayfa yüklendiğinde mesaj aramasını ayarla
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(setupMessageSearch, 200);
});

// --- Dashboard Message Modal Logic ---
let currentChatPartner = null;

async function openDashboardMessageModal(conv) {
    const modal = document.getElementById('dash-msg-modal');
    if (!modal) return;
    
    currentChatPartner = {
        id: conv.partnerId,
        name: conv.partnerName,
        avatar: conv.partnerAvatar
    };
    
    // UI Update
    document.getElementById('dash-msg-name').textContent = conv.partnerName || 'Kullanıcı';
    document.getElementById('dash-msg-avatar').src = conv.partnerAvatar || 'user.png';
    document.getElementById('dash-msg-history').innerHTML = ''; // Clear previous
    
    modal.style.display = 'flex';
    
    // Load History
    await loadDashboardChatHistory(conv.partnerId);
}

async function loadDashboardChatHistory(partnerId) {
    const historyContainer = document.getElementById('dash-msg-history');
    historyContainer.innerHTML = '';
    
    // Use secureMessaging if available, else legacy
    let messages = [];
    if (typeof secureMessaging !== 'undefined') {
        const conversations = await secureMessaging.getUserConversations(currentUser.id);
        const myConv = conversations.find(c => c.partnerId === partnerId);
        if (myConv) messages = myConv.messages;
    } else {
        const allMsgs = getMessages();
        messages = allMsgs.filter(m => 
            (m.senderId === currentUser.id && m.recipientId === partnerId) ||
            (m.senderId === partnerId && m.recipientId === currentUser.id)
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
    
    if (messages.length === 0) {
        historyContainer.innerHTML = '<p style="text-align:center; padding: 20px; color: var(--text-muted);">Henüz mesaj yok.</p>';
        return;
    }
    
    messages.forEach(msg => {
        const isSent = msg.senderId === currentUser.id;
        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${isSent ? 'sent' : 'received'}`; // Ensure CSS exists for this or reuse chat.css styles? Uses profile-detail.css styles usually.
        // We need to make sure dashboard.html has styles for .message-bubble. It does not by default unless we add them. 
        // I'll add inline styles for safety or rely on dashboard.css if I edited it (I haven't).
        // Actually lovelycam often uses style.css globally. Let's check if .message-bubble is global.
        // Assuming it might not be perfect, I'll add some basic styles in inline or JS utility.
        
        bubble.style.cssText = `
            max-width: 70%;
            padding: 10px 15px;
            border-radius: 15px;
            margin-bottom: 10px;
            font-size: 0.9rem;
            position: relative;
            background: ${isSent ? 'var(--gradient-hot)' : 'var(--bg-secondary)'};
            color: ${isSent ? 'white' : 'var(--text-color)'};
            align-self: ${isSent ? 'flex-end' : 'flex-start'};
            margin-left: ${isSent ? 'auto' : '0'};
        `;
        
        const time = new Date(msg.timestamp);
        const timeStr = time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0');
        
        bubble.innerHTML = `
            ${msg.isEncrypted ? '<i class="fas fa-lock" style="font-size:0.7em; margin-right:5px;"></i>' : ''}
            ${escapeHtml(msg.text)}
            <div style="font-size: 0.7em; opacity: 0.7; text-align: right; margin-top: 4px;">${timeStr}</div>
        `;
        
        historyContainer.appendChild(bubble);
    });
    
    historyContainer.scrollTop = historyContainer.scrollHeight;
}

async function handleDashboardSendMessage(e) {
    e.preventDefault();
    if (!currentChatPartner) return;
    
    const input = document.getElementById('dash-msg-input');
    const text = input.value.trim();
    if (!text) return;
    
    if (typeof secureMessaging !== 'undefined') {
        const res = await secureMessaging.sendEncryptedMessage(
            currentUser.id, currentUser.username, currentUser.avatar,
            currentChatPartner.id, text
        );
        if (res.success) {
            input.value = '';
            // Manually append to UI for instant feedback
            loadDashboardChatHistory(currentChatPartner.id);
            
            // Simulate reply
            setTimeout(async () => {
                // We need a way to trigger reply simulation from secureMessaging or manually here
                // Since secureMessaging is just storage logic, we reuse the simulation logic if accessible or write new.
                // For now, let's just reload history after a delay to catch any simulated reply if the system does it.
                // But secureMessaging doesn't simulate replies automatically in the module I wrote.
                // I'll add a quick simulation trigger here.
                await simulateDashboardReply(currentChatPartner.id);
                if (document.getElementById('dash-msg-modal').style.display === 'flex') {
                    loadDashboardChatHistory(currentChatPartner.id);
                }
            }, 3000);
        }
    } else {
        // Legacy
        sendPrivateMessage(currentChatPartner.id, text);
        input.value = '';
        loadDashboardChatHistory(currentChatPartner.id);
    }
}

async function simulateDashboardReply(partnerId) {
    // Basic simulation for demo
    const replies = ['Merhaba!', 'Nasılsın?', 'Harika!', 'Teşekkürler.'];
    const text = replies[Math.floor(Math.random() * replies.length)];
    
    if (typeof secureMessaging !== 'undefined') {
        // Need to fetch partner details to simulate them sending
        // In a real app the partner sends it. Here we cheat.
        const partnerKey = await secureMessaging.getUserKey(partnerId); 
        // We can't easily "impersonate" sending from them without their key unless we cheat in simulation code.
        // My secureMessaging module allows sending with IDs.
        await secureMessaging.sendEncryptedMessage(
            partnerId, currentChatPartner.name, currentChatPartner.avatar,
            currentUser.id, text
        );
    }
}
