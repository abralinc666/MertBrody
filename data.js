// LovelyCam - Shared Mock Data (V3 - with 81 Cites Selection)

const MOCK_USERS = [
    // ... (Existing users can remain or be updated to use real city names if needed) ...
    // ============ FEMALE PROFILES ============
    {
        id: 'zeynep-m',
        name: 'Zeynep M.',
        gender: 'female',
        city: 'İzmir',
        age: 24,
        height: 168,
        weight: 55,
        tags: 'VIP',
        description: 'Hayatın tadını çıkarmayı seven, eğlenceli ve dinamik bir kişiliğim var. Kaliteli vakit geçirmeyi ve yeni insanlarla tanışmayı seviyorum.',
        interests: ['Yoga', 'Seyahat', 'Fotoğrafçılık'],
        languages: ['Türkçe', 'İngilizce'],
        phone: '+90 532 *** ** **',
        whatsapp: '+905321234567',
        telegram: '@zeynep_vip',
        availability: { 'Pazartesi': 80, 'Salı': 90, 'Çarşamba': 70, 'Perşembe': 85, 'Cuma': 95, 'Cumartesi': 100, 'Pazar': 60 },
        photos: [
            'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop',
        rating: 4.9,
        reviewCount: 127,
        views: 15420,
        meetings: 89,
        isPremium: true,
        isVerified: true,
        isFeatured: true,
        pricing: { hourly: 2500, nightly: 12000 },
        attributes: { bust: '90C', waist: 60, hips: 90 },
        comments: [
            { id: 'c1', author: 'Ahmet K.', avatar: 'https://ui-avatars.com/api/?name=AK&background=ff1a5c&color=fff', rating: 5, date: '2 gün önce', text: 'Harika bir deneyimdi! Çok nazik ve eğlenceli. Kesinlikle tavsiye ederim.', likes: 24 },
            { id: 'c2', author: 'Murat B.', avatar: 'https://ui-avatars.com/api/?name=MB&background=ff1a5c&color=fff', rating: 5, date: '1 hafta önce', text: 'Profesyonel ve güler yüzlü. 10/10', likes: 18 }
        ]
    },
    {
        id: 'ayse-k',
        name: 'Ayşe K.',
        gender: 'female',
        city: 'İstanbul',
        age: 27,
        height: 172,
        weight: 58,
        tags: 'Elite',
        description: 'Sofistike ve zarif bir kadınım. Özel anlarınızı unutulmaz kılmak için buradayım. Kalite ve gizlilik benim önceliğim.',
        interests: ['Opera', 'Şarap Tadımı', 'Sanat'],
        languages: ['Türkçe', 'İngilizce', 'Fransızca'],
        phone: '+90 533 *** ** **',
        whatsapp: '+905331234567',
        telegram: '@ayse_elite',
        availability: { 'Pazartesi': 60, 'Salı': 70, 'Çarşamba': 80, 'Perşembe': 75, 'Cuma': 90, 'Cumartesi': 100, 'Pazar': 50 },
        photos: [
            'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop',
        rating: 4.8,
        reviewCount: 89,
        views: 12350,
        meetings: 67,
        isPremium: true,
        isVerified: true,
        isFeatured: true,
        pricing: { hourly: 3000, nightly: 15000 },
        attributes: { bust: '85B', waist: 58, hips: 88 },
        comments: [
            { id: 'c1', author: 'Can D.', avatar: 'https://ui-avatars.com/api/?name=CD&background=ff1a5c&color=fff', rating: 5, date: '3 gün önce', text: 'Gerçekten elite bir deneyim. Çok memnun kaldım.', likes: 31 }
        ]
    },
    {
        id: 'merve-d',
        name: 'Merve D.',
        gender: 'female',
        city: 'İzmir',
        age: 22,
        height: 165,
        weight: 52,
        tags: 'Yeni',
        description: 'Genç, enerjik ve eğlenceli biriyim. Yeni deneyimlere açığım ve sizi mutlu etmek için sabırsızlanıyorum!',
        interests: ['Dans', 'Müzik', 'Plaj'],
        languages: ['Türkçe', 'İngilizce'],
        phone: '+90 534 *** ** **',
        whatsapp: '+905341234567',
        telegram: '@merve_new',
        availability: { 'Pazartesi': 90, 'Salı': 95, 'Çarşamba': 85, 'Perşembe': 90, 'Cuma': 100, 'Cumartesi': 100, 'Pazar': 80 },
        photos: [
            'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=600&h=800&fit=crop'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=400&h=500&fit=crop',
        rating: 4.6,
        reviewCount: 34,
        views: 8750,
        meetings: 28,
        isPremium: false,
        isVerified: true,
        isFeatured: false,
        pricing: { hourly: 1500, nightly: 8000 },
        attributes: { bust: '80B', waist: 56, hips: 85 },
        comments: []
    },
    {
        id: 'selin-b',
        name: 'Selin B.',
        gender: 'female',
        city: 'Antalya',
        age: 26,
        height: 170,
        weight: 56,
        tags: 'Popüler',
        description: 'Antalya\'nın en güzel sahillerinde size eşlik etmek için buradayım. Tatil arkadaşlığı için ideal seçim.',
        interests: ['Yüzme', 'Gece Hayatı', 'Yemek'],
        languages: ['Türkçe', 'İngilizce', 'Rusça'],
        phone: '+90 535 *** ** **',
        whatsapp: '+905351234567',
        telegram: '@selin_antalya',
        availability: { 'Pazartesi': 70, 'Salı': 80, 'Çarşamba': 75, 'Perşembe': 85, 'Cuma': 95, 'Cumartesi': 100, 'Pazar': 90 },
        photos: [
            'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=600&h=800&fit=crop'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=400&h=500&fit=crop',
        rating: 4.7,
        reviewCount: 156,
        views: 18920,
        meetings: 112,
        isPremium: true,
        isVerified: true,
        isFeatured: true,
        pricing: { hourly: 2000, nightly: 10000 },
        attributes: { bust: '88C', waist: 62, hips: 92 },
        comments: [
            { id: 'c1', author: 'Emre T.', avatar: 'https://ui-avatars.com/api/?name=ET&background=ff1a5c&color=fff', rating: 5, date: '1 gün önce', text: 'Muhteşem bir tatil arkadaşıydı!', likes: 42 }
        ]
    },
    {
        id: 'deniz-a',
        name: 'Deniz A.',
        gender: 'female',
        city: 'İstanbul',
        age: 29,
        height: 175,
        weight: 60,
        tags: 'Model',
        description: 'Profesyonel model ve hosteslik deneyimim var. Özel etkinlikler, iş yemekleri ve gece buluşmaları için idealim.',
        interests: ['Moda', 'Fitness', 'Lüks Yaşam'],
        languages: ['Türkçe', 'İngilizce', 'Almanca'],
        phone: '+90 536 *** ** **',
        whatsapp: '+905361234567',
        telegram: '@deniz_model',
        availability: { 'Pazartesi': 50, 'Salı': 60, 'Çarşamba': 70, 'Perşembe': 65, 'Cuma': 85, 'Cumartesi': 95, 'Pazar': 40 },
        photos: [
            'https://images.unsplash.com/photo-1514315384763-ba401779410f?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=800&fit=crop'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1514315384763-ba401779410f?w=400&h=500&fit=crop',
        rating: 4.9,
        reviewCount: 203,
        views: 24560,
        meetings: 145,
        isPremium: true,
        isVerified: true,
        isFeatured: true,
        pricing: { hourly: 4000, nightly: 20000 },
        attributes: { bust: '90C', waist: 64, hips: 94 },
        comments: []
    },
    {
        id: 'melis-k',
        name: 'Melis K.',
        gender: 'female',
        city: 'İstanbul',
        age: 25,
        height: 167,
        weight: 54,
        tags: 'VIP',
        description: 'Özel müşterilerime ayrıcalıklı hizmet sunuyorum. Lüks otel buluşmaları ve özel partiler için arayın.',
        interests: ['Alışveriş', 'Spa', 'Champagne'],
        languages: ['Türkçe', 'İngilizce'],
        phone: '+90 537 *** ** **',
        whatsapp: '+905371234567',
        telegram: '@melis_vip',
        availability: { 'Pazartesi': 75, 'Salı': 80, 'Çarşamba': 85, 'Perşembe': 80, 'Cuma': 90, 'Cumartesi': 100, 'Pazar': 70 },
        photos: [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
        rating: 4.8,
        reviewCount: 98,
        views: 14230,
        meetings: 76,
        isPremium: true,
        isVerified: true,
        isFeatured: false,
        pricing: { hourly: 3500, nightly: 18000 },
        attributes: { bust: '85C', waist: 58, hips: 88 },
        comments: []
    },
    {
        id: 'elif-s',
        name: 'Elif S.',
        gender: 'female',
        city: 'Ankara',
        age: 23,
        height: 163,
        weight: 50,
        tags: 'Öğrenci',
        description: 'Üniversite öğrencisiyim. Part-time olarak çalışıyorum. Samimi ve doğal birliktelik arayanlar için idealim.',
        interests: ['Kitap', 'Sinema', 'Kahve'],
        languages: ['Türkçe', 'İngilizce'],
        phone: '+90 538 *** ** **',
        whatsapp: '+905381234567',
        telegram: '@elif_ankara',
        availability: { 'Pazartesi': 40, 'Salı': 50, 'Çarşamba': 45, 'Perşembe': 55, 'Cuma': 80, 'Cumartesi': 90, 'Pazar': 60 },
        photos: [
            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&h=800&fit=crop'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop',
        rating: 4.5,
        reviewCount: 45,
        views: 9870,
        meetings: 32,
        isPremium: false,
        isVerified: true,
        isFeatured: false,
        pricing: { hourly: 1000, nightly: 5000 },
        attributes: { bust: '75A', waist: 54, hips: 82 },
        comments: []
    },
    {
        id: 'ceren-y',
        name: 'Ceren Y.',
        gender: 'female',
        city: 'Bursa',
        age: 28,
        height: 169,
        weight: 57,
        tags: 'Yetişkin',
        description: 'Olgun ve deneyimli bir kadınım. Kaliteli sohbet ve samimi anlar için mükemmel bir tercihim.',
        interests: ['Gastronomi', 'Seyahat', 'Sanat'],
        languages: ['Türkçe', 'İngilizce'],
        phone: '+90 539 *** ** **',
        whatsapp: '+905391234567',
        telegram: '@ceren_bursa',
        availability: { 'Pazartesi': 65, 'Salı': 70, 'Çarşamba': 75, 'Perşembe': 70, 'Cuma': 85, 'Cumartesi': 95, 'Pazar': 50 },
        photos: [
            'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=600&h=800&fit=crop'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=400&h=500&fit=crop',
        rating: 4.6,
        reviewCount: 67,
        views: 11230,
        meetings: 54,
        isPremium: true,
        isVerified: true,
        isFeatured: false,
        pricing: { hourly: 1800, nightly: 9000 },
        attributes: { bust: '88B', waist: 60, hips: 90 },
        comments: []
    },
    
    // ============ MALE PROFILES (GIGOLO) ============
    {
        id: 'can-e',
        name: 'Can E.',
        gender: 'male',
        city: 'İstanbul',
        age: 30,
        height: 185,
        weight: 82,
        tags: 'Elite Gigolo',
        description: 'Karizmatik, atletik ve çekici bir erkeğim. Kadınlara özel anlar yaşatmak benim tutkum. Gizlilik ve saygı garantisi.',
        interests: ['Fitness', 'Lüks Arabalar', 'Fine Dining'],
        languages: ['Türkçe', 'İngilizce', 'İtalyanca'],
        phone: '+90 542 *** ** **',
        whatsapp: '+905421234567',
        telegram: '@can_elite',
        availability: { 'Pazartesi': 70, 'Salı': 80, 'Çarşamba': 75, 'Perşembe': 85, 'Cuma': 95, 'Cumartesi': 100, 'Pazar': 60 },
        photos: [
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&h=800&fit=crop'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop',
        rating: 4.9,
        reviewCount: 87,
        views: 12450,
        meetings: 68,
        isPremium: true,
        isVerified: true,
        isFeatured: true,
        pricing: { hourly: 3000, nightly: 15000 },
        attributes: { size: '20cm', performance: 'Uzun Süreli', bodyType: 'Atletik', chest: 105, biceps: 40 },
        comments: [
            { id: 'c1', author: 'Sevgi H.', avatar: 'https://ui-avatars.com/api/?name=SH&background=ff1a5c&color=fff', rating: 5, date: '1 hafta önce', text: 'Gerçek bir beyefendi. Çok memnun kaldım!', likes: 28 }
        ]
    },
    {
        id: 'kaan-t',
        name: 'Kaan T.',
        gender: 'male',
        city: 'İstanbul',
        age: 28,
        height: 182,
        weight: 78,
        tags: 'VIP Gigolo',
        description: 'Yakışıklı, kaslı ve son derece çekici. Evli veya bekar bayanlar için özel hizmet. Mutlak gizlilik garantisi.',
        interests: ['Spor', 'Dans', 'Romantik Akşamlar'],
        languages: ['Türkçe', 'İngilizce'],
        phone: '+90 543 *** ** **',
        whatsapp: '+905431234567',
        telegram: '@kaan_vip',
        availability: { 'Pazartesi': 80, 'Salı': 85, 'Çarşamba': 80, 'Perşembe': 90, 'Cuma': 100, 'Cumartesi': 100, 'Pazar': 70 },
        photos: [
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
        rating: 4.8,
        reviewCount: 124,
        views: 15680,
        meetings: 95,
        isPremium: true,
        isVerified: true,
        isFeatured: true,
        pricing: { hourly: 2500, nightly: 12000 },
        attributes: { size: '19cm', performance: 'Enerjik', bodyType: 'Kaslı', chest: 102, biceps: 38 },
        comments: [
            { id: 'c1', author: 'Aylin D.', avatar: 'https://ui-avatars.com/api/?name=AD&background=ff1a5c&color=fff', rating: 5, date: '3 gün önce', text: 'İnanılmaz bir deneyimdi! Kesinlikle tekrar görüşeceğiz.', likes: 35 }
        ]
    },
    {
        id: 'burak-a',
        name: 'Burak A.',
        gender: 'male',
        city: 'Antalya',
        age: 32,
        height: 188,
        weight: 85,
        tags: 'Tatil Arkadaşı',
        description: 'Tatil için Antalya\'ya gelen bayanların ideal arkadaşı. Plaj, gece hayatı ve özel anlar için yanınızdayım.',
        interests: ['Yüzme', 'Su Sporları', 'Masaj'],
        languages: ['Türkçe', 'İngilizce', 'Rusça'],
        phone: '+90 544 *** ** **',
        whatsapp: '+905441234567',
        telegram: '@burak_antalya',
        availability: { 'Pazartesi': 90, 'Salı': 95, 'Çarşamba': 90, 'Perşembe': 95, 'Cuma': 100, 'Cumartesi': 100, 'Pazar': 85 },
        photos: [
            'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=600&h=800&fit=crop'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=500&fit=crop',
        rating: 4.7,
        reviewCount: 156,
        views: 18920,
        meetings: 112,
        isPremium: true,
        isVerified: true,
        isFeatured: true,
        pricing: { hourly: 2000, nightly: 10000 },
        attributes: { size: '21cm', performance: 'Dayanıklı', bodyType: 'Fit', chest: 108, biceps: 42 },
        comments: []
    },
    {
        id: 'emre-k',
        name: 'Emre K.',
        gender: 'male',
        city: 'İzmir',
        age: 26,
        height: 180,
        weight: 75,
        tags: 'Genç Gigolo',
        description: 'Genç, dinamik ve enerjik. Yaşlı veya genç tüm bayanlara özel ilgi ve alakam ile hizmet veriyorum.',
        interests: ['Müzik', 'Partiler', 'Romantizm'],
        languages: ['Türkçe', 'İngilizce'],
        phone: '+90 545 *** ** **',
        whatsapp: '+905451234567',
        telegram: '@emre_izmir',
        availability: { 'Pazartesi': 85, 'Salı': 90, 'Çarşamba': 85, 'Perşembe': 90, 'Cuma': 100, 'Cumartesi': 100, 'Pazar': 75 },
        photos: [
            'https://images.unsplash.com/photo-1557862921-37829c790f19?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1492288991661-058aa541ff43?w=600&h=800&fit=crop'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=400&h=500&fit=crop',
        rating: 4.6,
        reviewCount: 65,
        views: 9870,
        meetings: 48,
        isPremium: false,
        isVerified: true,
        isFeatured: false,
        pricing: { hourly: 1500, nightly: 7500 },
        attributes: { size: '18cm', performance: 'Enerjik', bodyType: 'Atletik', chest: 98, biceps: 35 },
        comments: []
    },
    {
        id: 'arda-m',
        name: 'Arda M.',
        gender: 'male',
        city: 'Ankara',
        age: 35,
        height: 183,
        weight: 80,
        tags: 'Profesyonel',
        description: 'Olgun ve deneyimli bir erkeğim. İş kadınları ve yalnız bayanlar için mükemmel bir arkadaş. Sohbet ve daha fazlası.',
        interests: ['İş Dünyası', 'Golf', 'Şarap'],
        languages: ['Türkçe', 'İngilizce', 'Almanca'],
        phone: '+90 546 *** ** **',
        whatsapp: '+905461234567',
        telegram: '@arda_ankara',
        availability: { 'Pazartesi': 60, 'Salı': 65, 'Çarşamba': 70, 'Perşembe': 75, 'Cuma': 80, 'Cumartesi': 90, 'Pazar': 50 },
        photos: [
            'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=600&h=800&fit=crop'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop',
        rating: 4.8,
        reviewCount: 89,
        views: 11230,
        meetings: 67,
        isPremium: true,
        isVerified: true,
        isFeatured: false,
        pricing: { hourly: 2500, nightly: 12000 },
        attributes: { size: '20cm', performance: 'Uzun Süreli', bodyType: 'Kaslı', chest: 104, biceps: 40 },
        comments: []
    },
    {
        id: 'baris-y',
        name: 'Barış Y.',
        gender: 'male',
        city: 'İstanbul',
        age: 29,
        height: 178,
        weight: 73,
        tags: 'Romantik',
        description: 'Romantik bir ruh taşıyan, hassas ve anlayışlı bir erkeğim. Kadınları dinlemeyi ve mutlu etmeyi seven biri.',
        interests: ['Şiir', 'Romantik Filmler', 'Yürüyüş'],
        languages: ['Türkçe', 'İngilizce'],
        phone: '+90 547 *** ** **',
        whatsapp: '+905471234567',
        telegram: '@baris_romantic',
        availability: { 'Pazartesi': 75, 'Salı': 80, 'Çarşamba': 75, 'Perşembe': 85, 'Cuma': 90, 'Cumartesi': 95, 'Pazar': 65 },
        photos: [
            'https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=500&fit=crop',
        rating: 4.7,
        reviewCount: 72,
        views: 10560,
        meetings: 55,
        isPremium: true,
        isVerified: true,
        isFeatured: false,
        pricing: { hourly: 2000, nightly: 10000 },
        attributes: { size: '19cm', performance: 'Romantik', bodyType: 'Fit', chest: 100, biceps: 36 },
        comments: []
    }
];

// Turkey Cities List (81 Provinces)
const TURKEY_CITIES = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir',
    'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
    'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari',
    'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
    'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
    'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
    'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman',
    'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];

// Helper Functions
function getUserById(id) {
    // 1. Check Mock Users
    let user = MOCK_USERS.find(u => u.id === id);
    if (user) return user;
    
    // 2. Check LocalStorage Users (Auth System)
    try {
        const storedUsers = JSON.parse(localStorage.getItem('lovelycam_users') || '[]');
        user = storedUsers.find(u => u.id === id);
        
        if (user) {
            // Ensure auth user has necessary profile fields for display
            return {
                ...user,
                name: user.username, // Auth uses username
                city: 'İstanbul', // Default
                age: 25, // Default
                views: 0,
                rating: 5.0,
                isVerified: false,
                isPremium: false,
                photos: [user.avatar || 'https://via.placeholder.com/400x400'],
                description: user.bio || 'Merhaba!',
                attributes: {},
                interests: [],
                languages: ['Türkçe'],
                availability: { 'Hafta içi': 100 },
                meetings: 0,
                reviewCount: 0,
                comments: []
            };
        }
    } catch (e) {
        console.error('Error reading generic users:', e);
    }
    
    return null;
}

function getUsersByCity(city) {
    return MOCK_USERS.filter(user => user.city.toLowerCase() === city.toLowerCase());
}

function searchUsers(query) {
    const q = query.toLowerCase();
    return MOCK_USERS.filter(user => 
        user.name.toLowerCase().includes(q) ||
        user.city.toLowerCase().includes(q) ||
        user.description.toLowerCase().includes(q) ||
        user.tags.toLowerCase().includes(q) ||
        user.interests.some(i => i.toLowerCase().includes(q))
    );
}

function getSimilarProfiles(currentUserId, count = 4) {
    const current = getUserById(currentUserId);
    if (!current) return MOCK_USERS.slice(0, count);
    
    return MOCK_USERS
        .filter(user => user.id !== currentUserId && user.gender === current.gender)
        .sort(() => Math.random() - 0.5)
        .slice(0, count);
}

function getUniqueCities() {
    return TURKEY_CITIES;
}

function formatViews(views) {
    if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
}

function formatPrice(price) {
    return price.toLocaleString('tr-TR') + ' ₺';
}

// Advanced Filter Function
function filterUsers(filters) {
    let results = [...MOCK_USERS];
    
    // Gender filter
    if (filters.gender && filters.gender !== 'all') {
        results = results.filter(u => u.gender === filters.gender);
    }
    
    // City filter
    if (filters.city && filters.city !== '' && filters.city !== 'all') {
        results = results.filter(u => u.city === filters.city);
    }
    
    // Age range filter
    if (filters.ageMin) {
        results = results.filter(u => u.age >= filters.ageMin);
    }
    if (filters.ageMax) {
        results = results.filter(u => u.age <= filters.ageMax);
    }
    
    // Price range filter
    if (filters.priceMin) {
        results = results.filter(u => u.pricing.hourly >= filters.priceMin);
    }
    if (filters.priceMax) {
        results = results.filter(u => u.pricing.hourly <= filters.priceMax);
    }
    
    // Premium only
    if (filters.premiumOnly) {
        results = results.filter(u => u.isPremium);
    }
    
    // Verified only
    if (filters.verifiedOnly) {
        results = results.filter(u => u.isVerified);
    }
    
    return results;
}
