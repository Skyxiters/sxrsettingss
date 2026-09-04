/*!
 * Copyright © 2026 SXR STORE
 * Unauthorized copying or redistribution is prohibited.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- DATA PRODUK ---
    const DB_PRODUCTS = [
        { id: 1, name: "DragXIT Lite", category: "Android", price: 20000, img: "lite.png", badge: "" },
        { id: 2, name: "DragXIT Basic", category: "Android", price: 50000, img: "basic.png", badge: "" },
        { id: 3, name: "DragXIT Artic", category: "Android", price: 130000, img: "artic.png", badge: "HOT" },
        { id: 4, name: "DragXIT Lunatic", category: "Android", price: 200000, img: "lunatic.png", badge: "PREMIUM" },
        { id: 5, name: "Lite", category: "iPhone", price: 50000, img: "lite2.png", badge: "" },
        { id: 6, name: "Pro", category: "iPhone", price: 100000, img: "pro.png", badge: "" },
        { id: 7, name: "Premium", category: "iPhone", price: 200000, img: "premium.png", badge: "HOT" },
        { id: 8, name: "Max", category: "iPhone", price: 300000, img: "max.png", badge: "PREMIUM" },
        { id: 9, name: "Noctura", category: "App Panel", price: 50000, img: "sxr nocture.png", badge: "NEW" },
        { id: 10, name: "Matrix", category: "App Panel", price: 130000, img: "matrix.png", badge: "" },
        { id: 11, name: "Void Panel", category: "App Panel", price: 240000, img: "void panel.png", badge: "HOT" },
        { id: 12, name: "Shadow V2", category: "App Panel", price: 300000, img: "shadow v2.png", badge: "PREMIUM" },
        { id: 13, name: "Ignite Panel", category: "App Panel", price: 420000, img: "ignite panel.png", badge: "PREMIUM" }
    ];

    const gridEl = document.getElementById('product-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const modalEl = document.getElementById('modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const navEl = document.getElementById('navbar');
    const scrollProgEl = document.getElementById('scroll-progress');
    const btnTopEl = document.getElementById('btn-top');
    const loaderEl = document.getElementById('loader');
    const btnLogin = document.getElementById('btn-login');
    const btnCart = document.getElementById('btn-cart');
    
    const fallbackImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const mapCategoryKey = (dbCategory) => {
        if (dbCategory === "Android") return "android";
        if (dbCategory === "iPhone") return "iphone";
        if (dbCategory === "App Panel") return "panel";
        return "all";
    };

    // --- SPIDER WEB CANVAS ---
    const initCanvas = () => {
        const canvas = document.getElementById('spider-canvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let particles = [];
        let mouse = { x: null, y: null, radius: 140 };

        window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
        window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
        window.addEventListener('resize', () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; });

        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * width, y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() > 0.8 ? 1.5 : 0.8, isRed: Math.random() > 0.85 
            });
        }

        const animateCanvas = () => {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.x += p.vx; p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - p.x; let dy = mouse.y - p.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const forceDirectionX = dx / dist; const forceDirectionY = dy / dist;
                        const force = (mouse.radius - dist) / mouse.radius;
                        p.x -= forceDirectionX * force * 1.5; p.y -= forceDirectionY * force * 1.5;
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.isRed ? 'rgba(229, 9, 20, 0.7)' : 'rgba(255, 255, 255, 0.3)';
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    let p2 = particles[j];
                    let dx = p.x - p2.x; let dy = p.y - p2.y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 - dist/1200})`; 
                        ctx.lineWidth = 0.6; ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                    }
                }
                if (mouse.x != null && mouse.y != null) {
                    let dx = p.x - mouse.x; let dy = p.y - mouse.y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(229, 9, 20, ${0.2 - dist/1300})`; 
                        ctx.lineWidth = 0.8; ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        };
        animateCanvas();
    };

    // --- RENDER & FILTER ---
    const renderProducts = (dataset) => {
        if (!gridEl) return;
        gridEl.innerHTML = '';
        if (dataset.length === 0) {
            gridEl.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted); padding: 50px 0;">Produk tidak ditemukan.</p>`;
            return;
        }

        dataset.forEach(item => {
            const badgeHTML = item.badge ? `<div class="card-badge">${item.badge}</div>` : '';
            const card = document.createElement('div');
            card.className = 'card reveal visible fade-anim';
            card.setAttribute('data-category', mapCategoryKey(item.category));
            card.style.display = 'flex'; 

            card.innerHTML = `
                ${badgeHTML}
                <div class="card-image-box">
                    <img src="${item.img}" alt="${item.name}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImage}';">
                </div>
                <div class="card-info">
                    <span class="card-cat">${item.category}</span>
                    <h3 class="card-title">${item.name}</h3>
                    <div class="card-price">${formatCurrency(item.price)}</div>
                    <button class="btn-primary ripple glow-btn card-btn" data-id="${item.id}">Buy Now</button>
                </div>
            `;
            gridEl.appendChild(card);
        });
        
        attachCardEvents();
        attachRippleEvents(gridEl);
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const filterValue = e.target.dataset.filter;

            if (searchInput && searchInput.value.trim() !== '') {
                searchInput.value = '';
                if(searchResults) searchResults.style.display = 'none';
                renderProducts(DB_PRODUCTS); 
            }
            
            document.querySelectorAll('.product-grid .card').forEach(card => {
                card.classList.remove('fade-anim');
                if (filterValue === 'all' || card.dataset.category === filterValue) {
                    card.style.display = 'flex'; 
                    void card.offsetWidth; 
                    card.classList.add('fade-anim');
                } else {
                    card.style.display = 'none'; 
                }
            });
        });
    });

    // --- SEARCH LOGIC ---
    if (searchInput && searchResults) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            searchResults.innerHTML = '';
            
            if (query.length > 0) {
                const matches = DB_PRODUCTS.filter(p => p.name.toLowerCase().includes(query));
                if (matches.length > 0) {
                    searchResults.style.display = 'flex';
                    matches.slice(0, 5).forEach(match => {
                        const div = document.createElement('div');
                        div.className = 'search-item';
                        div.textContent = `${match.name} - ${match.category}`;
                        div.addEventListener('click', () => {
                            searchInput.value = match.name;
                            searchResults.style.display = 'none';
                            filterBtns.forEach(b => b.classList.remove('active'));
                            document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
                            renderProducts([match]);
                        });
                        searchResults.appendChild(div);
                    });
                } else {
                    searchResults.style.display = 'none';
                }
                
                filterBtns.forEach(b => b.classList.remove('active'));
                document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
                renderProducts(matches);
            } else {
                searchResults.style.display = 'none';
                renderProducts(DB_PRODUCTS);
            }
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrapper')) searchResults.style.display = 'none';
        });
    }

    // --- MODAL & QRIS INTEGRATION LOGIC ---
    let pollingInterval;

    const attachCardEvents = () => {
        document.querySelectorAll('.card-btn').forEach(btn => {
            btn.addEventListener('click', (e) => openModal(parseInt(e.target.dataset.id)));
        });
    };

    const openModal = (id) => {
        const product = DB_PRODUCTS.find(p => p.id === id);
        if (!product || !modalEl) return;

        document.getElementById('modal-img').src = product.img;
        document.getElementById('modal-img').onerror = function() { this.src = fallbackImage; };
        document.getElementById('modal-name').textContent = product.name;
        document.getElementById('modal-cat').textContent = product.category;
        document.getElementById('modal-price').textContent = formatCurrency(product.price);

        const buyBtn = document.getElementById('modal-buy');
        const qrisArea = document.getElementById('qris-area');
        const qrisLoader = document.getElementById('qris-loader');
        const qrisImage = document.getElementById('qris-image');
        const qrisStatus = document.getElementById('qris-status');
        const qrisTimer = document.getElementById('qris-timer');

        // Reset state modal saat dibuka
        buyBtn.style.display = 'flex';
        qrisArea.style.display = 'none';
        qrisImage.style.display = 'none';

        // Proses klik tombol bayar
        buyBtn.onclick = async () => {
            buyBtn.style.display = 'none';
            qrisArea.style.display = 'block';
            qrisLoader.style.display = 'block';
            qrisStatus.textContent = 'Membuat QR Code...';
            qrisStatus.style.color = '#ffcc00';
            qrisTimer.textContent = '';

            try {
                // Tembak API Backend C# .NET milikmu di sini
                /*
                const response = await fetch('https://api.sxrstore.com/create-qris', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: product.id, amount: product.price })
                });
                const data = await response.json();
                */

                // Simulasi memanggil API (Hapus ini jika API C# sudah siap)
                await new Promise(r => setTimeout(r, 1500));
                
                // Data simulasi balasan dari server
                const data = { 
                    qrUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg', 
                    invoiceId: 'INV-' + Math.floor(Math.random() * 100000)
                };

                // Tampilkan QR Code di layar
                qrisLoader.style.display = 'none';
                qrisImage.src = data.qrUrl;
                qrisImage.style.display = 'block';
                qrisStatus.textContent = 'Menunggu Pembayaran...';
                qrisTimer.textContent = 'Scan menggunakan BCA, OVO, Dana, GoPay, dll.';

                // Jalankan fungsi polling untuk mengecek apakah user sudah bayar
                checkPaymentStatus(data.invoiceId, product.name);

            } catch (error) {
                qrisLoader.style.display = 'none';
                qrisStatus.textContent = 'Gagal memuat QRIS. Coba lagi nanti.';
                qrisStatus.style.color = 'var(--color-primary)';
                buyBtn.style.display = 'flex';
                buyBtn.textContent = 'Coba Lagi';
            }
        };

        modalEl.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Fungsi Polling untuk mengecek status pembayaran ke backend secara berkala
    const checkPaymentStatus = (invoiceId, productName) => {
        clearInterval(pollingInterval);
        let attempts = 0;
        
        pollingInterval = setInterval(async () => {
            attempts++;
            if(attempts > 60) { // Timeout setelah 3 menit (60 * 3 detik)
                clearInterval(pollingInterval);
                document.getElementById('qris-status').textContent = 'Waktu pembayaran habis.';
                document.getElementById('qris-status').style.color = 'var(--color-primary)';
                return;
            }

            // Tembak endpoint C# untuk cek status ke database
            /*
            const res = await fetch(`https://api.sxrstore.com/check-status/${invoiceId}`);
            const statusData = await res.json();
            let isPaid = statusData.isPaid;
            */

            // Simulasi pembayaran sukses pada detik ke-9 (Hapus baris ini nanti)
            let isPaid = (attempts === 3); 

            if (isPaid) {
                clearInterval(pollingInterval);
                document.getElementById('qris-image').style.display = 'none';
                document.getElementById('qris-timer').style.display = 'none';
                document.getElementById('qris-status').textContent = '✅ Pembayaran Berhasil!';
                document.getElementById('qris-status').style.color = '#00ff88';
                
                showToast(`Pembayaran ${productName} berhasil! Menyiapkan produk...`);
                
                // Redirect ke halaman download atau area eksekusi produk
                setTimeout(() => {
                    // window.location.href = `/download.html?invoice=${invoiceId}`;
                    showToast("Simulasi selesai. Di sini user diarahkan ke link download.");
                }, 2000);
            }
        }, 3000); // Mengecek ke server setiap 3 detik
    };

    const closeModal = () => {
        if(modalEl) { 
            modalEl.classList.remove('active'); 
            document.body.style.overflow = ''; 
            clearInterval(pollingInterval); // Hentikan pengecekan jika modal ditutup
        }
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalEl) modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeModal(); });

    // --- OTHER UI LOGIC ---
    const closeLiveBtn = document.getElementById('close-live');
    if (closeLiveBtn) closeLiveBtn.addEventListener('click', () => { document.getElementById('live-panel').style.display = 'none'; });

    if (btnLogin) btnLogin.addEventListener('click', () => showToast("Login fitur segera hadir."));
    if (btnCart) btnCart.addEventListener('click', () => showToast("Cart fitur segera hadir."));

    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('active'));
        document.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', () => mobileMenu.classList.remove('active')));
    }

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (navEl) { scrollY > 50 ? navEl.classList.add('scrolled') : navEl.classList.remove('scrolled'); }
        if (scrollProgEl) {
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            scrollProgEl.style.width = ((scrollY / docHeight) * 100) + '%';
        }
        if (btnTopEl) { scrollY > 500 ? btnTopEl.classList.add('active') : btnTopEl.classList.remove('active'); }
    });
    if (btnTopEl) btnTopEl.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const attachRippleEvents = (container = document) => {
        container.querySelectorAll('.ripple').forEach(btn => {
            if (btn.dataset.rippleAttached) return;
            btn.dataset.rippleAttached = 'true';
            btn.addEventListener('mousedown', function(e) {
                const rect = this.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.left = `${e.clientX - rect.left}px`;
                ripple.style.top = `${e.clientY - rect.top}px`;
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
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

    window.showToast = (message) => {
        const area = document.getElementById('toast-area');
        if (!area) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        area.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
    };

    /* ==========================================================================
       SECURITY & PROTECTION MODULE
       ========================================================================== */
       
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
        }
        if (e.ctrlKey) {
            const key = e.key.toLowerCase();
            if (key === 'u' || key === 's') {
                e.preventDefault();
            }
            if (e.shiftKey && (key === 'i' || key === 'c' || key === 'j')) {
                e.preventDefault();
            }
        }
    });

    const detectDevTools = () => {
        const threshold = 160; 
        const widthDiff = window.outerWidth - window.innerWidth > threshold;
        const heightDiff = window.outerHeight - window.innerHeight > threshold;

        if (widthDiff || heightDiff) {
            document.body.style.filter = 'blur(20px)';
            
            if (!document.getElementById('dev-warning')) {
                const warningBox = document.createElement('div');
                warningBox.id = 'dev-warning';
                warningBox.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(229,9,20,0.95); color:#fff; padding:30px 40px; border-radius:15px; font-weight:800; z-index:999999; text-align:center; font-size:1.2rem; box-shadow:0 20px 50px rgba(0,0,0,0.8); pointer-events:auto; font-family:"Inter", sans-serif; letter-spacing:0.5px;';
                warningBox.innerHTML = '⚠️ PERINGATAN KEAMANAN<br><span style="font-size:0.9rem; font-weight:500; display:block; margin-top:10px;">Harap tutup Panel Developer untuk melanjutkan akses.</span>';
                document.documentElement.appendChild(warningBox);
            }
        } else {
            document.body.style.filter = 'none';
            const warningBox = document.getElementById('dev-warning');
            if (warningBox) warningBox.remove();
        }
    };

    window.addEventListener('resize', detectDevTools);
    setInterval(detectDevTools, 1500);

    // --- INITIALIZATION ---
    initCanvas(); 
    attachRippleEvents(document);

    setTimeout(() => {
        if (loaderEl) {
            loaderEl.style.opacity = '0';
            setTimeout(() => {
                loaderEl.style.display = 'none';
                renderProducts(DB_PRODUCTS);
                showToast("Welcome to SXR STORE Premium");
            }, 600);
        }
    }, 1500); 

});