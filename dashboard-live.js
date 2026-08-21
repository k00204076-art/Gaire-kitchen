if (sessionStorage.getItem('gaire_admin_auth') !== 'true') window.location.replace('admin-login.html');
const resetKey = 'gaire_dashboard_reset_v3';
if (!localStorage.getItem(resetKey)) { localStorage.setItem('gaire_orders', '[]'); localStorage.setItem(resetKey, 'done'); }
const orders = JSON.parse(localStorage.getItem('gaire_orders') || '[]');
const total = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
const setMetric = (index, value) => { const el = document.querySelectorAll('.metric-card strong')[index]; if (el) el.textContent = value; };
const navCount = document.querySelector('.nav-item b'); if (navCount) navCount.textContent = orders.length;
const ordersLink = document.querySelector('.orders-panel .panel-head a'); if (ordersLink) ordersLink.href = 'orders.html';
setMetric(0, `Rs. ${total.toLocaleString()}`); setMetric(1, orders.length); setMetric(2, `Rs. ${orders.length ? Math.round(total / orders.length).toLocaleString() : 0}`); setMetric(3, '0%');
let list = document.getElementById('ordersList');
document.querySelectorAll('.orders-panel > .order-row').forEach(row => row.remove());
if (!list) { list = document.createElement('div'); list.id = 'ordersList'; document.querySelector('.orders-panel .table-head')?.after(list); }
if (list) list.innerHTML = orders.length ? orders.slice(0, 5).map((order, index) => `<div class="order-row"><strong>${order.id}</strong><span><i class="customer-avatar a${(index % 4) + 1}">${(order.name || 'Guest').slice(0, 2).toUpperCase()}</i> ${order.name || 'Guest'}<small class="order-location">${order.fulfillment === 'pickup' ? order.location : 'Home delivery'}</small></span><span>${order.itemCount || (Array.isArray(order.items) ? order.items.length : order.items || 0)} items</span><b>Rs. ${Number(order.total || 0).toLocaleString()}</b><em class="status cooking">${order.status}</em><button class="view-food" data-order="${index}">View food</button><div class="order-food" id="food-${index}">${(Array.isArray(order.items) ? order.items : []).map(item => `<span>${item.name} · Rs. ${item.price}</span>`).join('') || '<span>Food details unavailable</span>'}</div></div>`).join('') : '<div class="empty-orders">No orders yet. Orders placed on the customer website will appear here.</div>';
document.querySelectorAll('.view-food').forEach(button => button.onclick = () => document.getElementById(`food-${button.dataset.order}`).classList.toggle('open'));
const revenueLine = document.querySelector('.revenue-panel .line'); const revenueArea = document.querySelector('.revenue-panel .area'); if (!orders.length && revenueLine && revenueArea) { revenueLine.setAttribute('d', 'M0 230 L700 230'); revenueArea.setAttribute('d', 'M0 230 L700 230 L700 230 L0 230Z'); }
if (!orders.length) { document.querySelectorAll('.item-row').forEach(row => { const amount = row.querySelector('b'); const count = row.querySelector('small'); const bar = row.querySelector('.progress i'); if (amount) amount.textContent = 'Rs. 0'; if (count) count.textContent = '0 orders'; if (bar) bar.style.width = '0%'; }); document.querySelectorAll('.funnel strong').forEach(value => value.textContent = '0'); document.querySelectorAll('.funnel i').forEach(bar => bar.style.setProperty('--w', '0%')); }
window.addEventListener('storage', event => { if (event.key === 'gaire_orders') window.location.reload(); });

