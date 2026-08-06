/* GLOBAL STATE (ĐÃ SỬA LỖI MẶC ĐỊNH NULL ĐỂ HIỂN THỊ NÚT ĐĂNG NHẬP) */
let state = {
  lang: 'VI',
  currency: 'VND',
  currentUser: JSON.parse(localStorage.getItem('aura_user')) || null, // Mặc định là null cho khách chưa đăng nhập
  cart: [],
  selectedProductId: null,
  selectedColor: null,
  selectedSize: null,
  appliedVoucher: null,
  shippingFeeVND: 25000,
  orders: JSON.parse(localStorage.getItem('aura_orders')) || [
    {
      id: 'ORD-9901',
      customer: 'Minh Anh (0988123456)',
      totalVND: 2475000,
      totalUSD: 99,
      currency: 'VND',
      payment: 'COD',
      shippingProvider: 'GHN Express',
      status: 'PROCESSING'
    }
  ]
};

/* BANNER COPY VOUCHER */
function copyVoucher(code) {
  document.getElementById('voucher-input').value = code;
  applyVoucher();
  toggleCartDrawer(true);
}

/* AUTH & LOYALTY UI MANAGEMENT */
function renderUserAuthUI() {
  const container = document.getElementById('user-auth-section');
  if (!container) return;

  // Nếu ĐÃ đăng nhập -> Hiển thị Badge thông tin + Điểm tích lũy + Nút Đăng xuất
  if (state.currentUser) {
    let tier = 'BRONZE (Bạc)';
    if (state.currentUser.points >= 500) tier = 'DIAMOND (Kim Cương)';
    else if (state.currentUser.points >= 200) tier = 'GOLD (Vàng)';

    container.innerHTML = `
      <div class="flex items-center gap-2">
        <div onclick="toggleLoyaltyModal(true)" class="cursor-pointer flex items-center gap-2 bg-stone-100 py-1 px-3 rounded-full border border-stone-200 hover:bg-stone-200 transition">
          <i data-lucide="award" class="w-4 h-4 text-amber-600"></i>
          <div>
            <p class="text-[10px] font-bold text-stone-900">${state.currentUser.name}</p>
            <p class="text-[9px] text-amber-700 font-semibold">${tier} • ${state.currentUser.points}đ</p>
          </div>
        </div>
        <button onclick="handleLogout()" class="p-1.5 text-stone-400 hover:text-rose-600 transition" title="Đăng xuất">
          <i data-lucide="log-out" class="w-4 h-4"></i>
        </button>
      </div>
    `;
  } 
  // Nếu CHƯA đăng nhập -> Hiển thị Nút Đăng nhập nổi bật
  else {
    container.innerHTML = `
      <button onclick="toggleAuthModal(true)" class="flex items-center gap-1.5 bg-stone-900 text-white px-3.5 py-1.5 rounded-full hover:bg-stone-800 transition shadow-sm">
        <i data-lucide="user" class="w-3.5 h-3.5"></i> <span>Đăng Nhập</span>
      </button>
    `;
  }
  lucide.createIcons();
}

function toggleLoyaltyModal(open) {
  const modal = document.getElementById('loyalty-modal');
  if (open) {
    renderLoyaltyProgressUI();
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
}

function renderLoyaltyProgressUI() {
  const progressBox = document.getElementById('loyalty-user-progress');
  if (state.currentUser) {
    const points = state.currentUser.points;
    let nextTier = 'GOLD (Vàng)';
    let targetPoints = 200;
    let tierName = 'BRONZE (Bạc)';

    if (points >= 500) {
      nextTier = 'DIAMOND Max';
      targetPoints = 500;
      tierName = 'DIAMOND (Kim Cương)';
    } else if (points >= 200) {
      nextTier = 'DIAMOND (Kim Cương)';
      targetPoints = 500;
      tierName = 'GOLD (Vàng)';
    }

    const percent = Math.min(100, Math.floor((points / targetPoints) * 100));

    progressBox.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <div>
          <p class="text-xs text-stone-400">Tài khoản: <strong>${state.currentUser.name}</strong></p>
          <h4 class="text-base font-bold text-amber-400">Hạng Hiện Tại: ${tierName}</h4>
        </div>
        <span class="text-xl font-bold">${points} <span class="text-xs font-normal text-stone-400">Điểm</span></span>
      </div>
      <div class="w-full bg-stone-700 h-2.5 rounded-full overflow-hidden mb-2">
        <div class="bg-amber-400 h-full rounded-full transition-all duration-500" style="width: ${percent}%"></div>
      </div>
      <p class="text-[10px] text-stone-300">Cần thêm ${Math.max(0, targetPoints - points)} điểm nữa để thăng hạng <strong>${nextTier}</strong></p>
    `;
  } else {
    progressBox.innerHTML = `
      <p class="text-xs text-stone-300 text-center">Vui lòng <button onclick="toggleLoyaltyModal(false); toggleAuthModal(true)" class="underline text-amber-400 font-bold">Đăng nhập</button> để theo dõi hạng thành viên & điểm tích lũy.</p>
    `;
  }
}

function toggleAuthModal(open) {
  document.getElementById('auth-modal').classList.toggle('hidden', !open);
}

function switchAuthMethod(method) {
  document.getElementById('auth-tab-phone').className = method === 'phone' ? "w-1/2 pb-2 text-xs font-bold border-b-2 border-stone-900 text-stone-900" : "w-1/2 pb-2 text-xs font-bold border-b-2 border-transparent text-stone-400";
  document.getElementById('auth-tab-email').className = method === 'email' ? "w-1/2 pb-2 text-xs font-bold border-b-2 border-stone-900 text-stone-900" : "w-1/2 pb-2 text-xs font-bold border-b-2 border-transparent text-stone-400";
  document.getElementById('auth-form-phone').classList.toggle('hidden', method !== 'phone');
  document.getElementById('auth-form-email').classList.toggle('hidden', method !== 'email');
}

function handleLogin(e, type) {
  e.preventDefault();
  const userName = type === 'email' ? document.getElementById('login-email').value.split('@')[0] : `User ${document.getElementById('login-phone').value.slice(-4)}`;
  state.currentUser = { name: userName, points: 150 };
  localStorage.setItem('aura_user', JSON.stringify(state.currentUser));
  renderUserAuthUI();
  toggleAuthModal(false);
  alert(`Xin chào ${userName}! Bạn đã đăng nhập thành công.`);
}

function handleSocialLogin(provider) {
  state.currentUser = { name: `${provider} User`, points: 250 };
  localStorage.setItem('aura_user', JSON.stringify(state.currentUser));
  renderUserAuthUI();
  toggleAuthModal(false);
  alert(`Đăng nhập bằng ${provider} thành công!`);
}

function handleLogout() {
  state.currentUser = null;
  localStorage.removeItem('aura_user');
  renderUserAuthUI();
  alert("Bạn đã đăng xuất khỏi hệ thống!");
}

/* SEARCH & FILTER LOGIC */
function handleSearchAndFilter() {
  const search = document.getElementById('search-input').value.toLowerCase();
  const cat = document.getElementById('category-filter').value;
  const sort = document.getElementById('sort-filter').value;

  let filtered = PRODUCTS_DATA.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search);
    const matchCat = cat === 'ALL' || p.category === cat;
    return matchSearch && matchCat;
  });

  if (sort === 'PRICE_ASC') filtered.sort((a, b) => a.priceVND - b.priceVND);
  if (sort === 'PRICE_DESC') filtered.sort((a, b) => b.priceVND - a.priceVND);

  document.getElementById('product-count').innerText = `Hiển thị ${filtered.length} sản phẩm`;
  renderProducts(filtered);
}

/* GENERAL HELPERS & RENDER */
function formatPrice(amountVND, amountUSD) {
  return state.currency === 'USD' ? `$${amountUSD.toFixed(2)}` : `${amountVND.toLocaleString('vi-VN')} ₫`;
}

function setLanguage(lang) {
  state.lang = lang;
  document.getElementById('lang-vi').className = lang === 'VI' ? "px-2.5 py-1 rounded-full bg-white text-black shadow-sm transition" : "px-2.5 py-1 rounded-full text-stone-500 hover:text-black transition";
  document.getElementById('lang-en').className = lang === 'EN' ? "px-2.5 py-1 rounded-full bg-white text-black shadow-sm transition" : "px-2.5 py-1 rounded-full text-stone-500 hover:text-black transition";
  
  document.getElementById('t-nav-admin').innerText = I18N[lang].adminNav;
  document.getElementById('t-hero-sub').innerText = I18N[lang].heroSub;
  document.getElementById('t-catalog-title').innerText = I18N[lang].catalogTitle;
  document.getElementById('t-cart-title').innerText = I18N[lang].cartTitle;
  document.getElementById('t-label-color').innerText = I18N[lang].colorLabel;
  document.getElementById('t-label-size').innerText = I18N[lang].sizeLabel;
  document.getElementById('t-label-stock').innerText = I18N[lang].stockLabel;
  document.getElementById('t-label-city').innerText = I18N[lang].cityLabel;

  renderProducts();
  renderCart();
}

function setCurrency(curr) {
  state.currency = curr;
  document.getElementById('curr-vnd').className = curr === 'VND' ? "px-2.5 py-1 rounded-full bg-white text-black shadow-sm transition" : "px-2.5 py-1 rounded-full text-stone-500 hover:text-black transition";
  document.getElementById('curr-usd').className = curr === 'USD' ? "px-2.5 py-1 rounded-full bg-white text-black shadow-sm transition" : "px-2.5 py-1 rounded-full text-stone-500 hover:text-black transition";
  renderProducts();
  renderCart();
  renderAdminDashboard();
}

function switchTab(tabName) {
  const tabStore = document.getElementById('tab-storefront');
  const tabAdmin = document.getElementById('tab-admin');
  const navShop = document.getElementById('nav-shop-btn');
  const navAdmin = document.getElementById('nav-admin-btn');

  if (tabName === 'admin') {
    tabStore.classList.add('hidden');
    tabAdmin.classList.remove('hidden');
    navShop.className = "hover:text-black transition text-stone-400";
    navAdmin.className = "hover:text-black transition flex items-center gap-1.5 text-black font-semibold";
    renderAdminDashboard();
  } else {
    tabAdmin.classList.add('hidden');
    tabStore.classList.remove('hidden');
    navShop.className = "hover:text-black transition text-black font-semibold";
    navAdmin.className = "hover:text-black transition flex items-center gap-1.5 text-stone-400";
  }
}

function renderProducts(list = PRODUCTS_DATA) {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = list.map(p => `
    <div onclick="openProductModal(${p.id})" class="group cursor-pointer bg-white rounded-2xl p-4 border border-stone-200/80 hover:border-stone-400 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div class="aspect-[4/5] overflow-hidden rounded-xl bg-stone-100 mb-4 relative">
          <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
          <span class="absolute top-3 right-3 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm uppercase">${p.category}</span>
        </div>
        <h3 class="font-bold text-sm text-stone-900 group-hover:text-stone-600 transition">${p.name}</h3>
      </div>
      <p class="text-xs font-semibold text-stone-500 mt-2">${formatPrice(p.priceVND, p.priceUSD)}</p>
    </div>
  `).join('');
}

function openProductModal(productId) {
  const p = PRODUCTS_DATA.find(x => x.id === productId);
  state.selectedProductId = productId;
  state.selectedColor = p.colors[0];
  state.selectedSize = p.sizes[0];

  document.getElementById('modal-title').innerText = p.name;
  document.getElementById('modal-category').innerText = p.category;
  document.getElementById('modal-price').innerText = formatPrice(p.priceVND, p.priceUSD);
  document.getElementById('modal-desc').innerText = p.desc;
  document.getElementById('modal-img').src = p.image;

  renderVariantSelectors(p);
  updateStockCountUI(p);
  document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.add('hidden');
}

function renderVariantSelectors(p) {
  document.getElementById('modal-colors').innerHTML = p.colors.map(c => `
    <button onclick="selectColor('${c}')" class="px-3 py-1.5 border text-xs font-semibold rounded-lg transition ${state.selectedColor === c ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 hover:border-stone-900'}">${c}</button>
  `).join('');

  document.getElementById('modal-sizes').innerHTML = p.sizes.map(s => `
    <button onclick="selectSize('${s}')" class="px-3 py-1.5 border text-xs font-semibold rounded-lg transition ${state.selectedSize === s ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 hover:border-stone-900'}">${s}</button>
  `).join('');
}

function selectColor(c) {
  state.selectedColor = c;
  const p = PRODUCTS_DATA.find(x => x.id === state.selectedProductId);
  renderVariantSelectors(p);
  updateStockCountUI(p);
}

function selectSize(s) {
  state.selectedSize = s;
  const p = PRODUCTS_DATA.find(x => x.id === state.selectedProductId);
  renderVariantSelectors(p);
  updateStockCountUI(p);
}

function updateStockCountUI(p) {
  const variant = p.variants.find(v => v.color === state.selectedColor && v.size === state.selectedSize);
  const stockEl = document.getElementById('modal-stock-count');
  const addBtn = document.getElementById('add-to-cart-btn');

  if (variant && variant.stock > 0) {
    stockEl.innerText = `${variant.stock} sản phẩm trong kho (SKU: ${variant.sku})`;
    stockEl.className = "font-bold text-emerald-600";
    addBtn.disabled = false;
    addBtn.innerText = "THÊM VÀO GIỎ HÀNG";
    addBtn.className = "mt-6 w-full py-3 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-stone-800 transition";
  } else {
    stockEl.innerText = "Tạm Hết Hàng Biến Thể Này!";
    stockEl.className = "font-bold text-rose-600";
    addBtn.disabled = true;
    addBtn.innerText = "HẾT HÀNG";
    addBtn.className = "mt-6 w-full py-3 bg-stone-300 text-stone-500 text-xs font-bold uppercase tracking-widest rounded-xl cursor-not-allowed";
  }
}

/* CART & CHECKOUT LOGIC */
function addCurrentVariantToCart() {
  const p = PRODUCTS_DATA.find(x => x.id === state.selectedProductId);
  const variant = p.variants.find(v => v.color === state.selectedColor && v.size === state.selectedSize);
  if (!variant || variant.stock <= 0) return;

  const existingIndex = state.cart.findIndex(item => item.sku === variant.sku);
  if (existingIndex > -1) {
    if (state.cart[existingIndex].qty + 1 > variant.stock) {
      alert("Số lượng vượt quá tồn kho khả dụng!");
      return;
    }
    state.cart[existingIndex].qty += 1;
  } else {
    state.cart.push({ sku: variant.sku, name: p.name, color: variant.color, size: variant.size, priceVND: p.priceVND, priceUSD: p.priceUSD, qty: 1, image: p.image });
  }

  closeProductModal();
  renderCart();
  toggleCartDrawer(true);
}

function toggleCartDrawer(open) {
  document.getElementById('cart-drawer').classList.toggle('hidden', !open);
}

function updateCartQty(sku, change) {
  const item = state.cart.find(x => x.sku === sku);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) state.cart = state.cart.filter(x => x.sku !== sku);
  renderCart();
}

function calculateShippingFee() {
  const city = document.getElementById('shipping-city-select').value;
  if (city === 'HCM') state.shippingFeeVND = 25000;
  else if (city === 'HN') state.shippingFeeVND = 35000;
  else state.shippingFeeVND = 45000;
  renderCart();
}

function applyVoucher() {
  const code = document.getElementById('voucher-input').value.trim().toUpperCase();
  if (VOUCHERS[code]) {
    state.appliedVoucher = { code, discountValue: VOUCHERS[code] };
    alert(`Đã áp dụng mã giảm giá ${code} thành công!`);
  } else {
    alert("Mã giảm giá không hợp lệ!");
    state.appliedVoucher = null;
  }
  renderCart();
}

function renderCart() {
  const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cart-badge').innerText = totalCount;

  const container = document.getElementById('cart-items-container');
  if (state.cart.length === 0) {
    container.innerHTML = `<p class="text-xs text-stone-400 text-center py-12">Giỏ hàng của bạn đang trống.</p>`;
  } else {
    container.innerHTML = state.cart.map(item => `
      <div class="py-4 flex gap-4 items-center">
        <img src="${item.image}" class="w-16 h-20 object-cover rounded-lg bg-stone-100">
        <div class="flex-grow">
          <h4 class="font-bold text-xs">${item.name}</h4>
          <p class="text-[11px] text-stone-500 mt-0.5">Phân loại: ${item.color} / ${item.size}</p>
          <p class="text-xs font-bold text-stone-900 mt-1">${formatPrice(item.priceVND, item.priceUSD)}</p>
          <div class="flex items-center gap-2 mt-2">
            <button onclick="updateCartQty('${item.sku}', -1)" class="w-5 h-5 bg-stone-100 border border-stone-300 rounded flex items-center justify-center text-xs hover:bg-stone-200">-</button>
            <span class="text-xs font-bold px-1">${item.qty}</span>
            <button onclick="updateCartQty('${item.sku}', 1)" class="w-5 h-5 bg-stone-100 border border-stone-300 rounded flex items-center justify-center text-xs hover:bg-stone-200">+</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  const subtotalVND = state.cart.reduce((sum, i) => sum + (i.priceVND * i.qty), 0);
  let discountVND = 0;
  if (state.appliedVoucher) {
    discountVND = (typeof state.appliedVoucher.discountValue === 'number' && state.appliedVoucher.discountValue < 1) ? subtotalVND * state.appliedVoucher.discountValue : state.appliedVoucher.discountValue;
  }

  if (state.currentUser) {
    if (state.currentUser.points >= 500) discountVND += subtotalVND * 0.10;
    else if (state.currentUser.points >= 200) discountVND += subtotalVND * 0.05;
  }

  let shippingVND = state.cart.length > 0 ? state.shippingFeeVND : 0;
  if (subtotalVND >= 2000000) shippingVND = 0;

  const finalVND = Math.max(0, subtotalVND - discountVND + shippingVND);
  const rate = 25000;

  document.getElementById('summary-subtotal').innerText = formatPrice(subtotalVND, subtotalVND/rate);
  document.getElementById('summary-shipping').innerText = formatPrice(shippingVND, shippingVND/rate);
  document.getElementById('summary-discount').innerText = `-${formatPrice(discountVND, discountVND/rate)}`;
  document.getElementById('summary-final').innerText = formatPrice(finalVND, finalVND/rate);
}

function processCheckout() {
  if (state.cart.length === 0) { alert("Giỏ hàng đang trống!"); return; }

  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  if (!name || !phone) { alert("Vui lòng nhập Họ tên và Số điện thoại!"); return; }

  const subtotalVND = state.cart.reduce((sum, i) => sum + (i.priceVND * i.qty), 0);
  const finalVND = subtotalVND + state.shippingFeeVND;
  const orderCode = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder = {
    id: orderCode,
    customer: `${name} (${phone})`,
    totalVND: finalVND,
    totalUSD: finalVND / 25000,
    currency: state.currency,
    payment: 'COD (Giao hàng thu tiền)',
    shippingProvider: 'GHN Express',
    status: 'NEW'
  };

  state.cart.forEach(cartItem => {
    PRODUCTS_DATA.forEach(p => {
      const v = p.variants.find(x => x.sku === cartItem.sku);
      if (v) v.stock -= cartItem.qty;
    });
  });

  if (state.currentUser) {
    const earnedPoints = Math.floor(finalVND / 50000);
    state.currentUser.points += earnedPoints;
    localStorage.setItem('aura_user', JSON.stringify(state.currentUser));
    renderUserAuthUI();
  }

  state.orders.unshift(newOrder);
  localStorage.setItem('aura_orders', JSON.stringify(state.orders));

  state.cart = [];
  state.appliedVoucher = null;
  renderCart();
  toggleCartDrawer(false);

  alert(`🎉 ĐẶT HÀNG COD THÀNH CÔNG!\nMã đơn: ${orderCode}\nĐã lưu đơn vào hệ thống Admin!`);
}
