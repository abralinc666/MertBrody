// LovelyCam - Security Utilities
// Centralized security functions for the entire application

const Security = {
    // HTML Escape - Prevents XSS attacks
    escapeHtml(text) {
        if (text === null || text === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    },

    // Sanitize URL - Only allow safe URLs
    sanitizeUrl(url) {
        if (!url) return '';
        try {
            const parsed = new URL(url);
            // Only allow http, https protocols
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                return '';
            }
            return url;
        } catch {
            return '';
        }
    },

    // Input Validation
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },

    validateUsername(username) {
        // 3-20 chars, alphanumeric and underscore only
        const re = /^[a-zA-Z0-9_]{3,20}$/;
        return re.test(username);
    },

    validatePassword(password) {
        // At least 6 characters
        return password && password.length >= 6;
    },

    // Rate Limiting
    rateLimiter: {
        attempts: {},
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000, // 15 minutes

        check(key) {
            const now = Date.now();
            if (!this.attempts[key]) {
                this.attempts[key] = { count: 1, firstAttempt: now };
                return true;
            }

            const record = this.attempts[key];
            
            // Reset if window expired
            if (now - record.firstAttempt > this.windowMs) {
                this.attempts[key] = { count: 1, firstAttempt: now };
                return true;
            }

            // Check if max attempts reached
            if (record.count >= this.maxAttempts) {
                const remainingTime = Math.ceil((this.windowMs - (now - record.firstAttempt)) / 60000);
                return { blocked: true, remainingMinutes: remainingTime };
            }

            record.count++;
            return true;
        },

        reset(key) {
            delete this.attempts[key];
        }
    },

    // CSRF Token Management
    csrf: {
        generate() {
            const array = new Uint8Array(32);
            crypto.getRandomValues(array);
            return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
        },

        store(token) {
            sessionStorage.setItem('csrf_token', token);
        },

        get() {
            let token = sessionStorage.getItem('csrf_token');
            if (!token) {
                token = this.generate();
                this.store(token);
            }
            return token;
        },

        validate(token) {
            return token === sessionStorage.getItem('csrf_token');
        }
    },

    // Session Management
    session: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours

        isExpired() {
            const session = localStorage.getItem('lovelycam_session');
            if (!session) return true;
            
            try {
                const parsed = JSON.parse(session);
                const loginTime = new Date(parsed.loginTime).getTime();
                return Date.now() - loginTime > this.maxAge;
            } catch {
                return true;
            }
        },

        checkAndRedirect() {
            if (this.isExpired()) {
                localStorage.removeItem('lovelycam_session');
                if (!window.location.pathname.includes('index.html')) {
                    window.location.href = 'index.html';
                }
                return false;
            }
            return true;
        }
    }
};

// Make globally available
window.Security = Security;

// Also provide standalone escapeHtml for convenience
window.escapeHtml = Security.escapeHtml;

// === E2EE SECURE MESSAGING (Simulation) ===
window.secureMessaging = {
    // Get or Create User Key (Simulation)
    async getUserKey(userId) {
        let keyStr = localStorage.getItem('e2ee_keys_' + userId);
        if (!keyStr) {
            const key = await CryptoUtils.generateKey();
            keyStr = await CryptoUtils.exportKey(key);
            localStorage.setItem('e2ee_keys_' + userId, keyStr);
        }
        return await CryptoUtils.importKey(keyStr);
    },

    // Send Encrypted Message
    async sendEncryptedMessage(senderId, senderName, senderAvatar, recipientId, text) {
        try {
            // In a real app, we would fetch Recipient's Public Key.
            // Here, we simulate by using their stored Symmetric Key.
            const recipientKey = await this.getUserKey(recipientId);
            const userKey = await this.getUserKey(senderId);
            
            // Encrypt for Recipient
            const encryptedForRecipient = await CryptoUtils.encrypt(text, recipientKey);
            
            // Encrypt for Self (so we can read it later)
            const encryptedForSelf = await CryptoUtils.encrypt(text, userKey);

            const newMessage = {
                id: 'msg_' + Date.now(),
                senderId: senderId,
                senderName: senderName,
                senderAvatar: senderAvatar,
                recipientId: recipientId,
                encryptedData: encryptedForRecipient,
                encryptedSelf: encryptedForSelf,
                timestamp: new Date().toISOString(),
                read: false,
                isEncrypted: true
            };

            const messages = JSON.parse(localStorage.getItem('lovelycam_messages') || '[]');
            messages.push(newMessage);
            localStorage.setItem('lovelycam_messages', JSON.stringify(messages));
            
            return { success: true };
        } catch (e) {
            console.error("Encryption Error:", e);
            return { success: false, message: 'Şifreleme hatası.' };
        }
    },
    
    // Get Decrypted Conversations
    async getUserConversations(userId) {
        const messages = JSON.parse(localStorage.getItem('lovelycam_messages') || '[]');
        const userKey = await this.getUserKey(userId);
        
        const conversations = {};
        
        for (const msg of messages) {
            if (msg.recipientId === userId || msg.senderId === userId) {
                // Decrypt logic
                if (msg.isEncrypted) {
                    try {
                        if (msg.recipientId === userId) {
                             msg.text = await CryptoUtils.decrypt(msg.encryptedData, userKey);
                        } else {
                             // Sender is me, use encryptedSelf if available, else try fallbacks
                             if (msg.encryptedSelf) {
                                 msg.text = await CryptoUtils.decrypt(msg.encryptedSelf, userKey);
                             } else {
                                 // Fallback for simulation transparency (or if pre-update message)
                                 // Try decrypting with recipient key (cheat)
                                 const partnerKey = await this.getUserKey(msg.recipientId);
                                 msg.text = await CryptoUtils.decrypt(msg.encryptedData, partnerKey);
                             }
                        }
                    } catch (e) {
                        msg.text = '[Şifre Çözülemedi]';
                    }
                }
                
                // Grouping
                const partnerId = msg.senderId === userId ? msg.recipientId : msg.senderId;
                if (!conversations[partnerId]) {
                    conversations[partnerId] = {
                        partnerId: partnerId,
                        partnerName: msg.senderId === partnerId ? msg.senderName : null,
                        partnerAvatar: msg.senderId === partnerId ? msg.senderAvatar : null,
                        messages: [],
                        unreadCount: 0
                    };
                }
                
                conversations[partnerId].messages.push(msg);
                
                if (msg.senderId === partnerId) {
                    conversations[partnerId].partnerName = msg.senderName;
                    conversations[partnerId].partnerAvatar = msg.senderAvatar;
                }
                
                if (msg.recipientId === userId && !msg.read) {
                    conversations[partnerId].unreadCount++;
                }
            }
        }
        
        return Object.values(conversations).map(c => {
             c.messages.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
             c.lastMessage = c.messages[c.messages.length - 1];
             c.totalMessages = c.messages.length;
             return c;
        }).sort((a,b) => new Date(b.lastMessage?.timestamp) - new Date(a.lastMessage?.timestamp));
    }
};

// Check session on page load
document.addEventListener('DOMContentLoaded', () => {
    Security.session.checkAndRedirect();
});
