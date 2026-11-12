// Profil Detay Sayfası JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM elemanlarını seçelim
    const mainPhoto = document.getElementById('main-photo');
    const thumbs = document.querySelectorAll('.thumb');
    const backToResultsBtn = document.getElementById('back-to-results');
    const favoriteBtn = document.querySelector('.favorite-btn');
    const shareBtn = document.querySelector('.share-btn');
    const reportBtn = document.querySelector('.report-btn');
    const ratingStars = document.querySelectorAll('.rating-stars i');
    const ratingText = document.querySelector('.rating-text');
    const commentForm = document.getElementById('comment-form');
    const commentLikes = document.querySelectorAll('.comment-like');
    const commentReplies = document.querySelectorAll('.comment-reply');
    const loadMoreBtn = document.querySelector('.load-more-comments');
    const backToTop = document.getElementById('back-to-top');
    const profileCards = document.querySelectorAll('.profile-card');
    const contactBtns = document.querySelectorAll('.contact-btn');

    // Fotoğraf galerisi fonksiyonları
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Kilitli fotoğraf kontrolü
            if (this.classList.contains('locked')) {
                showNotification('Bu fotoğrafı görmek için premium üye olmalısınız!', 'warning');
                return;
            }

            // Aktif thumbs'ı güncelle
            thumbs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Ana fotoğrafı değiştir
            const newSrc = this.getAttribute('data-src');
            mainPhoto.style.opacity = '0';
            
            setTimeout(() => {
                mainPhoto.src = newSrc;
                mainPhoto.style.opacity = '1';
            }, 300);
        });
    });

    // Sonuçlara dön butonu
    backToResultsBtn.addEventListener('click', function() {
        window.history.back();
        // Alternatif olarak ana sayfaya yönlendirme:
        // window.location.href = 'index.html';
    });

    // Favorilere ekleme düğmesi
    favoriteBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        
        const icon = this.querySelector('i');
        const likeCount = this.querySelector('.like-count');
        let count = parseInt(likeCount.textContent);
        
        if (this.classList.contains('active')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            likeCount.textContent = count + 1;
            showNotification('Zeynep favorilerinize eklendi!', 'success');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            likeCount.textContent = count - 1;
            showNotification('Zeynep favorilerinizden çıkarıldı.', 'info');
        }
    });

    // Paylaş butonu
    shareBtn.addEventListener('click', function() {
        // Web Share API kontrolü
        if (navigator.share) {
            navigator.share({
                title: 'Zeynep M. - LovelyCam Profili',
                text: 'İzmir\'de muhteşem bir profil keşfettim. Zeynep ile tanışmak ister misin?',
                url: window.location.href
            })
            .then(() => showNotification('Profil başarıyla paylaşıldı!', 'success'))
            .catch(() => showNotification('Paylaşım iptal edildi', 'info'));
        } else {
            // Web Share API desteklenmiyorsa
            // Panoya kopyalama
            const tempInput = document.createElement('input');
            tempInput.value = window.location.href;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            showNotification('Profil bağlantısı panoya kopyalandı!', 'success');
        }
    });

    // Bildir butonu
    reportBtn.addEventListener('click', function() {
        const reasons = [
            'Sahte profil',
            'Uygunsuz içerik',
            'Sahte fotoğraflar',
            'Yanlış bilgiler',
            'Diğer'
        ];
        
        let reasonsHTML = '';
        reasons.forEach(reason => {
            reasonsHTML += `<option value="${reason}">${reason}</option>`;
        });

        const reportModal = document.createElement('div');
        reportModal.className = 'modal';
        reportModal.style.display = 'flex';
        reportModal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <span class="close-modal">&times;</span>
                <h3 style="margin-bottom: 20px;">Profili Bildir</h3>
                <form id="report-form">
                    <div class="form-group">
                        <label for="report-reason">Bildirim Nedeni:</label>
                        <select id="report-reason" style="width: 100%; padding: 10px; background-color: rgba(255, 255, 255, 0.08); color: var(--text-color); border: none; border-radius: 5px; margin-bottom: 15px;">
                            ${reasonsHTML}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="report-details">Detaylar:</label>
                        <textarea id="report-details" style="width: 100%; height: 100px; padding: 10px; background-color: rgba(255, 255, 255, 0.08); color: var(--text-color); border: none; border-radius: 5px; resize: none;"></textarea>
                    </div>
                    <button type="submit" style="width: 100%; padding: 12px; background: linear-gradient(to right, var(--gradient-start), var(--gradient-end)); color: white; border: none; border-radius: 5px; font-weight: 600; cursor: pointer; margin-top: 15px;">Bildir</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(reportModal);
        
        // Modal kapatma
        const closeBtn = reportModal.querySelector('.close-modal');
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(reportModal);
        });
        
        // Modal dışına tıklama
        reportModal.addEventListener('click', function(e) {
            if (e.target === reportModal) {
                document.body.removeChild(reportModal);
            }
        });
        
        // Form gönderimi
        const reportForm = document.getElementById('report-form');
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const reason = document.getElementById('report-reason').value;
            const details = document.getElementById('report-details').value;
            
            // Burada gerçek bir API çağrısı yapabilirsiniz
            console.log('Bildirim nedeni:', reason);
            console.log('Bildirim detayları:', details);
            
            document.body.removeChild(reportModal);
            showNotification('Bildiriminiz alındı. İncelenerek gerekli işlemler yapılacaktır.', 'success');
        });
    });

    // Yorum derecelendirme yıldızları
    ratingStars.forEach((star, index) => {
        star.addEventListener('mouseenter', function() {
            // Hover efekti
            resetStars();
            for (let i = 0; i <= index; i++) {
                ratingStars[i].className = 'fas fa-star';
            }
            
            const rating = index + 1;
            updateRatingText(rating);
        });
        
        star.addEventListener('click', function() {
            // Yıldız seçildiğinde
            resetStars();
            for (let i = 0; i <= index; i++) {
                ratingStars[i].className = 'fas fa-star active';
            }
            
            const rating = index + 1;
            updateRatingText(rating);
            
            // Seçilen derecelendirmeyi kaydet
            this.parentElement.setAttribute('data-selected-rating', rating);
        });
    });
    
    // Derecelendirme yıldızları container'ı için mouseout olayı
    document.querySelector('.rating-stars').addEventListener('mouseleave', function() {
        resetStars();
        
        // Eğer seçili bir derecelendirme varsa, onu göster
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
    
    // Yorum formu gönderimi
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const commentText = this.querySelector('textarea').value;
        const selectedRating = document.querySelector('.rating-stars').getAttribute('data-selected-rating');
        
        if (!commentText.trim()) {
            showNotification('Lütfen bir yorum yazın!', 'warning');
            return;
        }
        
        if (!selectedRating) {
            showNotification('Lütfen bir derecelendirme seçin!', 'warning');
            return;
        }
        
        // Burada gerçek bir API çağrısı yapabilirsiniz
        console.log('Yorum:', commentText);
        console.log('Derecelendirme:', selectedRating);
        
        // Yorumu sayfaya ekle
        addNewComment(commentText, selectedRating);
        
        // Formu temizle
        this.querySelector('textarea').value = '';
        resetStars();
        document.querySelector('.rating-stars').removeAttribute('data-selected-rating');
        updateRatingText(0);
        
        showNotification('Yorumunuz başarıyla gönderildi!', 'success');
    });
    
    // Yorum beğeni butonları
    commentLikes.forEach(likeBtn => {
        likeBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const count = this.querySelector('span');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                count.textContent = parseInt(count.textContent) + 1;
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                count.textContent = parseInt(count.textContent) - 1;
            }
        });
    });
    
    // Yorum yanıtlama butonları
    commentReplies.forEach(replyBtn => {
        replyBtn.addEventListener('click', function() {
            const comment = this.closest('.comment');
            const authorName = comment.querySelector('.comment-author').textContent;
            
            // Yorum yazma alanına odaklan ve '@' ile yanıt olduğunu belirt
            const textarea = document.querySelector('.comment-form textarea');
            textarea.value = `@${authorName} `;
            textarea.focus();
            
            // Sayfayı yorum formuna kaydır
            document.querySelector('.comment-form').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Daha fazla yorum butonu
    loadMoreBtn.addEventListener('click', function() {
        // Bu demo için daha fazla yorum ekleyelim
        loadMoreComments();
        
        // Gerçek uygulamada, bir API'den daha fazla yorum yükleyebilirsiniz
        // const page = parseInt(this.getAttribute('data-page') || 1) + 1;
        // this.setAttribute('data-page', page);
        // fetch(`/api/comments/profile/123?page=${page}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         if (data.comments.length > 0) {
        //             data.comments.forEach(comment => addCommentToDOM(comment));
        //         } else {
        //             this.disabled = true;
        //             this.textContent = 'Başka yorum yok';
        //         }
        //     });
    });
    
    // İletişim butonları
    contactBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const type = this.classList.contains('phone-btn') ? 'telefon' : 
                        this.classList.contains('whatsapp-btn') ? 'WhatsApp' : 'Telegram';
            
            // Premium kontrolü
            if (type === 'telefon' || type === 'WhatsApp') {
                const isPremium = Math.random() > 0.5; // Demo amaçlı rastgele premium durumu
                
                if (!isPremium) {
                    e.preventDefault();
                    showPremiumModal(type);
                    return;
                }
            }
            
            showNotification(`${type} ile iletişime geçiliyor...`, 'info');
        });
    });
    
    // Sayfa kaydırma olayları
    window.addEventListener('scroll', function() {
        // Belirli bir yükseklikten sonra "Yukarı Çık" düğmesini göster
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Yukarı çık düğmesi
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Benzer profil kartları
    profileCards.forEach(card => {
        card.addEventListener('click', function() {
            // Gerçek uygulamada, ilgili profil sayfasına yönlendirme yapabilirsiniz
            // window.location.href = `profile-detail.html?id=${this.getAttribute('data-id')}`;
            
            // Demo için mevcut sayfayı yenileyelim
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            showNotification('Profil yükleniyor...', 'info');
        });
    });
    
    // Yardımcı fonksiyonlar
    function resetStars() {
        ratingStars.forEach(star => {
            star.className = 'far fa-star';
        });
    }
    
    function updateRatingText(rating) {
        const texts = [
            'Puan Seç',
            'Kötü',
            'İdare Eder',
            'Ortalama',
            'İyi',
            'Mükemmel'
        ];
        
        ratingText.textContent = rating > 0 ? texts[rating] : texts[0];
    }
    
    function addNewComment(text, rating) {
        const commentsList = document.querySelector('.comments-list');
        const loadMoreBtn = document.querySelector('.load-more-comments');
        
        const newComment = document.createElement('div');
        newComment.className = 'comment';
        
        const stars = Array(5).fill('').map((_, i) => 
            `<i class="fas fa-star${i < rating ? '' : ' far'}"></i>`
        ).join('');
        
        newComment.innerHTML = `
            <div class="comment-avatar">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <h4 class="comment-author">Siz</h4>
                    <div class="comment-rating">
                        ${stars}
                    </div>
                    <div class="comment-date">Şimdi</div>
                </div>
                <p class="comment-text">${text}</p>
                <div class="comment-actions">
                    <button class="comment-like"><i class="far fa-thumbs-up"></i> <span>0</span></button>
                    <button class="comment-reply">Yanıtla</button>
                </div>
            </div>
        `;
        
        // Yeni yorumu listeye ekleyelim
        commentsList.insertBefore(newComment, loadMoreBtn);
        
        // Yeni yorum beğeni butonu
        const likeBtn = newComment.querySelector('.comment-like');
        likeBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const count = this.querySelector('span');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                count.textContent = parseInt(count.textContent) + 1;
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                count.textContent = parseInt(count.textContent) - 1;
            }
        });
        
        // Yeni yorum yanıtlama butonu
        const replyBtn = newComment.querySelector('.comment-reply');
        replyBtn.addEventListener('click', function() {
            const comment = this.closest('.comment');
            const authorName = comment.querySelector('.comment-author').textContent;
            
            // Yorum yazma alanına odaklan ve '@' ile yanıt olduğunu belirt
            const textarea = document.querySelector('.comment-form textarea');
            textarea.value = `@${authorName} `;
            textarea.focus();
            
            // Sayfayı yorum formuna kaydır
            document.querySelector('.comment-form').scrollIntoView({ behavior: 'smooth' });
        });
        
        // Toplam yorum sayısını güncelle
        const commentsTitle = document.querySelector('.comments-section h2');
        const currentCount = parseInt(commentsTitle.textContent.match(/\d+/)[0]);
        commentsTitle.textContent = commentsTitle.textContent.replace(/\d+/, currentCount + 1);
    }
    
    function loadMoreComments() {
        const commentsList = document.querySelector('.comments-list');
        const loadMoreBtn = document.querySelector('.load-more-comments');
        
        // Demo için 3 adet yeni yorum ekleyelim
        const newComments = [
            {
                author: 'Emre Y.',
                rating: 5,
                date: '3 hafta önce',
                text: 'İzmir\'deki kısa tatilimde Zeynep ile tanıştım. Çok eğlenceli ve samimi bir kişiliği var. Şehri gezdik ve muhteşem vakit geçirdik. Teşekkürler Zeynep!',
                likes: 7
            },
            {
                author: 'Serkan D.',
                rating: 4,
                date: '1 ay önce',
                text: 'Zeynep gerçekten harika biri! İlk başta biraz çekingendim ama çok rahat hissettirdi. Telefonda konuştuğumuzda anlattıklarının aynısı çıktı. Dürüst ve samimi bir kız.',
                likes: 5
            },
            {
                author: 'Hakan T.',
                rating: 5,
                date: '1 ay önce',
                text: 'Zeynep ile akşam yemeğinde buluştuk. Fotoğraflarından bile daha güzel ve sohbeti çok keyifli. İzmir\'de olduğum her zaman tekrar görüşmek isterim.',
                likes: 9
            }
        ];
        
        newComments.forEach(comment => {
            const newComment = document.createElement('div');
            newComment.className = 'comment';
            
            const stars = Array(5).fill('').map((_, i) => 
                `<i class="${i < comment.rating ? 'fas' : 'far'} fa-star"></i>`
            ).join('');
            
            newComment.innerHTML = `
                <div class="comment-avatar">
                    <img src="/api/placeholder/50/50" alt="Kullanıcı">
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <h4 class="comment-author">${comment.author}</h4>
                        <div class="comment-rating">
                            ${stars}
                        </div>
                        <div class="comment-date">${comment.date}</div>
                    </div>
                    <p class="comment-text">${comment.text}</p>
                    <div class="comment-actions">
                        <button class="comment-like"><i class="far fa-thumbs-up"></i> <span>${comment.likes}</span></button>
                        <button class="comment-reply">Yanıtla</button>
                    </div>
                </div>
            `;
            
            // Yeni yorumu listeye ekleyelim
            commentsList.insertBefore(newComment, loadMoreBtn);
            
            // Yeni yorum beğeni butonu
            const likeBtn = newComment.querySelector('.comment-like');
            likeBtn.addEventListener('click', function() {
                const icon = this.querySelector('i');
                const count = this.querySelector('span');
                
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    count.textContent = parseInt(count.textContent) + 1;
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    count.textContent = parseInt(count.textContent) - 1;
                }
            });
            
            // Yeni yorum yanıtlama butonu
            const replyBtn = newComment.querySelector('.comment-reply');
            replyBtn.addEventListener('click', function() {
                const comment = this.closest('.comment');
                const authorName = comment.querySelector('.comment-author').textContent;
                
                // Yorum yazma alanına odaklan ve '@' ile yanıt olduğunu belirt
                const textarea = document.querySelector('.comment-form textarea');
                textarea.value = `@${authorName} `;
                textarea.focus();
                
                // Sayfayı yorum formuna kaydır
                document.querySelector('.comment-form').scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        // Yüklenen yorum sayısını kontrol edelim
        // Demo için, sadece 1 kez daha fazla yorum yüklenebilsin
        const loadedCount = loadMoreBtn.getAttribute('data-loaded-count') || 0;
        if (parseInt(loadedCount) >= 1) {
            loadMoreBtn.textContent = 'Başka yorum yok';
            loadMoreBtn.disabled = true;
            loadMoreBtn.style.opacity = '0.6';
        } else {
            loadMoreBtn.setAttribute('data-loaded-count', parseInt(loadedCount) + 1);
        }
    }
    
    function showPremiumModal(type) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px; text-align: center;">
                <span class="close-modal">&times;</span>
                <div style="font-size: 3rem; margin-bottom: 15px; color: var(--primary-color);">
                    <i class="fas fa-crown"></i>
                </div>
                <h3 style="margin-bottom: 15px;">Premium Özellik</h3>
                <p style="margin-bottom: 20px; line-height: 1.6;">${type} bilgilerini görmek ve iletişime geçmek için Premium üyelik gereklidir.</p>
                <div style="display: flex; gap: 15px; margin-top: 20px;">
                    <button class="cta-secondary" style="flex: 1;">Daha Sonra</button>
                    <button class="cta-primary" style="flex: 1;">Premium Ol</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Modal kapatma
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // Modal dışına tıklama
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Daha sonra butonu
        const laterBtn = modal.querySelector('.cta-secondary');
        laterBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // Premium ol butonu
        const premiumBtn = modal.querySelector('.cta-primary');
        premiumBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
            
            // Kullanıcıyı premium sayfasına yönlendir (burada demo için bildirim gösteriyoruz)
            showNotification('Premium sayfasına yönlendiriliyorsunuz...', 'info');
            
            // Gerçek uygulamada:
            // window.location.href = 'premium.html';
        });
    }
    
    // Bildirim gösterme
    function showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        
        notificationMessage.textContent = message;
        
        // Bildirim türüne göre ikon değiştir
        const notificationIcon = notification.querySelector('i');
        notificationIcon.className = ''; // sınıfları temizle
        
        switch (type) {
            case 'success':
                notificationIcon.className = 'fas fa-check-circle';
                notification.style.borderLeftColor = '#ff3c69';
                break;
            case 'error':
                notificationIcon.className = 'fas fa-exclamation-circle';
                notification.style.borderLeftColor = '#f44336';
                break;
            case 'warning':
                notificationIcon.className = 'fas fa-exclamation-triangle';
                notification.style.borderLeftColor = '#ff9800';
                break;
            default: // info
                notificationIcon.className = 'fas fa-info-circle';
                notification.style.borderLeftColor = '#6236ff';
        }
        
        // Bildirimi göster
        notification.classList.add('show');
        
        // 3 saniye sonra bildirim kaybolsun
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // İlk yükleme sırasında bildirim göster
    setTimeout(() => {
        showNotification('Zeynep\'in profili yüklendi!', 'success');
    }, 1000);
});