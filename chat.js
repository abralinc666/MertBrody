// LovelyCam - Global Chat System

const CHAT_STORAGE_KEY = 'lovelycam_global_chat';
let chatSimulationInterval = null;

// Initialize chat system
function initChat() {
    loadChatHistory();
    setupChatListeners();
    startChatSimulation();
    updateOnlineCount();
}

// Get chat messages
function getChatMessages() {
    const data = localStorage.getItem(CHAT_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Save chat messages
function saveChatMessages(messages) {
    // Keep only last 100 messages
    const trimmed = messages.slice(-100);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(trimmed));
}

// Load chat history
function loadChatHistory() {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    const messages = getChatMessages();
    messagesContainer.innerHTML = '';
    
    messages.forEach(msg => {
        appendChatMessage(msg);
    });
    
    scrollChatToBottom();
}

// Append a message to chat
function appendChatMessage(msg) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    const user = getCurrentUser();
    const isOwn = user && msg.senderId === user.id;
    
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${isOwn ? 'own' : ''}`;
    
    const time = new Date(msg.timestamp);
    const timeStr = time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0');
    
    messageEl.innerHTML = `
        <img src="${msg.avatar}" alt="${escapeHtml(msg.sender)}" class="avatar">
        <div class="bubble">
            <div class="sender">${escapeHtml(msg.sender)}</div>
            <div class="text">${escapeHtml(msg.text)}</div>
            <div class="time">${timeStr}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageEl);
    scrollChatToBottom();
}

// Scroll chat to bottom
function scrollChatToBottom() {
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Send a chat message
function sendChatMessage(text) {
    const user = getCurrentUser();
    
    if (!user) {
        showNotification('Mesaj göndermek için giriş yapın!', 'warning');
        return false;
    }
    
    if (!text.trim()) return false;
    
    const message = {
        id: 'chat_' + Date.now(),
        senderId: user.id,
        sender: user.username,
        avatar: user.avatar,
        text: text.trim(),
        timestamp: new Date().toISOString()
    };
    
    const messages = getChatMessages();
    messages.push(message);
    saveChatMessages(messages);
    
    appendChatMessage(message);
    
    return true;
}

// Setup chat event listeners
function setupChatListeners() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatSection = document.getElementById('chat-section');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    
    // Toggle chat
    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            if (chatSection) {
                chatSection.classList.toggle('open');
                if (chatSection.classList.contains('open')) {
                    scrollChatToBottom();
                    if (chatInput) chatInput.focus();
                }
            }
        });
    }
    
    // Close chat
    if (chatClose) {
        chatClose.addEventListener('click', () => {
            if (chatSection) chatSection.classList.remove('open');
        });
    }
    
    // Send message
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (chatInput && chatInput.value.trim()) {
                if (sendChatMessage(chatInput.value)) {
                    chatInput.value = '';
                }
            }
        });
    }
}

// Simulate other users chatting
function startChatSimulation() {
    if (chatSimulationInterval) clearInterval(chatSimulationInterval);
    
    const simulatedMessages = [
        { sender: 'Zeynep M.', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=50&h=50&fit=crop', texts: ['Merhaba herkese 👋', 'Bu gece planı olan var mı?', 'İzmir\'den selamlar 💕'] },
        { sender: 'Ayşe K.', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=50&h=50&fit=crop', texts: ['Selam 😊', 'İstanbul\'dayım bugün', 'Yeni profil fotoğraflarımı beğendiniz mi?'] },
        { sender: 'Merve D.', avatar: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=50&h=50&fit=crop', texts: ['Heyyy!', 'İzmir hava çok güzel', 'Plaja gidiyorum 🏖️'] },
        { sender: 'Selin B.', avatar: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=50&h=50&fit=crop', texts: ['Günaydın!', 'Antalya çok sıcak 🔥', 'Kim buluşmak ister?'] },
        { sender: 'Deniz A.', avatar: 'https://images.unsplash.com/photo-1514315384763-ba401779410f?w=50&h=50&fit=crop', texts: ['Merhaba 💋', 'Çekim yapıyorum bugün', 'Sonra sohbet edelim'] },
        { sender: 'Melis K.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop', texts: ['Selam canlar', 'İstanbul\'da muhteşem bir gece olacak', 'VIP arkadaşlar davetlisiniz 🥂'] }
    ];
    
    // Add a simulated message every 10-30 seconds
    chatSimulationInterval = setInterval(() => {
        const randomUser = simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)];
        const randomText = randomUser.texts[Math.floor(Math.random() * randomUser.texts.length)];
        
        const message = {
            id: 'chat_sim_' + Date.now(),
            senderId: 'sim_' + randomUser.sender,
            sender: randomUser.sender,
            avatar: randomUser.avatar,
            text: randomText,
            timestamp: new Date().toISOString()
        };
        
        const messages = getChatMessages();
        messages.push(message);
        saveChatMessages(messages);
        
        appendChatMessage(message);
        
        // Update badge
        updateChatBadge();
        
    }, 10000 + Math.random() * 20000); // 10-30 seconds
}

// Update online count
function updateOnlineCount() {
    const onlineCount = document.getElementById('online-count');
    if (onlineCount) {
        // Random online count between 50-150
        const count = Math.floor(50 + Math.random() * 100);
        onlineCount.textContent = count + ' çevrimiçi';
    }
    
    // Update every minute
    setTimeout(updateOnlineCount, 60000);
}

// Update chat badge
function updateChatBadge() {
    const badge = document.querySelector('.chat-toggle .badge');
    const chatSection = document.getElementById('chat-section');
    
    if (badge && chatSection && !chatSection.classList.contains('open')) {
        let count = parseInt(badge.textContent) || 0;
        count++;
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'block';
    }
}

// Clear chat badge when opening
function clearChatBadge() {
    const badge = document.querySelector('.chat-toggle .badge');
    if (badge) {
        badge.textContent = '0';
        badge.style.display = 'none';
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initChat();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (chatSimulationInterval) {
        clearInterval(chatSimulationInterval);
    }
});
