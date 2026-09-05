document.addEventListener('DOMContentLoaded', () => {
    const DB_PRODUCTS = [
        { id: 1, name: "DragXIT Lite", category: "Android", price: 20000, img: "lite.png", badge: "DPI Optimized", specs: "No Root" },
        { id: 2, name: "DragXIT Basic", category: "Android", price: 50000, img: "basic.png", badge: "Touch Tweaks", specs: "Stable" },
        { id: 3, name: "DragXIT Artic", category: "Android", price: 130000, img: "artic.png", badge: "HOT", specs: "High FPS" },
        { id: 4, name: "DragXIT Lunatic", category: "Android", price: 200000, img: "lunatic.png", badge: "PREMIUM", specs: "Pro Config" },
        { id: 5, name: "Lite", category: "iPhone", price: 50000, img: "lite2.png", badge: "Smooth", specs: "Safe" },
        { id: 6, name: "Pro", category: "iPhone", price: 100000, img: "pro.png", badge: "Fast Response", specs: "No Delay" },
        { id: 7, name: "Premium", category: "iPhone", price: 200000, img: "premium.png", badge: "HOT", specs: "Tournament" },
        { id: 8, name: "Max", category: "iPhone", price: 300000, img: "max.png", badge: "PREMIUM", specs: "Ultimate" },
        { id: 9, name: "Noctura", category: "App Panel", price: 50000, img: "sxr nocture.png", badge: "NEW", specs: "Minimalist" },
        { id: 10, name: "Matrix", category: "App Panel", price: 130000, img: "matrix.png", badge: "Secure", specs: "Encrypted" },
        { id: 11, name: "Void Panel", category: "App Panel", price: 240000, img: "void panel.png", badge: "HOT", specs: "Advanced" },
        { id: 12, name: "Shadow V2", category: "App Panel", price: 300000, img: "shadow v2.png", badge: "PREMIUM", specs: "Stealth" },
        { id: 13, name: "Ignite Panel", category: "App Panel", price: 420000, img: "ignite panel.png", badge: "PREMIUM", specs: "Flagship" }
    ];

    const gridEl = document.getElementById('product-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const modalEl = document.getElementById('modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const loaderEl = document.getElementById('loader');
    
    // Audio Context API & Haptic
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const playFeedback = () => {
        if (navigator.vibrate) navigator.vibrate(30);
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    };

    // Custom Pull-to-Refresh
    let ptrStartY = 0;
    const ptrEl = document.getElementById('ptr-container');
    document.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0) ptrStartY = e.touches[0].clientY;
    }, {passive: true});
    
    document.addEventListener('touchmove', (e) => {
        if (ptrStartY && window.scrollY === 0) {
            let dy = e.touches[0].clientY - ptrStartY;
            if (dy > 0) {
                if (dy > 80) dy = 80;
                ptrEl.style.height = dy + 'px';
                ptrEl.style.opacity = dy / 80;
            }
        }
    }, {passive: true});
    
    document.addEventListener('touchend', () => {
        if (ptrStartY) {
            if (parseInt(ptrEl.style.height) >= 60) {
                playFeedback();
                ptrEl.innerHTML = '<div class="loader-spinner" style="width:24px; height:24px; border-width:2px;"></div>';
                setTimeout(() => window.location.reload(), 600);
            } else {
                ptrEl.style.height = '0px';
                ptrEl.style.opacity = '0';
            }
            ptrStartY = 0;
        }
    });

    const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    const mapCategoryKey = (c) => c === "Android" ? "android" : c === "iPhone" ? "iphone" : c === "App Panel" ? "panel" : "all";

    const renderSkeletons = () => {
        if (!gridEl) return;
        gridEl.innerHTML = '';
        for(let i=0; i<6; i++) {
            gridEl.innerHTML += `
                <div class="card skeleton-card">
                    <div class="skeleton skeleton-img"></div>
                    <div class="skeleton skeleton-text" style="width:40%; margin-bottom:10px;"></div>
                    <div class="skeleton skeleton-text" style="width:80%; margin-bottom:15px; height:20px;"></div>
                    <div class="skeleton skeleton-text" style="width:50%; margin-bottom:20px; height:24px;"></div>
                    <div class="skeleton skeleton-btn"></div>
                </div>`;
        }
    };

    const renderProducts = (dataset) => {
        if (!gridEl) return;
        gridEl.innerHTML = '';
        if (dataset.length === 0) { gridEl.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">Produk tidak ditemukan.</p>`; return; }

        dataset.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card fade-anim';
            card.setAttribute('data-category', mapCategoryKey(item.category));
            card.innerHTML = `
                ${item.badge ? `<div class="card-badge">${item.badge}</div>` : ''}
                <div class="card-image-box">
                    <img src="${item.img}" alt="${item.name}" loading="lazy" onerror="this.onerror=null; this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';">
                </div>
                <div class="card-info">
                    <span class="card-cat">${item.category}</span>
                    <h3 class="card-title">${item.name}</h3>
                    <div class="card-specs"><span>${item.specs}</span></div>
                    <div class="card-price">${formatCurrency(item.price)}</div>
                    <button class="btn-primary ripple card-btn" data-id="${item.id}">Buy Now</button>
                </div>
            `;
            gridEl.appendChild(card);
        });
        
        document.querySelectorAll('.card-btn').forEach(btn => btn.addEventListener('click', (e) => {
            playFeedback(); openModal(parseInt(e.target.dataset.id));
        }));
        attachRippleEvents(gridEl);
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            playFeedback();
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const filterValue = e.target.dataset.filter;
            
            renderSkeletons();
            gridEl.scrollLeft = 0; 
            setTimeout(() => {
                const filtered = filterValue === 'all' ? DB_PRODUCTS : DB_PRODUCTS.filter(p => mapCategoryKey(p.category) === filterValue);
                renderProducts(filtered);
            }, 400);
        });
    });

    const openModal = (id) => {
        const product = DB_PRODUCTS.find(p => p.id === id);
        if (!product || !modalEl) return;
        document.getElementById('modal-img').src = product.img;
        document.getElementById('modal-name').textContent = product.name;
        document.getElementById('modal-cat').textContent = product.category;
        document.getElementById('modal-price').textContent = formatCurrency(product.price);

        const buyBtn = document.getElementById('modal-buy');
        const shareBtn = document.getElementById('modal-share');
        const qrisArea = document.getElementById('qris-area');
        const qrisImage = document.getElementById('qris-image');
        const qrisStatus = document.getElementById('qris-status');
        const qrisTimer = document.getElementById('qris-timer');

        buyBtn.style.display = 'flex'; qrisArea.style.display = 'none'; qrisImage.style.display = 'none';

        // Native Share Setup
        shareBtn.onclick = () => {
            playFeedback();
            if (navigator.share) {
                navigator.share({
                    title: product.name,
                    text: `Cek ${product.name} premium di SXR STORE!`,
                    url: window.location.href
                }).catch(console.error);
            } else {
                showToast("Share tidak didukung di browser ini.");
            }
        };

        buyBtn.onclick = () => {
            playFeedback();
            buyBtn.style.display = 'none'; 
            shareBtn.style.display = 'none';
            qrisArea.style.display = 'block'; 
            qrisImage.src = 'qris-asli.png'; 
            qrisImage.style.display = 'block';
            qrisStatus.textContent = 'Scan QRIS untuk membayar'; 
            qrisTimer.textContent = 'Mendukung BCA, OVO, Dana, dll.';

            let waBtn = document.getElementById('btn-konfirmasi-wa');
            if (!waBtn) {
                waBtn = document.createElement('button');
                waBtn.id = 'btn-konfirmasi-wa';
                waBtn.className = 'btn-primary ripple';
                waBtn.style.cssText = 'margin-top:20px; width:100%; background-color:#25D366; color:#fff; border:none;';
                waBtn.textContent = 'Kirim Bukti Pembayaran';
                qrisArea.appendChild(waBtn);
            }
            waBtn.onclick = () => { playFeedback(); window.open(`https://wa.me/628216553262?text=${encodeURIComponent(`Halo SXR, saya sudah transfer untuk pembelian produk *${product.name}* seharga *${formatCurrency(product.price)}*. Berikut lampiran bukti pembayarannya.`)}`, '_blank'); };
        };
        modalEl.classList.add('active'); document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        if(modalEl) { 
            const dialog = modalEl.querySelector('.modal-dialog');
            if (window.innerWidth <= 768 && dialog) {
                dialog.style.transform = 'translateY(100%)';
                setTimeout(() => { modalEl.classList.remove('active'); dialog.style.transform = ''; document.body.style.overflow = ''; }, 400); 
            } else { modalEl.classList.remove('active'); document.body.style.overflow = ''; }
        }
    };
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => { playFeedback(); closeModal(); });
    if (modalEl) modalEl.addEventListener('click', (e) => { if (e.target === modalEl || e.target.classList.contains('modal-dialog')) closeModal(); });

    window.showToast = (message) => {
        playFeedback();
        const area = document.getElementById('toast-area');
        if (!area) return;
        const toast = document.createElement('div');
        toast.className = 'toast dynamic-island';
        toast.textContent = message;
        area.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 500); }, 3000);
    };

    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => { playFeedback(); mobileMenu.classList.toggle('active'); });
        document.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', () => mobileMenu.classList.remove('active')));
    }

    const attachRippleEvents = (container = document) => {
        container.querySelectorAll('.ripple').forEach(btn => {
            if (btn.dataset.rippleAttached) return;
            btn.dataset.rippleAttached = 'true';
            btn.addEventListener('mousedown', function(e) {
                const rect = this.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.left = `${e.clientX - rect.left}px`; ripple.style.top = `${e.clientY - rect.top}px`;
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    };

    attachRippleEvents(document);

    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            playFeedback();
            const body = header.nextElementSibling;
            const isActive = header.classList.contains('active');
            document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.accordion-body').forEach(b => b.style.maxHeight = null);
            if (!isActive) {
                header.classList.add('active');
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });

    // Page Transition & Loader
    setTimeout(() => {
        if (loaderEl) {
            loaderEl.style.opacity = '0';
            setTimeout(() => {
                loaderEl.style.display = 'none';
                renderProducts(DB_PRODUCTS);
            }, 600);
        }
    }, 1500); 

    // Smooth Page exit transition
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', (e) => {
            if(link.target !== '_blank') {
                e.preventDefault();
                document.body.classList.add('fade-out');
                setTimeout(() => window.location = link.href, 400);
            }
        });
    });
});
