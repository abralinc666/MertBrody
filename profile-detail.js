// LovelyCam - Profile Detail Page JavaScript

let currentProfile = null;

document.addEventListener('DOMContentLoaded', function() {
    // Get user ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    
    if (!userId) {
        showNotification('Profil bulunamadı! Ana sayfaya yönlendiriliyorsunuz...', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }
    
    // Find user
    const user = getUserById(userId);
    
    if (!user) {
        showNotification('Bu ID\'ye ait profil bulunamadı!', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }
    
    currentProfile = user;
    
    // Populate page
    populateProfile(user);
    setupEventListeners(user);
    displaySimilarProfiles(user.id);
    
    // Success notification
    setTimeout(() => {
        showNotification(`${user.name} profili yüklendi! 💕`, 'success');
    }, 500);


});

// Populate profile data
function populateProfile(user) {
    // Page title
    // Cover Image Logic (Aura Theme)
    const headerEl = document.querySelector('.profile-header');
    // Use last photo as cover or default
    const coverImg = user.photos.length > 1 ? user.photos[1] : user.photos[0];
    headerEl.style.background = `
        linear-gradient(to bottom, rgba(5,5,5,0) 0%, rgba(5,5,5,1) 100%),
        url('${coverImg}') center/cover no-repeat
    `;

    // Profile name
    document.querySelector('.profile-name').textContent = user.name; // Use textContent for security
    // If icons are needed, append them effectively as elements, but for now user.name should be text only.
    
    // Avatar Frame Logic for Header (Elite Vibe)
    // We already have a 'main-photo' in the grid, but strictly speaking "Aura" style usually has an avatar in the header too.
    // Let's create a visual avatar in the header OR Style the main photo section to look elite.
    // For now, let's keep the header focused on the NAME and COVER, and the specific main photo below.
    
    // Check for owner status
    const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const isOwner = currentUser && currentUser.id === user.id;
    
    // Update Header Actions
    const headerMsgBtn = document.getElementById('header-message-btn');
    const ownerActions = document.getElementById('owner-actions');
    const ctaContainer = document.querySelector('.cta-buttons');
    
    // Frame Class for Header elements if we add them
    let frameClass = 'basic';
    if (user.meetings > 100) frameClass = 'elite';
    else if (user.isPremium || user.meetings > 30) frameClass = 'neon';
    
    // Add glowing effect to name based on rank
    const nameEl = document.querySelector('.profile-name');
    if (frameClass === 'elite') {
        nameEl.style.textShadow = '0 0 30px rgba(255, 215, 0, 0.4)';
        nameEl.style.backgroundImage = 'var(--gradient-gold)';
    } else if (frameClass === 'neon') {
        nameEl.style.textShadow = '0 0 30px rgba(255, 26, 92, 0.4)';
    }

    if (isOwner) {
        // Owner View
        if (headerMsgBtn) headerMsgBtn.style.display = 'none';
        if (ownerActions) ownerActions.style.display = 'block';
        if (ctaContainer) ctaContainer.style.display = 'none'; // Hide bottom CTA for owner
    } else {
        // Visitor View
        if (headerMsgBtn) headerMsgBtn.style.display = 'flex';
        if (ownerActions) ownerActions.style.display = 'none';
        if (ctaContainer) ctaContainer.style.display = 'flex';
        
        // Setup new header message button
        if (headerMsgBtn) {
            headerMsgBtn.onclick = window.openMessageModal || function() { console.error('openMessageModal not found'); };
        }
    }
    
    // Meta info
    // Meta info
    document.querySelector('.profile-location').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${escapeHtml(user.city)}`;
    document.querySelector('.profile-age').innerHTML = `<i class="fas fa-birthday-cake"></i> ${escapeHtml(user.age)} Yaş`;
    document.querySelector('.profile-views').innerHTML = `<i class="fas fa-eye"></i> ${formatViews(user.views)} Görüntülenme`;
    
    // Badges
    const premiumBadge = document.querySelector('.premium-badge');
    const verifiedBadge = document.querySelector('.verified-badge');
    
    premiumBadge.style.display = user.isPremium ? 'inline-flex' : 'none';
    verifiedBadge.style.display = user.isVerified ? 'inline-flex' : 'none';
    
    // Main photo
    const mainPhoto = document.getElementById('main-photo');
    mainPhoto.src = user.photos[0];
    mainPhoto.alt = user.name;
    mainPhoto.onerror = function() {
        this.src = `https://via.placeholder.com/600x800/ff1a5c/ffffff?text=${encodeURIComponent(user.name)}`;
    };
    
    // Photo count
    document.querySelector('.photo-count span').textContent = user.photos.length;
    
    // Thumbnails
    const thumbsContainer = document.querySelector('.gallery-thumbs');
    thumbsContainer.innerHTML = '';
    
    user.photos.forEach((photo, index) => {
        const thumb = document.createElement('div');
        thumb.className = `thumb${index === 0 ? ' active' : ''}`;
        thumb.setAttribute('data-src', photo);
        
        // Lock last photo if not premium
        if (index === user.photos.length - 1 && !user.isPremium) {
            thumb.classList.add('locked');
            thumb.innerHTML = `
                <img src="${photo}" alt="Fotoğraf ${index + 1}">
                <div class="lock-overlay"><i class="fas fa-lock"></i></div>
            `;
        } else {
            thumb.innerHTML = `<img src="${photo}" alt="Fotoğraf ${index + 1}">`;
        }
        
        thumb.addEventListener('click', function() {
            if (this.classList.contains('locked')) {
                showNotification('Bu fotoğrafı görmek için premium üye olmalısınız!', 'warning');
                return;
            }
            
            document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            mainPhoto.style.opacity = '0';
            setTimeout(() => {
                mainPhoto.src = this.getAttribute('data-src');
                mainPhoto.style.opacity = '1';
            }, 200);
        });
        
        thumbsContainer.appendChild(thumb);
    });
    
    // Description
    document.querySelector('.profile-description p').textContent = user.description;
    
    // Attributes - Gender specific
    const attributesContainer = document.querySelector('.profile-attributes');
    let attributesHTML = `
        <div class="attribute">
            <span class="attribute-label">Boy</span>
            <span class="attribute-value">${escapeHtml(user.height)} cm</span>
        </div>
        <div class="attribute">
            <span class="attribute-label">Kilo</span>
            <span class="attribute-value">${escapeHtml(user.weight)} kg</span>
        </div>
    `;
    
    // Gender-specific attributes
    if (user.gender === 'male' && user.attributes) {
        attributesHTML += `
            <div class="attribute">
                <span class="attribute-label">Boyut</span>
                <span class="attribute-value">${escapeHtml(user.attributes.size || '-')}</span>
            </div>
            <div class="attribute">
                <span class="attribute-label">Performans</span>
                <span class="attribute-value">${escapeHtml(user.attributes.performance || '-')}</span>
            </div>
            <div class="attribute">
                <span class="attribute-label">Vücut Tipi</span>
                <span class="attribute-value">${escapeHtml(user.attributes.bodyType || '-')}</span>
            </div>
            <div class="attribute">
                <span class="attribute-label">Göğüs</span>
                <span class="attribute-value">${escapeHtml(user.attributes.chest || '-')} cm</span>
            </div>
            <div class="attribute">
                <span class="attribute-label">Biceps</span>
                <span class="attribute-value">${escapeHtml(user.attributes.biceps || '-')} cm</span>
            </div>
        `;
    } else if (user.gender === 'female' && user.attributes) {
        attributesHTML += `
            <div class="attribute">
                <span class="attribute-label">Göğüs</span>
                <span class="attribute-value">${escapeHtml(user.attributes.bust || '-')}</span>
            </div>
            <div class="attribute">
                <span class="attribute-label">Bel</span>
                <span class="attribute-value">${escapeHtml(user.attributes.waist || '-')} cm</span>
            </div>
            <div class="attribute">
                <span class="attribute-label">Kalça</span>
                <span class="attribute-value">${escapeHtml(user.attributes.hips || '-')} cm</span>
            </div>
        `;
    }
    
    attributesHTML += `
        <div class="attribute">
            <span class="attribute-label">İlgi Alanları</span>
            <span class="attribute-value">${escapeHtml(user.interests.join(', '))}</span>
        </div>
        <div class="attribute">
            <span class="attribute-label">Diller</span>
            <span class="attribute-value">${escapeHtml(user.languages.join(', '))}</span>
        </div>
    `;
    
    // Pricing section
    if (user.pricing) {
        attributesHTML += `
            <div class="attribute pricing-highlight">
                <span class="attribute-label">💰 Saatlik Ücret</span>
                <span class="attribute-value">${formatPrice(user.pricing.hourly)}</span>
            </div>
            <div class="attribute pricing-highlight">
                <span class="attribute-label">🌙 Gecelik Ücret</span>
                <span class="attribute-value">${formatPrice(user.pricing.nightly)}</span>
            </div>
        `;
    }
    
    attributesContainer.innerHTML = attributesHTML;
    
    // Contact
    document.querySelector('.phone-btn .contact-value').textContent = user.phone;
    document.querySelector('.whatsapp-btn').href = `https://wa.me/${user.whatsapp.replace(/\+/g, '')}`;
    document.querySelector('.telegram-btn').href = `https://t.me/${user.telegram.replace('@', '')}`;
    document.querySelector('.telegram-btn .contact-value').textContent = user.telegram;
    
    // Availability
    const availabilityGrid = document.querySelector('.availability-grid');
    availabilityGrid.innerHTML = '';
    
    Object.entries(user.availability).forEach(([day, percent]) => {
        availabilityGrid.innerHTML += `
            <div class="day-label">${day}</div>
            <div class="availability-bar">
                <div class="available" style="width: ${percent}%;"></div>
            </div>
        `;
    });
    
    // Stats
    const stats = document.querySelectorAll('.profile-stats .stat');
    if (stats[0]) stats[0].querySelector('.stat-value').textContent = user.rating.toFixed(1);
    if (stats[1]) stats[1].querySelector('.stat-value').textContent = user.meetings;
    if (stats[2]) stats[2].querySelector('.stat-value').textContent = user.reviewCount;
    
    // Like count
    document.querySelector('.like-count').textContent = Math.floor(user.views * 0.19);
    
    // Comments title
    document.querySelector('.comments-section h2').innerHTML = `<i class="fas fa-comments"></i> Yorumlar (${user.reviewCount})`;
    
    // Comment placeholder
    document.querySelector('.comment-form textarea').placeholder = `${user.name.split(' ')[0]} hakkında yorum yaz...`;
    
    // Message modal recipient
    const recipientAvatar = document.querySelector('.message-recipient-avatar');
    const recipientName = document.querySelector('.message-recipient-name');
    if (recipientAvatar) recipientAvatar.src = user.thumbnail;
    if (recipientName) recipientName.textContent = user.name;
    
    // Display comments
    displayComments(user.comments);
}

// Display comments
function displayComments(comments) {
    const commentsList = document.querySelector('.comments-list');
    const loadMoreBtn = document.querySelector('.load-more-comments');
    
    // Clear existing
    const existingComments = commentsList.querySelectorAll('.comment');
    existingComments.forEach(c => c.remove());
    
    if (comments.length === 0) {
        const noComments = document.createElement('p');
        noComments.style.cssText = 'text-align: center; color: var(--text-muted); padding: 30px;';
        noComments.textContent = 'Henüz yorum yok. İlk yorumu siz yapın! 💬';
        commentsList.insertBefore(noComments, loadMoreBtn);
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    comments.forEach(comment => {
        const commentEl = createCommentElement(comment);
        commentsList.insertBefore(commentEl, loadMoreBtn);
    });
    
    loadMoreBtn.style.display = comments.length >= 3 ? 'flex' : 'none';
}

// Create comment element
function createCommentElement(comment) {
    const commentEl = document.createElement('div');
    commentEl.className = 'comment';
    
    const stars = Array(5).fill('').map((_, i) => 
        `<i class="${i < comment.rating ? 'fas' : 'far'} fa-star"></i>`
    ).join('');
    
    // Escape user-controlled content to prevent XSS
    const safeAuthor = escapeHtml(comment.author);
    const safeText = escapeHtml(comment.text);
    const safeDate = escapeHtml(comment.date);
    
    commentEl.innerHTML = `
        <div class="comment-avatar">
            <img src="${comment.avatar}" alt="${safeAuthor}">
        </div>
        <div class="comment-content">
            <div class="comment-header">
                <h4 class="comment-author">${safeAuthor}</h4>
                <div class="comment-rating">${stars}</div>
                <div class="comment-date">${safeDate}</div>
            </div>
            <p class="comment-text">${safeText}</p>
            <div class="comment-actions">
                <button class="comment-like"><i class="far fa-thumbs-up"></i> <span>${comment.likes}</span></button>
                <button class="comment-reply"><i class="fas fa-reply"></i> Yanıtla</button>
            </div>
        </div>
    `;
    
    // Like button
    const likeBtn = commentEl.querySelector('.comment-like');
    likeBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        const count = this.querySelector('span');
        
        if (icon.classList.contains('far')) {
            icon.classList.replace('far', 'fas');
            count.textContent = parseInt(count.textContent) + 1;
        } else {
            icon.classList.replace('fas', 'far');
            count.textContent = parseInt(count.textContent) - 1;
        }
    });
    
    // Reply button
    const replyBtn = commentEl.querySelector('.comment-reply');
    replyBtn.addEventListener('click', function() {
        const authorName = commentEl.querySelector('.comment-author').textContent;
        const textarea = document.querySelector('.comment-form textarea');
        textarea.value = `@${authorName} `;
        textarea.focus();
        document.querySelector('.comment-form').scrollIntoView({ behavior: 'smooth' });
    });
    
    return commentEl;
}

// Display similar profiles
function displaySimilarProfiles(currentUserId) {
    const similarProfiles = getSimilarProfiles(currentUserId, 4);
    const container = document.querySelector('.similar-profiles');
    container.innerHTML = '';
    
    similarProfiles.forEach(profile => {
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.innerHTML = `
            <img src="${profile.thumbnail}" alt="${profile.name}" onerror="this.src='https://via.placeholder.com/400x500/ff1a5c/ffffff?text=${encodeURIComponent(profile.name)}'">
            <div class="profile-card-info">
                <h3>${profile.name}</h3>
                <div class="profile-card-location"><i class="fas fa-map-marker-alt"></i> ${profile.city}</div>
                <div class="profile-card-rating"><i class="fas fa-star"></i> ${profile.rating.toFixed(1)}</div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            window.location.href = `profile-detail.html?id=${profile.id}`;
        });
        
        container.appendChild(card);
    });
}

// Setup event listeners
function setupEventListeners(user) {
    // Back button
    document.getElementById('back-to-results').addEventListener('click', () => {
        if (document.referrer.includes('index.html') || document.referrer.endsWith('/')) {
            window.history.back();
        } else {
            window.location.href = 'index.html';
        }
    });
    
    // Favorite button
    const favoriteBtn = document.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        
        const icon = this.querySelector('i');
        const likeCount = this.querySelector('.like-count');
        let count = parseInt(likeCount.textContent);
        
        if (this.classList.contains('active')) {
            icon.classList.replace('far', 'fas');
            likeCount.textContent = count + 1;
            showNotification(`${user.name} favorilerinize eklendi! 💕`, 'success');
        } else {
            icon.classList.replace('fas', 'far');
            likeCount.textContent = count - 1;
            showNotification(`${user.name} favorilerinizden çıkarıldı.`, 'info');
        }
    });
    
    // Share button
    document.querySelector('.share-btn').addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: `${user.name} - LovelyCam`,
                text: `${user.city}'de muhteşem bir profil keşfettim!`,
                url: window.location.href
            })
            .then(() => showNotification('Profil paylaşıldı! 📤', 'success'))
            .catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href)
                .then(() => showNotification('Link kopyalandı! 📋', 'success'));
        }
    });
    
    // Report button
    document.querySelector('.report-btn').addEventListener('click', showReportModal);
    
    // Message button
    document.getElementById('send-message-btn').addEventListener('click', openMessageModal);
    
    // Message modal close
    document.getElementById('message-close').addEventListener('click', closeMessageModal);
    
    // Message form
    document.getElementById('message-form').addEventListener('submit', handleSendMessage);
    
    // Comment form
    setupCommentForm(user);
    
    // Load more comments
    document.querySelector('.load-more-comments').addEventListener('click', loadMoreComments);
    
    // Contact buttons
    setupContactButtons(user);
    
    // Back to top
    setupBackToTop();
    
    // Theme toggle
    setupThemeToggle();
}

// Message Modal Functions
function openMessageModal() {
    if (!isLoggedIn()) {
        showNotification('Mesaj göndermek için giriş yapın!', 'warning');
        document.getElementById('login-modal').style.display = 'flex';
        return;
    }
    
    const modal = document.getElementById('message-modal');
    modal.classList.add('open');
    
    // Load conversation history
    loadConversationHistory();
    
    document.getElementById('message-input').focus();
}

function closeMessageModal() {
    const modal = document.getElementById('message-modal');
    modal.classList.remove('open');
}

function loadConversationHistory() {
    const historyContainer = document.getElementById('message-history');
    historyContainer.innerHTML = '';
    
    if (!currentProfile) return;
    
    const user = getCurrentUser();
    if (!user) return;
    
    const conversation = getConversation(user.id, currentProfile.id);
    
    if (conversation.length === 0) {
        historyContainer.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 50px 20px;">
                <i class="fas fa-comment-dots" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.3;"></i>
                <p>Henüz mesaj yok. İlk mesajı siz gönderin! 💕</p>
            </div>
        `;
        return;
    }
    
    conversation.forEach(msg => {
        const isSent = msg.senderId === user.id;
        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${isSent ? 'sent' : 'received'}`;
        
        const time = new Date(msg.timestamp);
        const timeStr = time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0');
        
        bubble.innerHTML = `
            ${msg.text}
            <div class="time">${timeStr}</div>
        `;
        
        historyContainer.appendChild(bubble);
    });
    
    historyContainer.scrollTop = historyContainer.scrollHeight;
}

async function handleSendMessage(e) {
    e.preventDefault();
    
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    
    if (!text) return;
    
    if (!currentProfile) return;
    
    const user = getCurrentUser();
    if (!user) {
        showNotification('Mesaj göndermek için giriş yapın!', 'warning');
        return;
    }
    
    // Şifreli mesaj sistemini kullan (varsa)
    if (typeof secureMessaging !== 'undefined') {
        try {
            const result = await secureMessaging.sendEncryptedMessage(
                user.id,
                user.username,
                user.avatar,
                currentProfile.id,
                text
            );
            
            if (result.success) {
                // Add message to UI
                const historyContainer = document.getElementById('message-history');
                
                // Remove empty state if exists
                const emptyState = historyContainer.querySelector('div[style*="text-align: center"]');
                if (emptyState) emptyState.remove();
                
                const bubble = document.createElement('div');
                bubble.className = 'message-bubble sent';
                
                const time = new Date();
                const timeStr = time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0');
                
                bubble.innerHTML = `
                    <div class="encrypted-badge"><i class="fas fa-lock"></i></div>
                    ${escapeHtml(text)}
                    <div class="time">${timeStr}</div>
                `;
                
                historyContainer.appendChild(bubble);
                historyContainer.scrollTop = historyContainer.scrollHeight;
                
                input.value = '';
                showNotification('🔒 Şifreli mesaj gönderildi!', 'success');
                
                // Simulate reply
                setTimeout(() => {
                    simulateEncryptedReply();
                }, 3000 + Math.random() * 4000);
            }
        } catch (error) {
            console.error('Şifreli mesaj gönderilemedi:', error);
            showNotification('Mesaj gönderilemedi. Tekrar deneyin.', 'error');
        }
    } else {
        // Fallback: Eski mesaj sistemi
        const result = sendPrivateMessage(currentProfile.id, text);
        
        if (result.success) {
            const historyContainer = document.getElementById('message-history');
            const emptyState = historyContainer.querySelector('div[style*="text-align: center"]');
            if (emptyState) emptyState.remove();
            
            const bubble = document.createElement('div');
            bubble.className = 'message-bubble sent';
            
            const time = new Date();
            const timeStr = time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0');
            
            bubble.innerHTML = `
                ${text}
                <div class="time">${timeStr}</div>
            `;
            
            historyContainer.appendChild(bubble);
            historyContainer.scrollTop = historyContainer.scrollHeight;
            
            input.value = '';
            showNotification('Mesaj gönderildi! 💌', 'success');
            
            setTimeout(loadConversationHistory, 5000);
        } else {
            showNotification(result.message, 'error');
        }
    }
}

// Şifreli yanıt simülasyonu
async function simulateEncryptedReply() {
    if (!currentProfile) return;
    
    const replies = [
        `Merhaba! Mesajın için teşekkürler 😊`,
        `Selam, profilimi beğendiğin için çok mutluyum 💕`,
        `Hey! Şu an müsait değilim ama en kısa sürede döneceğim 😉`,
        `Teşekkürler! Senin profil de çok güzel görünüyor ✨`,
        `Merhaba! Tanıştığımıza memnun oldum 💋`
    ];
    
    const replyText = replies[Math.floor(Math.random() * replies.length)];
    
    if (typeof secureMessaging !== 'undefined') {
        try {
            await secureMessaging.sendEncryptedMessage(
                currentProfile.id,
                currentProfile.name,
                currentProfile.thumbnail,
                getCurrentUser().id,
                replyText
            );
            
            // Add to UI
            const historyContainer = document.getElementById('message-history');
            const bubble = document.createElement('div');
            bubble.className = 'message-bubble received';
            
            const time = new Date();
            const timeStr = time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0');
            
            bubble.innerHTML = `
                <div class="encrypted-badge"><i class="fas fa-lock"></i></div>
                ${escapeHtml(replyText)}
                <div class="time">${timeStr}</div>
            `;
            
            historyContainer.appendChild(bubble);
            historyContainer.scrollTop = historyContainer.scrollHeight;
            
            showNotification(`🔒 ${currentProfile.name} şifreli mesaj gönderdi!`, 'success');
        } catch (error) {
            console.error('Yanıt simülasyonu hatası:', error);
        }
    }
}

// HTML escape fonksiyonu
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Contact buttons
function setupContactButtons(user) {
    document.querySelectorAll('.contact-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const type = this.classList.contains('phone-btn') ? 'telefon' : 
                        this.classList.contains('whatsapp-btn') ? 'WhatsApp' : 'Telegram';
            
            if ((type === 'telefon' || type === 'WhatsApp') && !user.isPremium) {
                e.preventDefault();
                showPremiumModal(type);
                return;
            }
            
            showNotification(`${type} ile iletişime geçiliyor...`, 'info');
        });
    });
}

// Comment form
function setupCommentForm(user) {
    const ratingStars = document.querySelectorAll('.rating-stars i');
    const ratingText = document.querySelector('.rating-text');
    const ratingContainer = document.querySelector('.rating-stars');
    const commentForm = document.getElementById('comment-form');
    
    const ratingTexts = ['Puan Seç', 'Kötü', 'İdare Eder', 'Ortalama', 'İyi', 'Mükemmel'];
    
    function resetStars() {
        ratingStars.forEach(star => star.className = 'far fa-star');
    }
    
    function updateRatingText(rating) {
        ratingText.textContent = rating > 0 ? ratingTexts[rating] : ratingTexts[0];
    }
    
    ratingStars.forEach((star, index) => {
        star.addEventListener('mouseenter', function() {
            resetStars();
            for (let i = 0; i <= index; i++) {
                ratingStars[i].className = 'fas fa-star';
            }
            updateRatingText(index + 1);
        });
        
        star.addEventListener('click', function() {
            resetStars();
            for (let i = 0; i <= index; i++) {
                ratingStars[i].className = 'fas fa-star active';
            }
            ratingContainer.setAttribute('data-selected-rating', index + 1);
            updateRatingText(index + 1);
        });
    });
    
    ratingContainer.addEventListener('mouseleave', function() {
        resetStars();
        const selectedRating = this.getAttribute('data-selected-rating');
        if (selectedRating) {
            const rating = parseInt(selectedRating);
            for (let i = 0; i < rating; i++) {
                ratingStars[i].className = 'fas fa-star active';
            }
            updateRatingText(rating);
        } else {
            updateRatingText(0);
        }
    });
    
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!isLoggedIn()) {
            showNotification('Yorum yapmak için giriş yapın!', 'warning');
            document.getElementById('login-modal').style.display = 'flex';
            return;
        }
        
        const commentText = this.querySelector('textarea').value;
        const selectedRating = ratingContainer.getAttribute('data-selected-rating');
        
        if (!commentText.trim()) {
            showNotification('Lütfen bir yorum yazın!', 'warning');
            return;
        }
        
        if (!selectedRating) {
            showNotification('Lütfen bir puan seçin!', 'warning');
            return;
        }
        
        const currentUser = getCurrentUser();
        
        const newComment = {
            id: 'new-' + Date.now(),
            author: currentUser ? currentUser.username : 'Misafir',
            avatar: currentUser ? currentUser.avatar : 'https://ui-avatars.com/api/?name=Guest&background=ff1a5c&color=fff&size=50',
            rating: parseInt(selectedRating),
            date: 'Şimdi',
            text: commentText,
            likes: 0
        };
        
        const commentEl = createCommentElement(newComment);
        const commentsList = document.querySelector('.comments-list');
        const loadMoreBtn = document.querySelector('.load-more-comments');
        
        // Remove "no comments" message
        const noCommentsMsg = commentsList.querySelector('p');
        if (noCommentsMsg) noCommentsMsg.remove();
        
        commentsList.insertBefore(commentEl, loadMoreBtn);
        
        // Reset form
        this.querySelector('textarea').value = '';
        resetStars();
        ratingContainer.removeAttribute('data-selected-rating');
        updateRatingText(0);
        
        // Update count
        const commentsTitle = document.querySelector('.comments-section h2');
        const currentCount = parseInt(commentsTitle.textContent.match(/\d+/)[0]) || 0;
        commentsTitle.innerHTML = `<i class="fas fa-comments"></i> Yorumlar (${currentCount + 1})`;
        
        showNotification('Yorumunuz gönderildi! 💬', 'success');
    });
}

// Load more comments
function loadMoreComments() {
    const loadMoreBtn = document.querySelector('.load-more-comments');
    const commentsList = document.querySelector('.comments-list');
    
    const moreComments = [
        {
            id: 'extra-1',
            author: 'Emre Y.',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
            rating: 5,
            date: '3 hafta önce',
            text: 'Harika bir deneyimdi! Çok eğlenceli ve samimi biri. 💯',
            likes: 7
        },
        {
            id: 'extra-2',
            author: 'Serkan D.',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop',
            rating: 4,
            date: '1 ay önce',
            text: 'Dürüst ve samimi bir kişiliği var. Tavsiye ederim.',
            likes: 5
        }
    ];
    
    moreComments.forEach(comment => {
        const commentEl = createCommentElement(comment);
        commentsList.insertBefore(commentEl, loadMoreBtn);
    });
    
    loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> Tüm yorumlar yüklendi';
    loadMoreBtn.disabled = true;
    loadMoreBtn.style.opacity = '0.6';
}

// Report modal
function showReportModal() {
    const reasons = ['Sahte profil', 'Uygunsuz içerik', 'Sahte fotoğraflar', 'Yanlış bilgiler', 'Diğer'];
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <span class="close-modal">&times;</span>
            <h3 style="margin-bottom: 20px; padding-top: 10px;"><i class="fas fa-flag" style="color: var(--primary-color);"></i> Profili Bildir</h3>
            <form id="report-form">
                <div class="form-group">
                    <label>Bildirim Nedeni:</label>
                    <select style="width: 100%; padding: 12px; background: var(--bg-secondary); color: var(--text-color); border: 2px solid var(--glass-border); border-radius: 10px; margin-top: 8px;">
                        ${reasons.map(r => `<option value="${r}">${r}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>Detaylar:</label>
                    <textarea style="width: 100%; height: 100px; padding: 12px; background: var(--bg-secondary); color: var(--text-color); border: 2px solid var(--glass-border); border-radius: 10px; resize: none; margin-top: 8px; font-family: inherit;"></textarea>
                </div>
                <button type="submit" class="auth-submit" style="margin-top: 20px;"><i class="fas fa-paper-plane"></i> Gönder</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    
    modal.querySelector('#report-form').addEventListener('submit', (e) => {
        e.preventDefault();
        modal.remove();
        showNotification('Bildiriminiz alındı. Teşekkürler! 🙏', 'success');
    });
}

// Premium modal
function showPremiumModal(type) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px; text-align: center;">
            <span class="close-modal">&times;</span>
            <div style="font-size: 4rem; margin: 20px 0; color: var(--primary-color);">
                <i class="fas fa-crown"></i>
            </div>
            <h3 style="margin-bottom: 15px;">Premium Özellik</h3>
            <p style="margin-bottom: 25px; line-height: 1.6; color: var(--text-muted);">${type} bilgilerini görmek ve iletişime geçmek için Premium üyelik gereklidir.</p>
            <div style="display: flex; gap: 15px;">
                <button class="cta-secondary" style="flex: 1;">Daha Sonra</button>
                <button class="cta-primary" style="flex: 1;">Premium Ol</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
    modal.querySelector('.cta-secondary').addEventListener('click', () => modal.remove());
    modal.querySelector('.cta-primary').addEventListener('click', () => {
        modal.remove();
        showNotification('Premium sayfası yakında açılacak! 🚀', 'info');
    });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

// Back to top
function setupBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (backToTop) {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        }
    });
    
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Theme toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    let isDarkTheme = false;
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            isDarkTheme = !isDarkTheme;
            body.classList.toggle('dark-theme', isDarkTheme);
            themeToggle.innerHTML = isDarkTheme ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            showNotification(isDarkTheme ? 'Koyu tema aktif' : 'Açık tema aktif', 'info');
        });
    }
}

// Notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    if (!notification || !notificationMessage) return;
    
    notificationMessage.textContent = message;
    
    const notificationIcon = notification.querySelector('i');
    notificationIcon.className = '';
    
    switch (type) {
        case 'success':
            notificationIcon.className = 'fas fa-check-circle';
            notification.style.borderLeftColor = '#ff1a5c';
            break;
        case 'error':
            notificationIcon.className = 'fas fa-exclamation-circle';
            notification.style.borderLeftColor = '#f44336';
            break;
        case 'warning':
            notificationIcon.className = 'fas fa-exclamation-triangle';
            notification.style.borderLeftColor = '#ff9800';
            break;
        default:
            notificationIcon.className = 'fas fa-info-circle';
            notification.style.borderLeftColor = '#6236ff';
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}