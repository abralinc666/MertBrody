// DOM elemanlarını seçelim
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('login-modal');
const closeModal = document.getElementById('close-modal');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const tabContainer = document.querySelector('.tab-container');
const citiesDropdown = document.getElementById('cities-dropdown');
const cityDropdown = document.getElementById('city-dropdown');
const dropdownTrigger = document.getElementById('dropdown-trigger');
const photosGrid = document.getElementById('photos-grid');
const categoryFilter = document.getElementById('category-filter-input');
const categoryChips = document.getElementById('category-chips');
const gridViewBtn = document.getElementById('grid-view-btn');
const listViewBtn = document.getElementById('list-view-btn');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const galleryTitle = document.getElementById('gallery-title');
const emptyState = document.getElementById('empty-state');
const resetFiltersBtn = document.getElementById('reset-filters-btn');
const backToTop = document.getElementById('back-to-top');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');
const exploreBtn = document.getElementById('explore-btn');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');

// Genel değişkenler
let currentCity = null;
let citiesList = [];
let allPhotos = [];
let filteredPhotos = [];
let isGridView = true;

// Fotoğraf klasörlerini ve fotoğrafları yükleyelim
async function loadFolders() {
    try {
        // Tarayıcıda doğrudan dosya sistemi erişimi olmadığından fetch API kullanarak
        // sunucudan klasör listesini almalıyız, ama burada demo için
        // şehirler.txt dosyasını kullanacağız

        // Şehirler.txt dosyasını okuyalım (gerçek uygulamada sunucudan klasör listesi alınmalı)
        const response = await fetch('şehirler.txt');
        const citiesText = await response.text();
        
        // Şehir listesini satırlara bölerek oluşturalım
        citiesList = citiesText.split('\n').filter(city => city.trim() !== '');
        
        console.log("Yüklenen şehirler:", citiesList);
        
        // Şehir çiplerini oluşturalım (en popüler 5 şehir)
        const popularCities = citiesList.slice(0, 5); // İlk 5 şehir
        
        popularCities.forEach(city => {
            const chip = document.createElement('div');
            chip.classList.add('category-chip');
            chip.textContent = city;
            
            chip.addEventListener('click', () => {
                selectCity(city);
            });
            
            categoryChips.appendChild(chip);
        });
        
        // Şehirleri dropdown'a ekleyelim
        citiesList.forEach(city => {
            const cityLink = document.createElement('a');
            cityLink.href = '#';
            cityLink.textContent = city;
            
            // Şehir linkine tıklandığında
            cityLink.addEventListener('click', (e) => {
                e.preventDefault();
                selectCity(city);
                cityDropdown.classList.remove('open'); // Dropdown'ı kapat
            });
            
            citiesDropdown.appendChild(cityLink);
        });
        
        // Dropdown tıklama olayı
        dropdownTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            cityDropdown.classList.toggle('open');
        });
        
        // Dropdown dışına tıklandığında kapansın
        document.addEventListener('click', (e) => {
            if (!cityDropdown.contains(e.target)) {
                cityDropdown.classList.remove('open');
            }
        });
        
        // Şehir arama input'u tıklandığında dropdown kapanmasın
        categoryFilter.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Tüm şehirlerdeki fotoğrafları yükleyelim
        await loadAllPhotos();
        
    } catch (error) {
        console.error('Klasörler yüklenirken hata oluştu:', error);
        showNotification('Klasörler yüklenirken hata oluştu. Lütfen daha sonra tekrar deneyin.', 'error');
        
        // Hata durumunda örnek şehirleri gösterelim
        loadExampleCities();
    }
}

// Hata durumunda örnek şehirler göster
function loadExampleCities() {
    const fallbackCities = [
        'İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa',
        'Adana', 'Konya', 'Kayseri', 'Trabzon', 'Eskişehir'
    ];
    
    citiesList = fallbackCities;
    
    // Popüler şehir çipleri
    fallbackCities.slice(0, 5).forEach(city => {
        const chip = document.createElement('div');
        chip.classList.add('category-chip');
        chip.textContent = city;
        
        chip.addEventListener('click', () => {
            selectCity(city);
        });
        
        categoryChips.appendChild(chip);
    });
    
    // Dropdown şehirler
    fallbackCities.forEach(city => {
        const cityLink = document.createElement('a');
        cityLink.href = '#';
        cityLink.textContent = city;
        cityLink.addEventListener('click', (e) => {
            e.preventDefault();
            selectCity(city);
            cityDropdown.classList.remove('open'); // Dropdown'ı kapat
        });
        citiesDropdown.appendChild(cityLink);
    });
    
    // Örnek fotoğrafları gösterelim
    loadExamplePhotos();
}

// Bir şehir seçildiğinde
function selectCity(city) {
    currentCity = city;
    
    // Şehir çiplerini güncelle
    document.querySelectorAll('.category-chip').forEach(chip => {
        if (chip.textContent === city) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
    
    // Dropdown linklerini güncelle
    document.querySelectorAll('.dropdown-items a').forEach(link => {
        if (link.textContent === city) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Dropdown metin güncelle
    document.querySelector('.dropdown-btn span').textContent = city;
    
    // Başlığı güncelle
    galleryTitle.textContent = `${city} Profilleri`;
    
    // Şehre göre fotoğrafları filtrele
    filterPhotosByCity(city);
    
    // Bildirim göster
    showNotification(`${city} şehri seçildi.`, 'success');
}

// Şehre göre fotoğrafları filtrele
function filterPhotosByCity(city) {
    // Şehre ait fotoğrafları filtrele
    filteredPhotos = allPhotos.filter(photo => photo.city === city);
    
    console.log(`${city} için filtrelenen fotoğraflar:`, filteredPhotos);
    
    // Eğer şehre ait fotoğraf yoksa boş durum göster
    if (filteredPhotos.length === 0) {
        emptyState.style.display = 'block';
        photosGrid.style.display = 'none';
        showNotification(`${city} şehrinde hiç profil bulunamadı.`, 'info');
    } else {
        emptyState.style.display = 'none';
        photosGrid.style.display = 'grid';
        displayPhotos(filteredPhotos);
    }
}

// Tüm şehirlerin fotoğraflarını yükle - gerçek dosya sistemi erişimi
async function loadAllPhotos() {
    try {
        allPhotos = [];
        let totalPhotos = 0;
        
        for (const city of citiesList) {
            try {
                // Gerçek uygulamada, sunucudan şehir klasöründeki fotoğrafları çekmek için
                // bir API çağrısı yapılır, ancak burada simüle edeceğiz
                
                console.log(`${city} klasöründeki fotoğraflar kontrol ediliyor...`);
                
                // Simüle edilmiş API çağrısı (gerçek uygulamada sunucudan veri çekersiniz)
                // Gerçek bir uygulamada bu kısımda sunucudan fotoğraf listesini alacak bir fetch çağrısı olurdu
                // Örneğin: const response = await fetch(`/api/photos/${city}`);
                //          const photos = await response.json();
                
                // Her şehir için 0-5 arası rastgele fotoğraf oluşturuyoruz (simülasyon)
                const photoCount = Math.floor(Math.random() * 5) + 1;
                
                // Eğer fotoğraf varsa, bunları ekleyelim
                if (photoCount > 0) {
                    for (let i = 0; i < photoCount; i++) {
                        const names = ["Ayşe", "Elif", "Zeynep", "Derya", "Ebru", "Gül", "Merve", "Selin", "Deniz", "Melek"];
                        const surnames = ["Y.", "K.", "M.", "A.", "T.", "S.", "D.", "B.", "Ç.", "P."];
                        
                        const randomName = names[Math.floor(Math.random() * names.length)];
                        const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
                        
                        const descriptions = [
                            `${city}'da yaşayan ${20 + Math.floor(Math.random() * 15)} yaşında çekici bir profil`,
                            `${city}'da üniversite öğrencisi, eğlence ve sohbet seven`,
                            `${city}'dan seksi görünümlü, stil sahibi`,
                            `${city}'da gece hayatını seven, enerjik`,
                            `${city}'da model, fotojenik ve çekici`,
                            `${city}'da yeni, görüşmeye açık`
                        ];
                        
                        const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
                        
                        // BU KISIM ÖNEMLİ: Gerçek bir uygulamada, fotoğrafın gerçek yolunu kullanırdık
                        // Örneğin: const photoPath = `/fotoğraflar/${city}/photo${i+1}.jpg`;
                        
                        // Simülasyon için placeholder kullanıyoruz (gerçek uygulamada gerçek dosya yolları olurdu)
                        const photoPath = `/api/placeholder/400/500`;
                        
                        // Buradaki önemli kısım şudur: Gerçek uygulamada, fotoğraf yolları şöyle olurdu:
                        // /fotoğraflar/İstanbul/foto1.jpg, /fotoğraflar/İstanbul/foto2.jpg 
                        // Bu şekilde gerçek dosya sistemi yapısına göre yollar oluştururduk
                        
                        const photo = {
                            id: `${city.toLowerCase()}-${i}`,
                            title: `${randomName} ${randomSurname}`,
                            description: randomDesc,
                            url: photoPath, // Gerçek uygulamada: `/fotoğraflar/${city}/photo${i+1}.jpg`
                            city: city,
                            rating: (Math.floor(Math.random() * 5) + 1) / 10 + 4.5, // 4.5-5.0 arası rastgele puan
                            isFeatured: Math.random() > 0.8, // %20 olasılıkla öne çıkan
                            tags: ['Yeni', 'VIP', 'Premium'][Math.floor(Math.random() * 3)]
                        };
                        
                        allPhotos.push(photo);
                        totalPhotos++;
                    }
                    console.log(`${city} için ${photoCount} fotoğraf eklendi.`);
                } else {
                    console.log(`${city} klasöründe fotoğraf bulunamadı.`);
                }
            } catch (error) {
                console.error(`${city} fotoğrafları yüklenirken hata:`, error);
            }
        }
        
        console.log(`Toplam ${totalPhotos} fotoğraf yüklendi.`);
        
        // Eğer hiç fotoğraf yüklenemezse...
        if (allPhotos.length === 0) {
            showNotification('Hiç fotoğraf bulunamadı. Lütfen "fotoğraflar" klasörünü kontrol edin.', 'error');
            loadExamplePhotos(); // Örnekleri göster
            return;
        }
        
        // Popüler fotoğrafları göster
        displayPhotos(allPhotos);
        
    } catch (error) {
        console.error('Fotoğraflar yüklenirken hata oluştu:', error);
        loadExamplePhotos();
    }
}

// ÖNEMLİ AÇIKLAMA: 
// Tarayıcıda doğrudan dosya sistemine erişim güvenlik nedeniyle kısıtlıdır.
// Gerçek bir web uygulamasında, bir backend sunucusu (örneğin Node.js, PHP, Python vb.)
// kullanarak dosya sistemine erişir ve dosyaları listeleyebilirsiniz.
// 
// Bu JavaScript dosyası, bir web tarayıcısında çalışacak şekilde tasarlanmıştır ve
// tarayıcının güvenlik kısıtlamaları nedeniyle doğrudan dosya sistemine erişemez.
//
// Gerçek bir uygulama için aşağıdaki adımları takip edebilirsiniz:
// 1. Bir backend sunucusu oluşturun (Node.js, PHP vb.)
// 2. Backend'de bir API endpoint oluşturun (örneğin: /api/folders ve /api/photos/:city)
// 3. Bu JavaScript kodunda, fetch API kullanarak sunucudan klasör ve fotoğraf listelerini alın
//
// Örnek API çağrıları:
// - Klasörleri almak için: fetch('/api/folders')
// - Bir klasördeki fotoğrafları almak için: fetch(`/api/photos/${city}`)

// Örnek fotoğrafları yükle (API çağrısı başarısız olursa)
function loadExamplePhotos() {
    // Örnek fotoğraf verileri
    allPhotos = [
        {
            id: 'photo1',
            title: 'Ayşe T.',
            description: 'İstanbul\'da yaşayan 25 yaşında çekici bir profil',
            url: '/api/placeholder/400/500',
            city: 'İstanbul',
            rating: 4.8,
            isFeatured: true,
            tags: 'VIP'
        },
        {
            id: 'photo2',
            title: 'Fatma K.',
            description: 'Ankara\'da üniversite öğrencisi, eğlence ve sohbet seven',
            url: '/api/placeholder/400/500',
            city: 'Ankara',
            rating: 4.7,
            isFeatured: false,
            tags: 'Yeni'
        },
        {
            id: 'photo3',
            title: 'Zeynep M.',
            description: 'İzmir\'de yaşayan, seksi ve çekici',
            url: '/api/placeholder/400/500',
            city: 'İzmir',
            rating: 4.9,
            isFeatured: true,
            tags: 'Premium'
        },
        {
            id: 'photo4',
            title: 'Derya P.',
            description: 'Antalya\'da gece hayatını seven, enerjik',
            url: '/api/placeholder/400/500',
            city: 'Antalya',
            rating: 4.6,
            isFeatured: false,
            tags: 'Yeni'
        },
        {
            id: 'photo5',
            title: 'Ebru S.',
            description: 'Bursa\'da model, fotojenik ve çekici',
            url: '/api/placeholder/400/500',
            city: 'Bursa',
            rating: 4.7,
            isFeatured: false,
            tags: 'VIP'
        },
        {
            id: 'photo6',
            title: 'Gizem A.',
            description: 'Adana\'da yeni, görüşmeye açık',
            url: '/api/placeholder/400/500',
            city: 'Adana',
            rating: 4.8,
            isFeatured: true,
            tags: 'Premium'
        }
    ];
    
    // Fotoğrafları göster
    filteredPhotos = allPhotos;
    displayPhotos(allPhotos);
}

// Fotoğrafları göster
function displayPhotos(photos) {
    photosGrid.innerHTML = ''; // Önce grid'i temizleyelim
    
    photos.forEach((photo, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        // Öne çıkan profil ise şerit ekle
        const ribbon = photo.isFeatured ? `<div class="card-ribbon">Premium</div>` : '';
        
        card.innerHTML = `
            ${ribbon}
            <div class="card-favorite" data-id="${photo.id}">
                <i class="far fa-heart"></i>
            </div>
            <img src="${photo.url}" alt="${photo.title}">
            <div class="card-blur"></div>
            <div class="card-tag">${photo.tags}</div>
            <div class="card-content">
                <h3 class="card-title">${photo.title}</h3>
                <div class="card-location">
                    <i class="fas fa-map-marker-alt"></i> ${photo.city}
                </div>
                <p class="card-text">${photo.description}</p>
                <div class="card-footer">
                    <div class="card-rating">
                        <i class="fas fa-star"></i>
                        <span>${photo.rating.toFixed(1)}</span>
                    </div>
                    <button class="card-btn">Profili Gör</button>
                </div>
            </div>
        `;
        
        photosGrid.appendChild(card);
        
        // Favorilere ekleme düğmesi
        const favoriteBtn = card.querySelector('.card-favorite');
        favoriteBtn.addEventListener('click', () => {
            favoriteBtn.classList.toggle('active');
            const icon = favoriteBtn.querySelector('i');
            
            if (favoriteBtn.classList.contains('active')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showNotification(`${photo.title} favorilere eklendi!`, 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showNotification(`${photo.title} favorilerden çıkarıldı.`, 'info');
            }
        });
        
        // Profil görüntüleme düğmesi
        const profileBtn = card.querySelector('.card-btn');
        profileBtn.addEventListener('click', () => {
            showNotification(`${photo.title} ile iletişime geçiliyor...`, 'info');
            // Profil görüntüleme işlemleri burada yapılabilir
        });
        
        // Kartlara animasyon ekleyelim
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 100);
    });
}

// Tema değiştirme işlevi
let isDarkTheme = true; // Başlangıçta dark tema aktif
themeToggle.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    if (isDarkTheme) {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        body.classList.remove('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    showNotification(isDarkTheme ? 'Koyu tema aktif' : 'Açık tema aktif', 'info');
});

// Mobil menü açma/kapama
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Login modal işlevleri
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Tab geçişleri
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Aktif tabı güncelle
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Tab container sınıfını güncelle
        if (tab.getAttribute('data-tab') === 'register') {
            tabContainer.classList.add('register');
        } else {
            tabContainer.classList.remove('register');
        }
        
        // Aktif içeriği göster
        const tabId = tab.getAttribute('data-tab');
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            }
        });
    });
});

// Form gönderimi - Giriş Formu
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Burada giriş işlemleri yapılabilir
    console.log('Giriş yapılıyor:', email);
    loginModal.style.display = 'none';
    showNotification('Giriş başarılı! Hoş geldiniz.', 'success');
});

// Form gönderimi - Kayıt Formu
document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
        showNotification('Şifreler eşleşmiyor!', 'error');
        return;
    }
    
    // Burada kayıt işlemleri yapılabilir
    console.log('Kayıt yapılıyor:', name, email);
    loginModal.style.display = 'none';
    showNotification('Kayıt başarılı! Hoş geldiniz.', 'success');
});

// Şifre görünürlüğü toggle
togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const passwordInput = document.getElementById(targetId);
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            btn.classList.remove('fa-eye');
            btn.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            btn.classList.remove('fa-eye-slash');
            btn.classList.add('fa-eye');
        }
    });
});

// Görünüm değiştirme işlevleri
gridViewBtn.addEventListener('click', () => {
    if (!isGridView) {
        isGridView = true;
        photosGrid.classList.remove('list-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    }
});

listViewBtn.addEventListener('click', () => {
    if (isGridView) {
        isGridView = false;
        photosGrid.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    }
});

// Filtreleri sıfırla
resetFiltersBtn.addEventListener('click', () => {
    currentCity = null;
    
    // Şehir çiplerini temizle
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    
    // Dropdown linklerini temizle
    document.querySelectorAll('.dropdown-items a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Dropdown metnini sıfırla
    document.querySelector('.dropdown-btn span').textContent = 'Tüm Şehirler';
    
    // Arama kutusunu temizle
    searchInput.value = '';
    categoryFilter.value = '';
    
    // Başlığı sıfırla
    galleryTitle.textContent = 'Popüler Profiller';
    
    // Tüm fotoğrafları göster
    emptyState.style.display = 'none';
    photosGrid.style.display = 'grid';
    displayPhotos(allPhotos);
    
    showNotification('Filtreler sıfırlandı.', 'info');
});

// Şehir filtresi arama
categoryFilter.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    // Dropdown içindeki şehirleri filtrele
    document.querySelectorAll('.dropdown-items a').forEach(link => {
        const cityName = link.textContent.toLowerCase();
        
        if (cityName.includes(searchTerm) || searchTerm === '') {
            link.style.display = 'block';
        } else {
            link.style.display = 'none';
        }
    });
});

// Profil arama
searchButton.addEventListener('click', () => {
    performSearch();
});

// Arama kutusunda Enter tuşuna basılınca arama yap
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Arama işlemi
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        showNotification('Lütfen bir arama terimi girin.', 'info');
        return;
    }
    
    // Profilleri ara
    const searchResults = allPhotos.filter(photo => 
        photo.title.toLowerCase().includes(searchTerm) || 
        photo.description.toLowerCase().includes(searchTerm) ||
        photo.city.toLowerCase().includes(searchTerm) ||
        (photo.tags && photo.tags.toLowerCase().includes(searchTerm))
    );
    
    // Sonuçları göster
    if (searchResults.length === 0) {
        emptyState.style.display = 'block';
        photosGrid.style.display = 'none';
        showNotification('Aramanıza uygun sonuç bulunamadı.', 'info');
    } else {
        emptyState.style.display = 'none';
        photosGrid.style.display = 'grid';
        galleryTitle.textContent = `"${searchTerm}" için Sonuçlar`;
        displayPhotos(searchResults);
        showNotification(`"${searchTerm}" için ${searchResults.length} sonuç bulundu.`, 'success');
    }
}

// Keşfet düğmesi
exploreBtn.addEventListener('click', () => {
    // Sayfayı kategoriler bölümüne kaydır
    document.querySelector('.categories-section').scrollIntoView({ behavior: 'smooth' });
});

// Sayfa kaydırma olayları
window.addEventListener('scroll', () => {
    // Belirli bir yükseklikten sonra "Yukarı Çık" düğmesini göster
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Yukarı çık düğmesi
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Bildirim gösterme
function showNotification(message, type = 'info') {
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

// Dosya varlığını kontrol eden yardımcı fonksiyon (gerçek sunucu uygulaması için)
async function checkFileExists(fileUrl) {
    try {
        const response = await fetch(fileUrl, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.error("Dosya kontrol edilirken hata:", error);
        return false;
    }
}

// Bu fonksiyon, sunucu tarafında bir klasördeki dosyaları listelemeyi simüle eder
// Gerçek bir web uygulamasında, bir backend API'si kullanmanız gerekecektir
async function getFilesInFolder(folderPath) {
    // Bu fonksiyon sadece simülasyon amaçlıdır
    // Gerçek bir sunucu uygulamasında, folderPath'deki dosyaları listeleyen bir API olurdu
    
    console.log(`${folderPath} klasöründeki dosyalar isteniyor...`);
    
    // Gerçek bir uygulamada, aşağıdaki gibi bir API çağrısı yapılırdı:
    // const response = await fetch(`/api/files?folder=${encodeURIComponent(folderPath)}`);
    // const files = await response.json();
    // return files;
    
    // Simülasyon için, rastgele sayıda dosya döndürelim
    const fileCount = Math.floor(Math.random() * 5) + 1; // 1-5 arası rastgele dosya
    const files = [];
    
    for (let i = 0; i < fileCount; i++) {
        files.push({
            name: `photo${i+1}.jpg`,
            type: "image/jpeg",
            path: `${folderPath}/photo${i+1}.jpg`
        });
    }
    
    return files;
}

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', () => {
    // Bir bildirim göster
    showNotification('Fotoğraf klasörleri yükleniyor...', 'info');
    
    // Klasörleri ve fotoğrafları yükle
    loadFolders()
        .then(() => {
            console.log("Tüm klasörler ve fotoğraflar başarıyla yüklendi.");
        })
        .catch(error => {
            console.error("Klasörler yüklenirken beklenmeyen bir hata oluştu:", error);
            showNotification('Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
        });
    
    // Başlangıçta grid görünümünü aktif et
    gridViewBtn.classList.add('active');
    
    // Önemli Notlar (Gerçek Uygulamaya Geçerken):
    //
    // 1. Tarayıcıda dosya sistemine doğrudan erişim güvenlik kısıtlamaları nedeniyle mümkün değildir
    // 2. Gerçek bir web uygulamasında, klasörleri ve fotoğrafları listelemek için bir backend API'sine ihtiyacınız olacaktır
    // 3. Bu JavaScript kodu, bir sunucu tarafı bileşeni olmadan çalışamaz
    // 4. Sunucu tarafı için Node.js, PHP, Python veya başka bir sunucu teknolojisi kullanabilirsiniz
    //
    // Örnek bir Node.js Express API'si:
    //
    // // Klasörleri listele
    // app.get('/api/folders', (req, res) => {
    //   const photosDir = path.join(__dirname, 'public', 'fotoğraflar');
    //   fs.readdir(photosDir, (err, folders) => {
    //     if (err) return res.status(500).json({ error: err.message });
    //     res.json(folders);
    //   });
    // });
    //
    // // Bir klasördeki fotoğrafları listele
    // app.get('/api/photos/:city', (req, res) => {
    //   const cityDir = path.join(__dirname, 'public', 'fotoğraflar', req.params.city);
    //   fs.readdir(cityDir, (err, files) => {
    //     if (err) return res.status(500).json({ error: err.message });
    //     
    //     const photos = files
    //       .filter(file => ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase()))
    //       .map(file => ({
    //         name: file,
    //         url: `/fotoğraflar/${req.params.city}/${file}`
    //       }));
    //     
    //     res.json(photos);
    //   });
    // });
});

// Fotoğraflar klasöründeki klasörleri ve fotoğrafları göstermek için gerçek bir uygulama oluşturmak istiyorsanız:
//
// 1. Bir sunucu uygulaması oluşturun (Node.js, PHP, ASP.NET, Python Flask, Ruby on Rails vb.)
// 2. Klasörleri ve dosyaları listeleyen API'ler oluşturun
// 3. Bu JavaScript kodunu, API'lerinizle iletişim kuracak şekilde güncelleyin
// 4. Sunucunuzda "fotoğraflar" klasörünüzü oluşturun ve içine şehir klasörlerini ekleyin
// 5. Her şehir klasörü içine fotoğraflar ekleyin