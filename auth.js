// LovelyCam - Authentication System (Mock with localStorage)

const AUTH_STORAGE_KEY = 'lovelycam_users';
const SESSION_KEY = 'lovelycam_session';

// Initialize auth system
async function initAuth() {
    // Create default users if not exist or if legacy (plain text) password detected
    // Check first user to see if password looks like a SHA-256 hash (64 hex chars)
    const storedUsers = localStorage.getItem(AUTH_STORAGE_KEY);
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    const needsInit = users.length === 0 || (users[0] && users[0].password.length < 50);

    if (needsInit) {
        const hashedPassword = await CryptoUtils.hashPassword('admin123');
        const defaultUsers = [
            { 
                id: 'admin', 
                email: 'admin@lovelycam.com', 
                password: hashedPassword, 
                username: 'Admin', 
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop', 
                createdAt: new Date().toISOString() 
            }
        ];
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUsers));
        console.log('Auth system initialized with secure admin user.');
    }
    
    // Check and update UI based on session
    updateAuthUI();
}

// Get all registered users
function getUsers() {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Save users to storage
function saveUsers(users) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
}

// Get current session
function getSession() {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
}

// Check if user is logged in
function isLoggedIn() {
    return getSession() !== null;
}

// Get current user
function getCurrentUser() {
    const session = getSession();
    if (!session) return null;
    
    const users = getUsers();
    return users.find(u => u.id === session.userId);
}

// Register new user
async function register(email, password, username) {
    const users = getUsers();
    
    // Validation
    if (!email || !password || !username) {
        return { success: false, message: 'Tüm alanları doldurun!' };
    }
    
    if (password.length < 6) {
        return { success: false, message: 'Şifre en az 6 karakter olmalı!' };
    }
    
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'Bu e-posta adresi zaten kayıtlı!' };
    }
    
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: 'Bu kullanıcı adı zaten alınmış!' };
    }
    
    // Hash password
    const hashedPassword = await CryptoUtils.hashPassword(password);
    
    // Create new user
    const newUser = {
        id: 'user_' + Date.now(),
        email: email.toLowerCase(),
        password: hashedPassword,
        username: username,
        avatar: 'user.png',
        createdAt: new Date().toISOString(),
        role: 'customer',
        bio: 'Merhaba, LovelyCam\'e yeni katıldım!',
        favorites: [],
        lastProfileUpdate: Date.now(), // For cooldown logic
        messages: []
    };
    
    users.push(newUser);
    saveUsers(users);
    
    // Auto login after register
    await login(email, password);
    
    return { success: true, message: 'Kayıt başarılı! Hoş geldiniz.' };
}

// Login user
async function login(email, password) {
    // Rate limiting check
    if (typeof Security !== 'undefined' && Security.rateLimiter) {
        const rateCheck = Security.rateLimiter.check(email || 'anonymous');
        if (rateCheck.blocked) {
            return { 
                success: false, 
                message: `Çok fazla başarısız giriş denemesi. ${rateCheck.remainingMinutes} dakika sonra tekrar deneyin.` 
            };
        }
    }
    
    const users = getUsers();
    
    if (!email || !password) {
        return { success: false, message: 'E-posta ve şifre gerekli!' };
    }
    
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
        return { success: false, message: 'E-posta veya şifre hatalı!' };
    }
    
    // Verify password
    let isMatch = false;
    if (user.password.length < 50) {
        // Legacy plain text fallback (optional, or force reset)
        isMatch = (user.password === password);
        if (isMatch) {
            // Auto-migrate to hash
            user.password = await CryptoUtils.hashPassword(password);
            saveUsers(users);
        }
    } else {
        isMatch = await CryptoUtils.verifyPassword(password, user.password);
    }
    
    if (!isMatch) {
        return { success: false, message: 'E-posta veya şifre hatalı!' };
    }
    
    // Create session
    const session = {
        userId: user.id,
        loginTime: new Date().toISOString(),
        username: user.username // Add username for convenience
    };
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    updateAuthUI();
    
    // Reset rate limiter on successful login
    if (typeof Security !== 'undefined' && Security.rateLimiter) {
        Security.rateLimiter.reset(email);
    }
    
    return { success: true, message: `Hoş geldiniz, ${user.username}!`, user: user };
}

// Logout user
function logout() {
    localStorage.removeItem(SESSION_KEY);
    updateAuthUI();
    showNotification('Başarıyla çıkış yaptınız.', 'info');
    // If on dashboard, redirect home
    if (window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'index.html';
    }
}

// Update UI based on auth state
function updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userDropdown = document.getElementById('user-dropdown');
    const headerMsgBtn = document.getElementById('header-messages-btn');
    const msgBadge = document.getElementById('msg-badge');
    
    const user = getCurrentUser();
    
    if (user) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        
        // Show header messages button
        if (headerMsgBtn) {
            headerMsgBtn.style.display = 'flex';
            // Update unread count
            const unreadCount = getUnreadCount();
            if (msgBadge) {
                if (unreadCount > 0) {
                    msgBadge.style.display = 'flex';
                    msgBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
                } else {
                    msgBadge.style.display = 'none';
                }
            }
        }
        
        if (userMenu) {
            userMenu.style.display = 'block';
            if (userAvatar) userAvatar.src = user.avatar;
            if (userName) userName.textContent = user.username;
            
            // Update dropdown links
            if (userDropdown) {
                userDropdown.innerHTML = `
                    <div style="padding: 15px; border-bottom: 1px solid var(--glass-border);">
                        <strong>${user.username}</strong>
                        <p style="font-size: 0.8rem; color: var(--text-muted);">${user.role === 'customer' ? 'Müşteri' : 'Yayıncı'}</p>
                    </div>
                    <a href="dashboard.html"><i class="fas fa-columns"></i> Kullanıcı Paneli</a>
                    <a href="profile-detail.html?id=${user.id}"><i class="fas fa-user-circle"></i> Profilim</a>
                    <a href="dashboard.html?tab=favorites"><i class="fas fa-heart"></i> Favorilerim</a>
                    <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Çıkış Yap</a>
                `;
                
                // Re-bind logout listener
                const logoutBtn = document.getElementById('logout-btn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        logout();
                    });
                }
            }
        }
    } else {
        // User is logged out
        if (loginBtn) loginBtn.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
        if (headerMsgBtn) headerMsgBtn.style.display = 'none';
    }
}

// Setup auth event listeners
function setupAuthListeners() {
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.getElementById('close-modal');
    const loginBtn = document.getElementById('login-btn');
    const tabs = document.querySelectorAll('.auth-tabs .tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const userMenuToggle = document.getElementById('user-avatar');
    const userDropdown = document.getElementById('user-dropdown');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Open login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'flex';
            // Also re-init auth to check consistency if needed
            initAuth();
        });
    }
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'none';
        });
    }
    
    // Close modal on outside click
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) loginModal.style.display = 'none';
        });
    }
    
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabId = tab.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.toggle('active', content.id === `${tabId}-tab`);
            });
        });
    });
    
    // Login form submit
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const result = await login(email, password);
            
            if (result.success) {
                if (loginModal) loginModal.style.display = 'none';
                showNotification(result.message, 'success');
                loginForm.reset();
            } else {
                showNotification(result.message, 'error');
            }
        });
    }
    
    // Register form submit
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                showNotification('Şifreler eşleşmiyor!', 'error');
                return;
            }
            
            const result = await register(email, password, username);
            
            if (result.success) {
                if (loginModal) loginModal.style.display = 'none';
                showNotification(result.message, 'success');
                registerForm.reset();
            } else {
                showNotification(result.message, 'error');
            }
        });
    }
    
    // User menu toggle
    if (userMenuToggle) {
        userMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (userDropdown) userDropdown.classList.toggle('show');
        });
    }
    
    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (userDropdown && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });
}

// Private Messages System
const MESSAGES_KEY = 'lovelycam_messages';

function getMessages() {
    const data = localStorage.getItem(MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
}

function saveMessages(messages) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

function sendPrivateMessage(recipientId, text) {
    const user = getCurrentUser();
    if (!user) {
        return { success: false, message: 'Mesaj göndermek için giriş yapın!' };
    }
    
    if (!text.trim()) {
        return { success: false, message: 'Mesaj boş olamaz!' };
    }
    
    const messages = getMessages();
    const newMessage = {
        id: 'msg_' + Date.now(),
        senderId: user.id,
        senderName: user.username,
        senderAvatar: user.avatar,
        recipientId: recipientId,
        text: text.trim(), // Consider using escapeHtml here too if displayed improperly elsewhere
        timestamp: new Date().toISOString(),
        read: false
    };
    
    messages.push(newMessage);
    saveMessages(messages);
    
    // Simulate reply after delay
    setTimeout(() => {
        simulateReply(recipientId, user.id);
    }, 3000 + Math.random() * 5000);
    
    return { success: true, message: 'Mesaj gönderildi!', messageData: newMessage };
}

function simulateReply(fromId, toId) {
    const recipient = getUserById(fromId);
    if (!recipient) return;
    
    const replies = [
        `Merhaba! Mesajın için teşekkürler 😊`,
        `Selam, profilimi beğendiğin için çok mutluyum 💕`,
        `Hey! Şu an müsait değilim ama en kısa sürede döneceğim 😉`,
        `Teşekkürler! Senin profil de çok güzel görünüyor ✨`,
        `Merhaba! Tanıştığımıza memnun oldum 💋`
    ];
    
    const messages = getMessages();
    const replyMessage = {
        id: 'msg_' + Date.now(),
        senderId: fromId,
        senderName: recipient.name,
        senderAvatar: recipient.thumbnail,
        recipientId: toId,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toISOString(),
        read: false
    };
    
    messages.push(replyMessage);
    saveMessages(messages);
    
    // Show notification if on same page
    showNotification(`${recipient.name} size mesaj gönderdi!`, 'success');
}

function getConversation(userId1, userId2) {
    const messages = getMessages();
    return messages.filter(m => 
        (m.senderId === userId1 && m.recipientId === userId2) ||
        (m.senderId === userId2 && m.recipientId === userId1)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

function getUnreadCount() {
    const user = getCurrentUser();
    if (!user) return 0;
    
    const messages = getMessages();
    return messages.filter(m => m.recipientId === user.id && !m.read).length;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    setupAuthListeners();
});


// V4.0 Upgrade: Email Verification OTP Flow & Admin Menu Integration
window.openEmailVerificationModal = function(email, onVerified) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    sessionStorage.setItem('lovelycam_otp_code', code);

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width:420px; padding:28px; text-align:center;">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <div style="font-size:3rem; color:var(--primary-color); margin-bottom:10px;"><i class="fas fa-envelope-circle-check"></i></div>
            <h3>E-posta Doğrulama</h3>
            <p style="font-size:0.86rem; color:var(--text-muted); margin:10px 0;">
                <strong>${escapeHtml(email)}</strong> adresine 6 haneli doğrulama kodu gönderildi.<br>
                <span style="color:#22c55e;">(Demo Doğrulama Kodunuz: <strong>${code}</strong>)</span>
            </p>
            <input type="text" id="otp-verify-input" maxlength="6" value="${code}" style="width:180px; text-align:center; font-size:1.5rem; letter-spacing:6px; padding:10px; border-radius:10px; border:2px solid var(--primary-color); background:var(--bg-secondary); color:var(--text-color); margin:15px auto; display:block;">
            <button type="button" id="otp-verify-btn" class="auth-submit"><i class="fas fa-check-circle"></i> Doğrula ve Devam Et</button>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#otp-verify-btn').addEventListener('click', () => {
        const val = document.getElementById('otp-verify-input').value.trim();
        if (val === code) {
            const users = getUsers();
            const u = users.find(x => x.email.toLowerCase() === email.toLowerCase());
            if (u) {
                u.isEmailVerified = true;
                saveUsers(users);
            }
            modal.remove();
            if (typeof showNotification === 'function') showNotification('E-posta adresiniz başarıyla doğrulandı! ✅', 'success');
            if (typeof onVerified === 'function') onVerified();
        } else {
            if (typeof showNotification === 'function') showNotification('Doğrulama kodu hatalı!', 'error');
        }
    });
};

// Inject Admin Panel Link into User Dropdown when logged in
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const userDropdown = document.getElementById('user-dropdown');
        const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        if (userDropdown && user && !userDropdown.querySelector('a[href="admin.html"]')) {
            const adminLink = document.createElement('a');
            adminLink.href = 'admin.html';
            adminLink.innerHTML = '<i class="fas fa-shield-halved"></i> Yönetim Paneli (Admin)';
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                userDropdown.insertBefore(adminLink, logoutBtn);
            } else {
                userDropdown.appendChild(adminLink);
            }
        }
    }, 250);
});
