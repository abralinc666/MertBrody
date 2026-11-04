// LovelyCam - Notification System
// Handles real-time notifications for messages, profile views, and favorites

const NotificationSystem = {
    STORAGE_KEY: 'lovelycam_notifications',
    
    // Get all notifications
    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },
    
    // Save notifications
    save(notifications) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
    },
    
    // Add a new notification
    add(notification) {
        const notifications = this.getAll();
        const newNotif = {
            id: 'notif_' + Date.now(),
            timestamp: new Date().toISOString(),
            read: false,
            ...notification
        };
        notifications.unshift(newNotif);
        
        // Keep only last 50 notifications
        if (notifications.length > 50) {
            notifications.pop();
        }
        
        this.save(notifications);
        this.updateUI();
        return newNotif;
    },
    
    // Mark notification as read
    markAsRead(notifId) {
        const notifications = this.getAll();
        const notif = notifications.find(n => n.id === notifId);
        if (notif) {
            notif.read = true;
            this.save(notifications);
            this.updateUI();
        }
    },
    
    // Mark all as read
    markAllAsRead() {
        const notifications = this.getAll();
        notifications.forEach(n => n.read = true);
        this.save(notifications);
        this.updateUI();
    },
    
    // Get unread count
    getUnreadCount() {
        return this.getAll().filter(n => !n.read).length;
    },
    
    // Update UI
    updateUI() {
        const bellContainer = document.getElementById('notification-bell');
        const badge = document.getElementById('notif-badge');
        const list = document.getElementById('notif-list');
        
        const unreadCount = this.getUnreadCount();
        
        // Update badge
        if (badge) {
            if (unreadCount > 0) {
                badge.style.display = 'flex';
                badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            } else {
                badge.style.display = 'none';
            }
        }
        
        // Update list
        if (list) {
            const notifications = this.getAll().slice(0, 10); // Show last 10
            
            if (notifications.length === 0) {
                list.innerHTML = `
                    <div class="notif-empty">
                        <i class="fas fa-bell-slash"></i>
                        <p>Henüz bildirim yok</p>
                    </div>
                `;
                return;
            }
            
            list.innerHTML = notifications.map(notif => this.renderNotification(notif)).join('');
            
            // Add click handlers
            list.querySelectorAll('.notif-item').forEach(item => {
                item.addEventListener('click', () => {
                    const notifId = item.dataset.id;
                    this.markAsRead(notifId);
                    
                    // Navigate if has link
                    const link = item.dataset.link;
                    if (link) {
                        window.location.href = link;
                    }
                });
            });
        }
    },
    
    // Render single notification
    renderNotification(notif) {
        const timeAgo = this.formatTimeAgo(notif.timestamp);
        const iconClass = this.getIconClass(notif.type);
        const safeName = (typeof Security !== 'undefined' && Security.escapeHtml) ? Security.escapeHtml(notif.fromName || 'Kullanıcı') : (notif.fromName || 'Kullanıcı');
        const safeMessage = (typeof Security !== 'undefined' && Security.escapeHtml) ? Security.escapeHtml(notif.message || '') : (notif.message || '');
        
        return `
            <div class="notif-item ${notif.read ? '' : 'unread'}" data-id="${notif.id}" data-link="${notif.link || ''}">
                <img src="${notif.fromAvatar || 'https://ui-avatars.com/api/?name=User&background=ff1a5c&color=fff'}" 
                     alt="${safeName}" class="notif-avatar">
                <div class="notif-content">
                    <div class="notif-text">
                        <strong>${safeName}</strong> ${safeMessage}
                    </div>
                    <div class="notif-time">${timeAgo}</div>
                </div>
                <div class="notif-icon ${iconClass}">
                    <i class="fas ${this.getIcon(notif.type)}"></i>
                </div>
            </div>
        `;
    },
    
    // Get icon based on type
    getIcon(type) {
        switch (type) {
            case 'message': return 'fa-envelope';
            case 'favorite': return 'fa-heart';
            case 'view': return 'fa-eye';
            case 'comment': return 'fa-comment';
            default: return 'fa-bell';
        }
    },
    
    // Get icon class based on type
    getIconClass(type) {
        switch (type) {
            case 'message': return 'message';
            case 'favorite': return 'heart';
            case 'view': return 'eye';
            default: return 'heart';
        }
    },
    
    // Format time ago
    formatTimeAgo(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Şimdi';
        if (minutes < 60) return `${minutes} dk önce`;
        if (hours < 24) return `${hours} saat önce`;
        if (days < 7) return `${days} gün önce`;
        
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    },
    
    // Setup event listeners
    setup() {
        const bellBtn = document.getElementById('header-bell-btn');
        const dropdown = document.getElementById('notification-dropdown');
        const markAllBtn = document.getElementById('mark-all-read');
        
        // Toggle dropdown on click
        if (bellBtn && dropdown) {
            bellBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });
            
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
                    dropdown.classList.remove('show');
                }
            });
        }
        
        // Mark all as read
        if (markAllBtn) {
            markAllBtn.addEventListener('click', () => {
                this.markAllAsRead();
                if (typeof showNotification === 'function') {
                    showNotification('Tüm bildirimler okundu olarak işaretlendi', 'success');
                }
            });
        }
        
        // Initial UI update
        this.updateUI();
    },
    
    // Simulate notifications for demo
    simulateNotifications() {
        const profiles = typeof MOCK_USERS !== 'undefined' ? MOCK_USERS : [];
        if (profiles.length === 0) return;
        
        // Add a random notification every 30-60 seconds
        setInterval(() => {
            const profile = profiles[Math.floor(Math.random() * profiles.length)];
            const types = ['message', 'favorite', 'view'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            const messages = {
                message: 'size bir mesaj gönderdi',
                favorite: 'profilinizi favorilere ekledi',
                view: 'profilinizi görüntüledi'
            };
            
            this.add({
                type: type,
                fromId: profile.id,
                fromName: profile.name,
                fromAvatar: profile.thumbnail,
                message: messages[type],
                link: `profile-detail.html?id=${profile.id}`
            });
            
            // Show toast notification
            if (typeof showNotification === 'function') {
                showNotification(`${profile.name} ${messages[type]} 💕`, 'success');
            }
        }, 30000 + Math.random() * 30000);
    }
};

// Make globally available
window.NotificationSystem = NotificationSystem;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Only setup if user is logged in
    setTimeout(() => {
        if (typeof isLoggedIn === 'function' && isLoggedIn()) {
            const bellContainer = document.getElementById('notification-bell');
            if (bellContainer) {
                bellContainer.style.display = 'block';
            }
            NotificationSystem.setup();
            NotificationSystem.simulateNotifications();
        }
    }, 200);
});
