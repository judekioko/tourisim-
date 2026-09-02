// ===== API CLIENT (talks to the Django backend - see the safaris-api repo) =====
const AUTH_STORAGE_KEY = 'safariAuth';

function getStoredAuth() {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function setStoredAuth(auth) {
    if (auth) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }
}

function extractErrorMessage(data) {
    if (!data) return null;
    if (data.detail) return data.detail;
    const firstKey = Object.keys(data)[0];
    if (!firstKey) return null;
    const value = data[firstKey];
    return Array.isArray(value) ? value[0] : String(value);
}

async function apiRequest(path, { method = 'GET', body, auth: useAuth = false } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (useAuth) {
        const stored = getStoredAuth();
        if (stored && stored.access) headers['Authorization'] = `Bearer ${stored.access}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    let data = null;
    try {
        data = await response.json();
    } catch {
        // No JSON body (e.g. empty response) - leave data as null.
    }

    if (!response.ok) {
        const error = new Error(extractErrorMessage(data) || `Request failed (${response.status})`);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

// ===== KENYA SAFARI PACKAGES DATA =====
const packages = [
    {
        id: 1,
        name: '🦁 Masai Mara Great Migration',
        category: 'adventure',
        price: 550,
        duration: '4 days',
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&h=350&fit=crop',
        description: 'Witness millions of wildebeest and zebras crossing the Mara River in the most spectacular safari experience on Earth.',
        rating: 5,
        reviews: 428,
        includes: ['Game drives', 'Expert guides', 'Accommodation', 'Meals', 'Wildlife viewing']
    },
    {
        id: 2,
        name: '🐘 Amboseli Elephant Paradise',
        category: 'family',
        price: 400,
        duration: '3 days',
        image: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=500&h=350&fit=crop',
        description: 'Experience Kenya\'s iconic elephants with breathtaking Kilimanjaro views. Perfect for families and first-time safari-goers.',
        rating: 4.9,
        reviews: 356,
        includes: ['Elephant viewing', 'Kilimanjaro views', 'Photography spots', 'Meals']
    },
    {
        id: 3,
        name: '📸 Kenya Photography Safari',
        category: 'photography',
        price: 750,
        duration: '5 days',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=350&fit=crop',
        description: 'Professional photography guides help capture the magic of Kenya\'s wildlife, landscapes, and sunrises.',
        rating: 5,
        reviews: 289,
        includes: ['Photography guide', 'Prime locations', 'Post-processing tips', 'Accommodation']
    },
    {
        id: 4,
        name: '🏛️ Nairobi & Maasai Culture',
        category: 'cultural',
        price: 350,
        duration: '2 days',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=350&fit=crop',
        description: 'Explore Nairobi\'s museums, visit authentic Maasai villages, learn tribal traditions, and experience local crafts.',
        rating: 4.7,
        reviews: 215,
        includes: ['Museum tours', 'Village visits', 'Maasai warriors', 'Traditional meals']
    },
    {
        id: 5,
        name: '✨ Kenya Luxury Experience',
        category: 'luxury',
        price: 1500,
        duration: '7 days',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=350&fit=crop',
        description: 'Ultimate luxury safari across multiple reserves with 5-star lodges, private guides, and exclusive experiences.',
        rating: 5,
        reviews: 124,
        includes: ['Luxury lodges', 'Private guide', 'Gourmet meals', 'All activities', 'Spa']
    },
    {
        id: 6,
        name: '👨‍👩‍👧‍👦 Family Safari Adventure',
        category: 'family',
        price: 480,
        duration: '3 days',
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&h=350&fit=crop',
        description: 'Kid-friendly safari with activities suitable for all ages. Perfect introduction to Kenya\'s wildlife and nature.',
        rating: 4.8,
        reviews: 267,
        includes: ['Game drives', 'Junior guide activities', 'Safe lodges', 'Family meals']
    },
    {
        id: 7,
        name: '🏖️ Safari & Beach Paradise',
        category: 'adventure',
        price: 900,
        duration: '6 days',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=350&fit=crop',
        description: 'Combine wildlife safari with relaxation on Diani Beach. Experience both wild and serene Kenya.',
        rating: 4.8,
        reviews: 198,
        includes: ['Safari + beach', 'Water sports', 'Beach resort', 'All meals']
    },
    {
        id: 8,
        name: '🌅 Mount Kenya Trek & Safari',
        category: 'adventure',
        price: 650,
        duration: '4 days',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=350&fit=crop',
        description: 'Trek Africa\'s second-highest peak and enjoy stunning ecosystems. Adventure meets natural beauty.',
        rating: 4.9,
        reviews: 142,
        includes: ['Mountain trek', 'Expert mountaineers', 'Wildlife viewing', 'Accommodation']
    },
    {
        id: 9,
        name: '🦓 Tsavo Wilderness Escape',
        category: 'adventure',
        price: 520,
        duration: '3 days',
        image: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=500&h=350&fit=crop',
        description: 'Kenya\'s largest reserve offers raw African wilderness with vast landscapes and diverse wildlife.',
        rating: 4.7,
        reviews: 176,
        includes: ['Game drives', 'Red elephant viewing', 'Wilderness lodges', 'Meals']
    }
];

// ===== KENYA GALLERY IMAGES - Cultural & Wildlife =====
const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&h=400&fit=crop', title: 'Great Migration - Wildebeest Crossing' },
    { src: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500&h=400&fit=crop', title: 'Maasai Warriors in Traditional Dress' },
    { src: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=500&h=400&fit=crop', title: 'Amboseli Elephants with Kilimanjaro' },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop', title: 'Stunning African Sunset' },
    { src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=400&fit=crop', title: 'Pride of Lions at Rest' },
    { src: 'https://images.unsplash.com/photo-1516109881827-cf1c84f7dd51?w=500&h=400&fit=crop', title: 'Zebra Herd in Savanna' },
    { src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=400&fit=crop', title: 'Nairobi Skyline at Dusk' },
    { src: 'https://images.unsplash.com/photo-1505455184862-48099d1d16e4?w=500&h=400&fit=crop', title: 'Flamingos at Lake Nakuru' },
    { src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=400&fit=crop', title: 'African Buffalo in Natural Habitat' },
    { src: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=500&h=400&fit=crop', title: 'Giraffe Family Browsing' },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop', title: 'Safari Sunrise Over the Mara' },
    { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop', title: 'Hell\'s Gate Gorge Adventure' }
];

// ===== AUTHENTIC KENYA REVIEWS =====
const reviews = [
    {
        name: 'James Kariuki',
        location: 'Nairobi, Kenya',
        rating: 5,
        text: 'Incredible experience! As a local, I was amazed at how they showcased Kenya\'s beauty. The guides are true experts. Highly recommended for both locals and tourists!'
    },
    {
        name: 'Sarah Johnson',
        location: 'United States',
        rating: 5,
        text: 'Best safari ever! The Great Migration was absolutely mind-blowing. The Maasai village visit was authentic and moving. Kenya is magical!'
    },
    {
        name: 'Ahmed Mohamed',
        location: 'UAE',
        rating: 4.8,
        text: 'Professional team, excellent guides, amazing wildlife photography opportunities. The Kenyan dishes were delicious! Will definitely come back.'
    },
    {
        name: 'Marie Dubois',
        location: 'France',
        rating: 5,
        text: 'A dream realized! Saw the Big Five, experienced breathtaking sunsets, and connected with the Maasai people. Kenya touched my soul.'
    },
    {
        name: 'David Kipchoge',
        location: 'Kisumu, Kenya',
        rating: 5,
        text: 'Great service for both tourists and locals. The team really understands Kenya deeply. They support local communities. This is tourism done right!'
    },
    {
        name: 'Emma Wilson',
        location: 'UK',
        rating: 4.9,
        text: 'Family loved it! The kids learned so much about wildlife. Amboseli was perfect for first-time safari. Professional, safe, and unforgettable.'
    },
    {
        name: 'Fatima Hassan',
        location: 'Mombasa, Kenya',
        rating: 5,
        text: 'Supporting local business! Great to see Kenyans running world-class safaris. Recommended to all my friends and family.'
    },
    {
        name: 'Marco Rossi',
        location: 'Italy',
        rating: 4.7,
        text: 'The photography opportunities were incredible. Guides knew exactly where to find the best wildlife moments. Truly special adventure!'
    }
];

// ===== INITIALIZE PAGE =====
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    renderPackages('all');
    renderGallery();
    renderReviews();
    populatePackageSelect();
    setupMenuToggle();
    setupAccountModal();
    setupPriceCalculation();
    setMinDate();
    initAuthState();
}

// ===== RENDER PACKAGES =====
function renderPackages(category) {
    const packagesGrid = document.getElementById('packagesGrid');
    packagesGrid.innerHTML = '';

    let filteredPackages = category === 'all' 
        ? packages 
        : packages.filter(p => p.category === category);

    filteredPackages.forEach(pkg => {
        const stars = '★'.repeat(Math.floor(pkg.rating)) + '☆'.repeat(5 - Math.floor(pkg.rating));
        const packageCard = document.createElement('div');
        packageCard.className = 'package-card';
        packageCard.innerHTML = `
            <div style="position: relative;">
                <img src="${pkg.image}" alt="${pkg.name}" class="package-image">
                <span class="package-badge">${pkg.category.toUpperCase()}</span>
            </div>
            <div class="package-content">
                <h3>${pkg.name}</h3>
                <div class="package-rating">${stars} (${pkg.reviews} reviews)</div>
                <p>${pkg.description}</p>
                <div class="package-details">
                    <span><i class="fas fa-clock"></i> ${pkg.duration}</span>
                    <span><i class="fas fa-star"></i> ${pkg.rating}/5</span>
                </div>
                <div class="package-price">$${pkg.price}</div>
                <button class="btn btn-primary" onclick="selectPackage(${pkg.id})">Select Package</button>
            </div>
        `;
        packagesGrid.appendChild(packageCard);
    });
}

// ===== FILTER PACKAGES =====
function filterPackages(category, btnEl) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (btnEl) btnEl.classList.add('active');
    renderPackages(category);
}

// ===== SELECT PACKAGE =====
function selectPackage(packageId) {
    const pkg = packages.find(p => p.id === packageId);
    if (pkg) {
        document.getElementById('packageSelect').value = packageId;
        updatePackagePrice();
        scrollToSection('booking');
    }
}

// ===== POPULATE PACKAGE SELECT =====
function populatePackageSelect() {
    const select = document.getElementById('packageSelect');
    packages.forEach(pkg => {
        const option = document.createElement('option');
        option.value = pkg.id;
        option.textContent = `${pkg.name} - $${pkg.price} (${pkg.duration})`;
        select.appendChild(option);
    });
}

// ===== UPDATE PACKAGE PRICE =====
function updatePackagePrice() {
    const packageId = document.getElementById('packageSelect').value;
    const numTourists = parseInt(document.getElementById('numTourists').value) || 1;
    
    if (!packageId) {
        document.getElementById('packagePrice').textContent = '$0';
        document.getElementById('totalPrice').textContent = '$0';
        return;
    }

    const pkg = packages.find(p => p.id == packageId);
    const packagePrice = pkg.price * numTourists;
    
    document.getElementById('packagePrice').textContent = `$${packagePrice}`;
    calculateTotal();
}

// ===== CALCULATE TOTAL PRICE =====
function calculateTotal() {
    let total = 0;

    // Package price
    const packagePrice = parseInt(document.getElementById('packagePrice').textContent.replace('$', '')) || 0;
    total += packagePrice;

    // Extras
    let extrasTotal = 0;
    document.querySelectorAll('input[name="extras"]:checked').forEach(checkbox => {
        if (checkbox.value === 'photography') extrasTotal += 80;
        if (checkbox.value === 'gourmet') extrasTotal += 120;
        if (checkbox.value === 'cultural') extrasTotal += 100;
        if (checkbox.value === 'night') extrasTotal += 150;
        if (checkbox.value === 'massage') extrasTotal += 90;
    });
    document.getElementById('extrasPrice').textContent = `$${extrasTotal}`;
    total += extrasTotal;

    // Hotel pickup
    let hotelPrice = 0;
    if (document.getElementById('hotelPickup').checked) {
        hotelPrice = 50;
    }
    document.getElementById('hotelPrice').textContent = `$${hotelPrice}`;
    total += hotelPrice;

    document.getElementById('totalPrice').textContent = `$${total}`;
}

// ===== SETUP PRICE CALCULATION LISTENERS =====
function setupPriceCalculation() {
    document.getElementById('hotelPickup').addEventListener('change', calculateTotal);
    document.querySelectorAll('input[name="extras"]').forEach(checkbox => {
        checkbox.addEventListener('change', calculateTotal);
    });
}

// ===== SUBMIT BOOKING =====
function submitBooking(event) {
    event.preventDefault();

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const payload = {
        package: document.getElementById('packageSelect').options[document.getElementById('packageSelect').selectedIndex].text,
        start_date: document.getElementById('startDate').value,
        end_date: document.getElementById('endDate').value,
        num_tourists: parseInt(document.getElementById('numTourists').value, 10) || 1,
        pickup_city: document.getElementById('pickupCity').value,
        visit_type: document.getElementById('visitType').value,
        hotel_pickup: document.getElementById('hotelPickup').checked,
        extras: Array.from(document.querySelectorAll('input[name="extras"]:checked')).map(cb => cb.value),
        full_name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        total_price: document.getElementById('totalPrice').textContent,
    };

    submitBtn.disabled = true;
    apiRequest('/bookings/', { method: 'POST', body: payload, auth: true })
        .then(() => {
            showNotification('🎉 Booking submitted! Our team will reach out to confirm details and payment.', 'success');
            event.target.reset();
            calculateTotal();
        })
        .catch((error) => {
            console.error('Booking submission failed:', error);
            showNotification('⚠️ Could not submit your booking. Please check your connection and try again.', 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
        });
}

// ===== RENDER GALLERY =====
function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';

    galleryImages.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${item.src}" alt="${item.title}">
            <div class="gallery-overlay">
                <i class="fas fa-search-plus"></i>
            </div>
        `;
        galleryItem.addEventListener('click', () => openLightbox(item));
        galleryGrid.appendChild(galleryItem);
    });
}

// ===== OPEN LIGHTBOX =====
function openLightbox(item) {
    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = item.src;
    img.style.cssText = `
        max-width: 90%;
        max-height: 80%;
        border-radius: 10px;
        box-shadow: 0 0 30px rgba(0,0,0,0.5);
    `;

    const title = document.createElement('p');
    title.textContent = item.title;
    title.style.cssText = `
        color: white;
        margin-top: 20px;
        font-size: 1.2rem;
        text-align: center;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        background: rgba(212, 163, 115, 0.8);
        border: none;
        color: white;
        font-size: 40px;
        cursor: pointer;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        transition: all 0.3s;
    `;

    closeBtn.addEventListener('click', () => lightbox.remove());
    closeBtn.addEventListener('mouseover', () => {
        closeBtn.style.background = 'rgba(212, 163, 115, 1)';
    });
    closeBtn.addEventListener('mouseout', () => {
        closeBtn.style.background = 'rgba(212, 163, 115, 0.8)';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.remove();
    });

    lightbox.appendChild(img);
    lightbox.appendChild(title);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
}

// ===== RENDER REVIEWS =====
function renderReviews() {
    const reviewsGrid = document.getElementById('reviewsGrid');
    reviewsGrid.innerHTML = '';

    reviews.forEach(review => {
        const stars = '★'.repeat(Math.floor(review.rating)) + '☆'.repeat(5 - Math.floor(review.rating));
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <div class="review-stars">${stars}</div>
            <p>"${review.text}"</p>
            <div class="review-author">- ${review.name}</div>
            <div class="review-location"><i class="fas fa-map-marker-alt"></i> ${review.location}</div>
        `;
        reviewsGrid.appendChild(reviewCard);
    });
}

// ===== SUBMIT CONTACT FORM =====
function submitContact(event) {
    event.preventDefault();

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const payload = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value,
    };

    submitBtn.disabled = true;
    apiRequest('/messages/', { method: 'POST', body: payload })
        .then(() => {
            showNotification('✉️ Message sent! Our team will contact you within 24 hours.', 'success');
            event.target.reset();
        })
        .catch((error) => {
            console.error('Contact submission failed:', error);
            showNotification('⚠️ Could not send your message. Please try again later.', 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
        });
}

// ===== SCROLL TO SECTION =====
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== SETUP MENU TOGGLE =====
function setupMenuToggle() {
    const toggleBtn = document.getElementById('toggleBtn');
    const navLinks = document.getElementById('navLinks');

    toggleBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// ===== SETUP ACCOUNT MODAL =====
function setupAccountModal() {
    const modal = document.getElementById('accountModal');
    const accountLink = document.querySelector('.account-link');

    accountLink.addEventListener('click', () => {
        modal.classList.add('active');
    });
}

// ===== CLOSE MODAL =====
function closeModal() {
    document.getElementById('accountModal').classList.remove('active');
}

// ===== SWITCH TABS =====
function switchTab(tabName, btnEl) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(`${tabName}Tab`).classList.add('active');
    if (btnEl) btnEl.classList.add('active');
}

// ===== SUBMIT LOGIN =====
function submitLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    apiRequest('/auth/login/', { method: 'POST', body: { username: email, password } })
        .then((tokens) => {
            setStoredAuth({ access: tokens.access, refresh: tokens.refresh, user: null });
            return apiRequest('/auth/me/', { auth: true });
        })
        .then((user) => {
            setStoredAuth({ ...getStoredAuth(), user });
            updateAuthUI();
            showNotification('🔓 Login successful! Welcome back to Safaris Best Choice Kenya!', 'success');
            event.target.reset();
            closeModal();
        })
        .catch((error) => {
            setStoredAuth(null);
            const message = error.status === 401 ? 'Incorrect email or password.' : error.message;
            showNotification(`⚠️ ${message}`, 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
        });
}

// ===== SUBMIT REGISTER =====
function submitRegister(event) {
    event.preventDefault();

    const fullName = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');

    if (password !== confirmPassword) {
        showNotification('⚠️ Passwords do not match.', 'error');
        return;
    }

    submitBtn.disabled = true;
    apiRequest('/auth/register/', { method: 'POST', body: { email, password, full_name: fullName } })
        .then((data) => {
            setStoredAuth({ access: data.access, refresh: data.refresh, user: data.user });
            updateAuthUI();
            showNotification('🎉 Account created successfully! Ready for your Kenya adventure?', 'success');
            event.target.reset();
            closeModal();
        })
        .catch((error) => {
            showNotification(`⚠️ ${error.message}`, 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
        });
}

// ===== AUTH STATE / ACCOUNT UI =====
function initAuthState() {
    const stored = getStoredAuth();
    if (stored && stored.access) {
        apiRequest('/auth/me/', { auth: true })
            .then((user) => {
                setStoredAuth({ ...stored, user });
                updateAuthUI();
            })
            .catch(() => {
                // Stored token is invalid/expired - drop it and show the logged-out state.
                setStoredAuth(null);
                updateAuthUI();
            });
    } else {
        updateAuthUI();
    }
}

function updateAuthUI() {
    const stored = getStoredAuth();
    const user = stored ? stored.user : null;
    const accountLink = document.querySelector('.account-link');
    const tabsHeader = document.querySelector('.account-tabs');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const modalContent = document.querySelector('#accountModal .modal-content');
    let loggedInPanel = document.getElementById('loggedInPanel');

    if (user) {
        accountLink.innerHTML = `<i class="fas fa-user-check"></i> ${user.first_name || 'My Account'}`;
        tabsHeader.style.display = 'none';
        loginTab.style.display = 'none';
        registerTab.style.display = 'none';

        if (!loggedInPanel) {
            loggedInPanel = document.createElement('div');
            loggedInPanel.id = 'loggedInPanel';
            modalContent.appendChild(loggedInPanel);
        }
        loggedInPanel.style.display = 'block';
        loggedInPanel.innerHTML = `
            <p>Welcome back, <strong>${user.first_name || user.email}</strong>!</p>
            <p>${user.email}</p>
            <button class="btn btn-primary" id="logoutBtn">Logout</button>
        `;
        document.getElementById('logoutBtn').addEventListener('click', () => {
            setStoredAuth(null);
            updateAuthUI();
        });

        // Prefill the booking form for signed-in guests
        const fullNameField = document.getElementById('fullName');
        const emailField = document.getElementById('email');
        if (fullNameField && !fullNameField.value) fullNameField.value = user.first_name || '';
        if (emailField && !emailField.value) emailField.value = user.email || '';
    } else {
        accountLink.innerHTML = `<i class="fas fa-user"></i> Account`;
        tabsHeader.style.display = 'flex';
        loginTab.style.display = '';
        registerTab.style.display = '';
        if (loggedInPanel) loggedInPanel.style.display = 'none';
    }
}

// ===== SHOW NOTIFICATION =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #c44536 0%, #a83526 100%)' : '#3498db'};
        color: white;
        padding: 20px 30px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===== SET MINIMUM DATE =====
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').setAttribute('min', today);
    document.getElementById('endDate').setAttribute('min', today);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ===== ADD ANIMATION KEYFRAMES =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes roar {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-5deg); }
        75% { transform: rotate(5deg); }
    }
`;
document.head.appendChild(style);