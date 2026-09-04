/*!
 * Copyright © 2026 SXR STORE
 * Unauthorized copying or redistribution is prohibited.
 */

document.addEventListener('DOMContentLoaded', () => {

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
    const fallbackImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

    const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    const mapCategoryKey = (cat) => cat === "Android" ? "android" : cat === "iPhone" ? "iphone" : cat === "App Panel" ? "panel" : "all";

    const renderProducts = (dataset) => {
        if (!gridEl) return;
        gridEl.innerHTML = '';
        if (dataset.length === 0) {
            gridEl.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 50px 0;">Produk tidak ditemukan.</p>`;
            return;
        }

        dataset.forEach(item => {
            const badgeHTML = item.badge ? `<div class="card-badge">${item.badge}</div>` : '';
            const card = document.createElement('div');
            card.className = 'card fade-anim';
            card.setAttribute('data-category', mapCategoryKey(item.category));
            card.innerHTML = `
                ${badgeHTML}
                <div class="card-image-box">
                    <img src="${item.img}" alt="${item.name}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImage}';">
                </div>
                <div class="card-info">
                    <span class="card-cat">${item.category}</span>
                    <h3 class="card-title">${item.name}</h3>
                    <div class="card-price">${formatCurrency(item.price)}</div>
                    <button class="btn-primary card-btn" data-id="${item.id}">Buy Now</button>
                </div>
            `;
            gridEl.appendChild(card);
        });
        
        document.querySelectorAll('.card-btn').forEach(btn => {
            btn.addEventListener('click', (e) => openModal(parseInt(e.target.dataset.id)));
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const filterValue = e.target.dataset.filter;
            
            document.querySelectorAll('.card').forEach(card => {
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
        const qrisImage = document.getElementById('qris-image');
        const qrisStatus = document.getElementById('qris-status');
        const qrisTimer = document.getElementById('qris-timer');

        buyBtn.style.display = 'flex';
        qrisArea.style.display = 'none';
        qrisImage.style.display = 'none';

        buyBtn.onclick = () => {
            buyBtn.style.display = 'none';
            qrisArea.style.display = 'block';
            
            qrisImage.src = 'qris-asli.png';
            qrisImage.style.display = 'block';
            
            qrisStatus.textContent = 'Scan QRIS untuk membayar';
            qrisTimer.textContent = 'Mendukung BCA, OVO, Dana, GoPay, Spay, dll.';

            let waBtn = document.getElementById('btn-konfirmasi-wa');
            if (!waBtn) {
                waBtn = document.createElement('button');
                waBtn.id = 'btn-konfirmasi-wa';
                waBtn.className = 'btn-primary';
                waBtn.style.marginTop = '20px';
                waBtn.style.backgroundColor = '#25D366';
                waBtn.style.color = '#fff';
                waBtn.textContent = 'Kirim Bukti Pembayaran';
                qrisArea.appendChild(waBtn);
            }

            const nomorWA = "628216553262"; 
            const teksPesan = `Halo SXR, saya sudah transfer untuk pembelian produk *${product.name}* seharga *${formatCurrency(product.price)}*. Berikut lampiran bukti pembayarannya.`;
            
            waBtn.onclick = () => {
                window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(teksPesan)}`, '_blank');
            };
        };

        modalEl.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        if(modalEl) { 
            const modalContent = modalEl.querySelector('.modal-content');
            if (window.innerWidth <= 768 && modalContent) {
                modalContent.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    modalEl.classList.remove('active'); 
                    modalContent.style.transform = ''; 
                    document.body.style.overflow = ''; 
                }, 350); 
            } else {
                modalEl.classList.remove('active'); 
                document.body.style.overflow = ''; 
            }
        }
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalEl) modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeModal(); });

    renderProducts(DB_PRODUCTS);
});
