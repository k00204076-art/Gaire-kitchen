const modal = document.getElementById('checkoutModal');
const checkoutTotal = document.getElementById('checkoutTotal');
let checkoutDraft = [];

renderBag = () => {
  document.getElementById('cartCount').textContent = bag.length;
  document.getElementById('cartTotal').textContent = `Rs. ${bag.reduce((sum, item) => sum + item.price, 0)}`;
  document.getElementById('cartItems').innerHTML = bag.length
    ? bag.map((item) => `<div class="cart-line"><div>${item.name}<small>Added to your order</small></div><strong>Rs. ${item.price}</strong></div>`).join('')
    : '<p class="empty-cart">Your bag is empty.<br>Let\'s fix that.</p>';
};
renderBag();

const addMenuItem = (name, price) => { bag.push({ name, price }); renderBag(); openBag(); };
const showVariantChoice = (name, prices, labels) => { const overlay = document.createElement('div'); overlay.className = 'variant-modal'; overlay.innerHTML = `<div class="variant-card"><button class="variant-close">×</button><p class="eyebrow">Choose your preference</p><h2>${name}</h2><div class="variant-options">${labels.map((label, i) => `<button data-price="${prices[i] || prices[0]}" data-label="${label}">${label}<strong>Rs. ${prices[i] || prices[0]}</strong></button>`).join('')}</div></div>`; document.body.appendChild(overlay); overlay.querySelector('.variant-close').onclick = () => overlay.remove(); overlay.querySelectorAll('.variant-options button').forEach(button => button.onclick = () => { addMenuItem(`${name} · ${button.dataset.label}`, Number(button.dataset.price)); overlay.remove(); }); };
document.querySelectorAll('.menu-list-card p').forEach((line) => {
  line.addEventListener('click', () => {
    const name = line.querySelector('span').textContent;
    const prices = (line.querySelector('b').textContent.match(/\d+/g) || ['0']).map(Number); const lower = name.toLowerCase();
    const variants = name.split('/').map(part => part.trim()).filter(Boolean);
    if (variants.length > 1) showVariantChoice(name, prices, variants); else addMenuItem(name, prices[0]);
  });
});

document.getElementById('checkoutButton').onclick = () => {
  if (!bag.length) return alert('Add something delicious to your bag first.');
  checkoutDraft = [...bag];
  let foodList = document.getElementById('checkoutFoodList'); if (!foodList) { foodList = document.createElement('div'); foodList.id = 'checkoutFoodList'; foodList.className = 'checkout-food-list'; document.querySelector('.checkout-summary')?.before(foodList); }
  foodList.innerHTML = `<strong>Your order</strong>${bag.map(item => `<div><span>${item.name}</span><b>Rs. ${item.price}</b></div>`).join('')}`;
  checkoutTotal.textContent = `Rs. ${bag.reduce((sum, item) => sum + item.price, 0)}`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
};

document.getElementById('checkoutClose').onclick = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
};

document.getElementById('checkoutForm').onsubmit = (event) => {
  event.preventDefault();
  document.getElementById('checkoutForm').style.display = 'none';
  document.getElementById('orderSuccess').classList.add('show');
  bag = [];
  renderBag();
};

const form = document.getElementById('checkoutForm');
const paymentField = form.querySelector('select[name="payment"]')?.closest('label');
if (paymentField) paymentField.remove();
const fulfillment = document.createElement('fieldset');
fulfillment.className = 'fulfillment';
fulfillment.innerHTML = '<legend>How would you like to receive it?</legend><label class="choice"><input type="radio" name="fulfillment" value="delivery" checked> Home delivery</label><label class="choice"><input type="radio" name="fulfillment" value="pickup"> Pickup</label>';
const addressField = form.querySelector('textarea[name="address"]')?.closest('label');
const nameField = form.elements.name?.closest('label');
const phoneField = form.elements.phone?.closest('label');
form.insertBefore(fulfillment, nameField || addressField);
const tableField = document.createElement('label');
tableField.className = 'hidden-field';
tableField.innerHTML = 'Pickup table<select name="table"><option value="">Choose a table</option><option>Table 1</option><option>Table 2</option><option>Table 3</option><option>Table 4</option><option>Table 5</option><option>Table 6</option><option>Table 7</option></select>';
form.insertBefore(tableField, addressField);
const updateFulfillment = () => { const pickup = form.querySelector('input[name="fulfillment"]:checked')?.value === 'pickup'; tableField.classList.toggle('hidden-field', !pickup); tableField.querySelector('select').required = pickup; [nameField, phoneField].forEach(field => field?.classList.toggle('hidden-field', pickup)); if (nameField) nameField.querySelector('input').required = !pickup; if (phoneField) phoneField.querySelector('input').required = !pickup; if (addressField) { addressField.classList.toggle('hidden-field', pickup); addressField.querySelector('textarea').required = !pickup; } };
fulfillment.addEventListener('change', updateFulfillment); updateFulfillment();
form.addEventListener('submit', () => { const placedItems = checkoutDraft.length ? checkoutDraft : [...bag]; const orders = JSON.parse(localStorage.getItem('gaire_orders') || '[]'); orders.unshift({ id: `#GK-${2487 + orders.length}`, name: form.elements.name.value || 'Pickup guest', phone: form.elements.phone.value || '', fulfillment: form.elements.fulfillment.value, location: form.elements.fulfillment.value === 'pickup' ? form.elements.table.value : form.elements.address.value, items: placedItems.map(item => ({ name: item.name, price: item.price })), itemCount: placedItems.length, total: placedItems.reduce((sum, item) => sum + item.price, 0), status: 'New', createdAt: new Date().toISOString() }); localStorage.setItem('gaire_orders', JSON.stringify(orders)); });

