// LovelyCam - Ana Sayfa JavaScript (V3 - with Custom Dropdown & No Distance)

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const photosGrid = document.getElementById('photos-grid');
const gridViewBtn = document.getElementById('grid-view-btn');
const listViewBtn = document.getElementById('list-view-btn');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const galleryTitle = document.getElementById('gallery-title');
const resultsCount = document.getElementById('results-count');
const emptyState = document.getElementById('empty-state');
const resetFiltersBtn = document.getElementById('reset-filters-btn');
const backToTop = document.getElementById('back-to-top');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');
const exploreBtn = document.getElementById('explore-btn');

// Filter Elements
const filterToggle = document.getElementById('filter-toggle');
const filterPanel = document.getElementById('filter-panel');
const genderTabs = document.querySelectorAll('.gender-tab');
// distance filter elements removed
const filterAgeMin = document.getElementById('filter-age-min');
const filterAgeMax = document.getElementById('filter-age-max');
const filterPriceMin = document.getElementById('filter-price-min');
const filterPriceMax = document.getElementById('filter-price-max');
const filterPremium = document.getElementById('filter-premium');
const filterVerified = document.getElementById('filter-verified');
const applyFiltersBtn = document.getElementById('apply-filters');
const resetFiltersAdvBtn = document.getElementById('reset-filters');

// Custom City Dropdown Elements
const customCitySelect = document.getElementById('custom-city-select');
const customSelectTrigger = customCitySelect.querySelector('.custom-select-trigger');
const selectedCityText = document.getElementById('selected-city-text');
const customOptions = customCitySelect.querySelector('.custom-options');
const citySearchInput = document.getElementById('city-search-input');
const cityOptionsList = document.getElementById('city-options-list');

// State
let currentFilters = {
    gender: 'all',
    city: 'all',
    ageMin: 18,
    ageMax: 60,
    priceMin: 0,
    priceMax: 10000,
    premiumOnly: false,
    verifiedOnly: true
};

let isGridView = true;
let isDarkTheme = false;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Load saved theme preference
    loadThemePreference();
    
    // Initialize Custom City Dropdown
    initCustomDropdown();
    
    // Initial grid view
    if (gridViewBtn) gridViewBtn.classList.add('active');
    
    // Display all profiles
    applyFilters();
    
    // Welcome notification
    setTimeout(() => {
        showNotification(`${MOCK_USERS.length} profil yüklendi! 🔥`, 'success');
    }, 500);
    
    // Setup event listeners
    setupEventListeners();
}

// Theme Persistence
function loadThemePreference() {
    const savedTheme = localStorage.getItem('lovelycam_theme');
    if (savedTheme === 'dark') {
        isDarkTheme = true;
        body.classList.add('dark-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
}

function saveThemePreference() {
    localStorage.setItem('lovelycam_theme', isDarkTheme ? 'dark' : 'light');
}

function initCustomDropdown() {
    // Populate options
    const cities = getUniqueCities();
    
    // Add "All Cities" option first
    // cityOptionsList already has it from HTML
    
    cities.forEach(city => {
        const option = document.createElement('div');
        option.className = 'option';
        option.dataset.value = city;
        option.textContent = city;
        cityOptionsList.appendChild(option);
    });
    
    // Toggle dropdown
    customSelectTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        customCitySelect.classList.toggle('open');
        if (customCitySelect.classList.contains('open')) {
            citySearchInput.focus();
        }
    });
    
    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!customCitySelect.contains(e.target)) {
            customCitySelect.classList.remove('open');
        }
    });
    
    // Search functionality
    citySearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const options = cityOptionsList.querySelectorAll('.option');
        
        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            if (text.includes(query)) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
    });
    
    // Option selection
    cityOptionsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('option')) {
            const value = e.target.dataset.value;
            const text = e.target.textContent;
            
            selectedCityText.textContent = text;
            currentFilters.city = value;
            
            // Mark selected
            cityOptionsList.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
            e.target.classList.add('selected');
            
            customCitySelect.classList.remove('open');
            citySearchInput.value = ''; // Reset search
            
            // Show all options again
            cityOptionsList.querySelectorAll('.option').forEach(o => o.style.display = 'block');
        }
    });
}

function setupEventListeners() {
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            isDarkTheme = !isDarkTheme;
            body.classList.toggle('dark-theme', isDarkTheme);
            themeToggle.innerHTML = isDarkTheme ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            saveThemePreference();
        });
    }
    
    // Mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // View toggle
    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', () => {
            if (!isGridView) {
                isGridView = true;
                if (photosGrid) photosGrid.classList.remove('list-view');
                gridViewBtn.classList.add('active');
                if (listViewBtn) listViewBtn.classList.remove('active');
            }
        });
    }
    
    if (listViewBtn) {
        listViewBtn.addEventListener('click', () => {
            if (isGridView) {
                isGridView = false;
                if (photosGrid) photosGrid.classList.add('list-view');
                listViewBtn.classList.add('active');
                if (gridViewBtn) gridViewBtn.classList.remove('active');
            }
        });
    }
    
    // Reset filters
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetAllFilters);
    }
    
    // Search
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    // Explore button
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const filterSection = document.querySelector('.filter-section');
            if (filterSection) {
                filterSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Back to top
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
    
    // Filter toggle
    if (filterToggle) {
        filterToggle.addEventListener('click', () => {
            filterToggle.classList.toggle('active');
            if (filterPanel) filterPanel.classList.toggle('open');
        });
    }
    
    // Gender tabs
    genderTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            genderTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilters.gender = tab.dataset.gender;
            applyFilters();
        });
    });
    
    // Apply filters button
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            // Collect all filter values 
            // city is updated in option click handler
            
            currentFilters.ageMin = filterAgeMin ? parseInt(filterAgeMin.value) || 18 : 18;
            currentFilters.ageMax = filterAgeMax ? parseInt(filterAgeMax.value) || 60 : 60;
            currentFilters.priceMin = filterPriceMin ? parseInt(filterPriceMin.value) || 0 : 0;
            currentFilters.priceMax = filterPriceMax ? parseInt(filterPriceMax.value) || 10000 : 10000;
            currentFilters.premiumOnly = filterPremium ? filterPremium.checked : false;
            currentFilters.verifiedOnly = filterVerified ? filterVerified.checked : true;
            
            applyFilters();
            showNotification('Filtreler uygulandı! 🎯', 'success');
        });
    }
    
    // Reset filters button (advanced panel)
    if (resetFiltersAdvBtn) {
        resetFiltersAdvBtn.addEventListener('click', resetAllFilters);
    }
}

function applyFilters() {
    const results = filterUsers(currentFilters);
    displayProfiles(results);
    
    // Update results count
    if (resultsCount) {
        resultsCount.textContent = `${results.length} profil bulundu`;
    }
    
    // Update title based on gender
    if (galleryTitle) {
        if (currentFilters.gender === 'female') {
            galleryTitle.textContent = '👩 Kadın Profilleri';
        } else if (currentFilters.gender === 'male') {
            galleryTitle.textContent = '👨 Erkek (Gigolo) Profilleri';
        } else {
            galleryTitle.textContent = '🔥 Tüm Profiller';
        }
    }
    
    // Show/hide empty state
    if (results.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (photosGrid) photosGrid.style.display = 'none';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        if (photosGrid) photosGrid.style.display = 'grid';
    }
}

function resetAllFilters() {
    currentFilters = {
        gender: 'all',
        city: 'all',
        ageMin: 18,
        ageMax: 60,
        priceMin: 0,
        priceMax: 10000,
        premiumOnly: false,
        verifiedOnly: true
    };
    
    // Reset UI
    genderTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.gender === 'all');
    });
    
    // Reset dropdown
    selectedCityText.textContent = 'Tüm Şehirler';
    cityOptionsList.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    
    if (filterAgeMin) filterAgeMin.value = 18;
    if (filterAgeMax) filterAgeMax.value = 60;
    if (filterPriceMin) filterPriceMin.value = 0;
    if (filterPriceMax) filterPriceMax.value = 10000;
    if (filterPremium) filterPremium.checked = false;
    if (filterVerified) filterVerified.checked = true;
    
    if (searchInput) searchInput.value = '';
    
    applyFilters();
    showNotification('Filtreler sıfırlandı.', 'info');
}

function performSearch() {
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    
    if (searchTerm === '') {
        showNotification('Lütfen bir arama terimi girin.', 'info');
        return;
    }
    
    const results = searchUsers(searchTerm);
    
    if (results.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (photosGrid) photosGrid.style.display = 'none';
        showNotification('Aramanıza uygun sonuç bulunamadı.', 'info');
    } else {
        if (emptyState) emptyState.style.display = 'none';
        if (photosGrid) photosGrid.style.display = 'grid';
        if (galleryTitle) galleryTitle.textContent = `"${searchTerm}" için Sonuçlar`;
        if (resultsCount) resultsCount.textContent = `${results.length} profil bulundu`;
        displayProfiles(results);
        showNotification(`"${searchTerm}" için ${results.length} sonuç bulundu.`, 'success');
    }
}

function displayProfiles(profiles) {
    if (!photosGrid) return;
    
    photosGrid.innerHTML = '';
    
    profiles.forEach((profile, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        const ribbon = profile.isFeatured ? `<div class="card-ribbon">Premium</div>` : '';
        const genderIcon = profile.gender === 'male' ? 'fa-mars' : 'fa-venus';
        const genderClass = profile.gender === 'male' ? 'male' : 'female';
        
        // Check for pricing (V3 logic)
        let priceTag = '';
        if (profile.pricing && profile.pricing.hourly) {
            priceTag = `<div class="card-price">${formatPrice(profile.pricing.hourly)}/saat</div>`;
        }
        
        // Simulating distance logic if it was still needed from mock data (optional)
        const distanceText = profile.distance ? `• ${profile.distance} km` : '';
        
        // Determine Avatar/Frame Style
        let frameClass = 'basic';
        // Logic: 
        // - > 50 meetings OR Premium = Neon/Elite
        // - > 100 meetings = Gold Elite
        
        if (profile.meetings > 100) {
            frameClass = 'elite';
        } else if (profile.isPremium || profile.meetings > 30) {
            frameClass = 'neon';
        }

        card.innerHTML = `
            <div class="card-gender ${genderClass}"><i class="fas ${genderIcon}"></i></div>
            ${profile.isOnline ? `<div class="card-online-badge"><span class="pulse-dot"></span>Çevrimiçi</div>` : ""}
            ${ribbon}
            <div class="card-favorite" data-id="${profile.id}">
                <i class="far fa-heart"></i>
            </div>
            
            <div class="card-image-wrapper">
                <img src="${profile.thumbnail}" alt="${profile.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x500/ff1a5c/ffffff?text=${encodeURIComponent(profile.name)}'">
                <div class="card-blur"></div>
            </div>
            
            <div class="card-tag ${frameClass === 'elite' ? 'gold-tag' : ''}">${profile.tags}</div>
            ${priceTag}
            
            <div class="card-content">
                <div class="card-header-row" style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                     <!-- Mini Avatar for list view or emphasis -->
                     <div class="avatar-frame ${frameClass}" style="width: 40px; height: 40px; margin: 0; padding: 2px;">
                        <img src="${profile.thumbnail}" style="width: 100%; height: 100%; object-fit: cover;">
                     </div>
                     <div>
                        <h3 class="card-title" style="font-size: 1.1rem; margin: 0;">${profile.name}</h3>
                        <div class="card-location" style="font-size: 0.8rem; margin: 0;">
                            <i class="fas fa-map-marker-alt"></i> ${profile.city}
                        </div>
                     </div>
                </div>

                <p class="card-text">${profile.description.substring(0, 70)}...</p>
                
                <div class="card-footer">
                    <div class="card-rating">
                        <i class="fas fa-star" style="color: ${frameClass === 'elite' ? 'var(--gold-color)' : 'var(--primary-color)'}"></i>
                        <span>${profile.rating.toFixed(1)}</span>
                    </div>
                    ${frameClass === 'elite' ? '<span style="font-size: 0.7rem; color: var(--gold-color); border: 1px solid var(--gold-color); padding: 2px 6px; border-radius: 10px;">ELITE</span>' : ''}
                    <button class="card-btn" data-id="${profile.id}">Profili Gör</button>
                </div>
            </div>
        `;
        
        photosGrid.appendChild(card);
        
        // Favorite button (Persisted to localStorage user favorites)
        const favoriteBtn = card.querySelector('.card-favorite');
        const loggedUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        if (loggedUser && Array.isArray(loggedUser.favorites) && loggedUser.favorites.includes(profile.id)) {
            favoriteBtn.classList.add('active');
            favoriteBtn.querySelector('i').classList.replace('far', 'fas');
        }
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
            favoriteBtn.classList.toggle('active');
            const icon = favoriteBtn.querySelector('i');
            const isFav = favoriteBtn.classList.contains('active');
            
            if (isFav) {
                icon.classList.replace('far', 'fas');
                showNotification(`${profile.name} favorilere eklendi! 💕`, 'success');
            } else {
                icon.classList.replace('fas', 'far');
                showNotification(`${profile.name} favorilerden çıkarıldı.`, 'info');
            }

            if (user) {
                const allUsers = JSON.parse(localStorage.getItem('lovelycam_users') || '[]');
                const uIdx = allUsers.findIndex(u => u.id === user.id);
                if (uIdx !== -1) {
                    const favs = new Set(allUsers[uIdx].favorites || []);
                    if (isFav) favs.add(profile.id); else favs.delete(profile.id);
                    allUsers[uIdx].favorites = Array.from(favs);
                    localStorage.setItem('lovelycam_users', JSON.stringify(allUsers));
                }
            }
        });
        
        // Profile button
        const profileBtn = card.querySelector('.card-btn');
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = `profile-detail.html?id=${profile.id}`;
        });
        
        // Card click
        card.addEventListener('click', () => {
            window.location.href = `profile-detail.html?id=${profile.id}`;
        });
        
        // Animation
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 50);
    });
}

// Notification function
function showNotification(message, type = 'info') {
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

// Role Selection Logic (For Registration Modal)
window.selectRole = function(role) {
    const step1 = document.getElementById('register-step-1');
    const registerForm = document.getElementById('register-form');
    const publisherAlert = document.getElementById('publisher-alert');
    
    if (step1) step1.style.display = 'none';
    
    if (role === 'customer') {
        if (registerForm) registerForm.style.display = 'block';
        if (publisherAlert) publisherAlert.style.display = 'none';
    } else if (role === 'publisher') {
        if (registerForm) registerForm.style.display = 'none';
        if (publisherAlert) publisherAlert.style.display = 'block';
    }
    
    // Auto-focus username input for customer
    if (role === 'customer') {
        const usernameInput = document.getElementById('register-username');
        if (usernameInput) setTimeout(() => usernameInput.focus(), 100);
    }
}

window.showRoleSelection = function() {
    const step1 = document.getElementById('register-step-1');
    const registerForm = document.getElementById('register-form');
    const publisherAlert = document.getElementById('publisher-alert');
    
    if (step1) step1.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
    if (publisherAlert) publisherAlert.style.display = 'none';
}

// V4.0 Upgrade: Sorting Select & Online Filter Binding
document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.getElementById('sort-profiles-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentFilters.sortBy = e.target.value;
            applyFilters();
        });
    }
    const onlineCheckbox = document.getElementById('filter-online');
    if (onlineCheckbox) {
        onlineCheckbox.addEventListener('change', (e) => {
            currentFilters.onlineOnly = e.target.checked;
            applyFilters();
        });
    }
});
