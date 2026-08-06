/* ADMIN DASHBOARD & CHARTS LOGIC */
let revenueChartInstance = null;
let topProductsChartInstance = null;

function renderAdminDashboard() {
  const totalRevVND = state.orders.reduce((sum, o) => sum + o.totalVND, 0);
  document.getElementById('admin-total-revenue').innerText = formatPrice(totalRevVND, totalRevVND / 25000);
  document.getElementById('admin-total-orders').innerText = state.orders.length;

  let inStockCount = 0;
  const inventoryList = [];
  PRODUCTS_DATA.forEach(p => {
    p.variants.forEach(v => {
      if (v.stock > 0) inStockCount++;
      inventoryList.push({ ...v, productName: p.name });
    });
  });
  document.getElementById('admin-in-stock').innerText = `${inStockCount} SKU`;

  // Admin Inventory Table
  document.getElementById('admin-inventory-table').innerHTML = inventoryList.map(item => `
    <tr class="hover:bg-stone-50">
      <td class="p-4 font-mono text-stone-500 font-bold">${item.sku}</td>
      <td class="p-4 font-semibold">${item.productName}</td>
      <td class="p-4">${item.color}</td>
      <td class="p-4">${item.size}</td>
      <td class="p-4"><span class="font-bold ${item.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}">${item.stock} món</span></td>
      <td class="p-4">
        <button onclick="updateStockByAdmin('${item.sku}', 5)" class="px-2 py-1 bg-stone-200 hover:bg-stone-300 rounded font-bold">+5 Kho</button>
        <button onclick="updateStockByAdmin('${item.sku}', -item.stock)" class="px-2 py-1 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded font-bold ml-1">Hết Hàng</button>
      </td>
    </tr>
  `).join('');

  // Orders Table
  document.getElementById('admin-orders-table').innerHTML = state.orders.map(o => `
    <tr class="hover:bg-stone-50">
      <td class="p-4 font-bold text-stone-900">${o.id}</td>
      <td class="p-4">${o.customer}</td>
      <td class="p-4 font-semibold">${formatPrice(o.totalVND, o.totalUSD)}</td>
      <td class="p-4"><span class="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">${o.payment}</span></td>
      <td class="p-4 text-stone-500">${o.shippingProvider}</td>
      <td class="p-4">
        <select onchange="updateOrderStatus('${o.id}', this.value)" class="p-1 border border-stone-300 rounded bg-white text-[11px] font-semibold">
          <option value="NEW" ${o.status === 'NEW' ? 'selected' : ''}>Mới (NEW)</option>
          <option value="PROCESSING" ${o.status === 'PROCESSING' ? 'selected' : ''}>Đang xử lý</option>
          <option value="DELIVERED" ${o.status === 'DELIVERED' ? 'selected' : ''}>Đã giao hàng</option>
          <option value="CANCELLED" ${o.status === 'CANCELLED' ? 'selected' : ''}>Đã hủy</option>
        </select>
      </td>
    </tr>
  `).join('');

  initAdminCharts();
}

function updateStockByAdmin(sku, addQty) {
  PRODUCTS_DATA.forEach(p => {
    const v = p.variants.find(x => x.sku === sku);
    if (v) v.stock = Math.max(0, v.stock + addQty);
  });
  renderAdminDashboard();
  renderProducts();
}

function updateOrderStatus(orderId, newStatus) {
  const order = state.orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    localStorage.setItem('aura_orders', JSON.stringify(state.orders));
    alert(`Đã đổi đơn ${orderId} sang: ${newStatus}`);
  }
}

function initAdminCharts() {
  const ctx1 = document.getElementById('revenueChart').getContext('2d');
  const ctx2 = document.getElementById('topProductsChart').getContext('2d');

  if (revenueChartInstance) revenueChartInstance.destroy();
  if (topProductsChartInstance) topProductsChartInstance.destroy();

  revenueChartInstance = new Chart(ctx1, {
    type: 'line',
    data: {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      datasets: [{ label: 'Doanh thu (Triệu VNĐ)', data: [15, 22, 18, 32, 28, 40, 55], borderColor: '#1c1917', backgroundColor: 'rgba(28, 25, 23, 0.05)', fill: true, tension: 0.4 }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  topProductsChartInstance = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: ['Blazer', 'Wide Trousers', 'Silk Shirt', 'Leather Tote', 'Loafers'],
      datasets: [{ label: 'Đã bán', data: [54, 38, 29, 21, 17], backgroundColor: '#44403c' }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

/* KHỞI CHẠY HỆ THỐNG KHI DOM SẴN SÀNG */
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  renderUserAuthUI();
  renderProducts();
  renderCart();
});
