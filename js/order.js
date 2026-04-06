// ── ORDER.JS — Multi-step order form ──

const SERVICES_LIST = [
  { id: 'wash-fold',   name: 'Wash & Fold',          price: 1500, unit: 'per kg',      icon: '🫧' },
  { id: 'dry-clean',   name: 'Dry Cleaning',          price: 3500, unit: 'per item',    icon: '👔' },
  { id: 'iron-only',   name: 'Ironing Only',          price: 800,  unit: 'per item',    icon: '👕' },
  { id: 'duvet',       name: 'Duvet / Bedding',       price: 5000, unit: 'per set',     icon: '🛏️' },
  { id: 'pickup',      name: 'Pickup & Delivery',     price: 500,  unit: 'flat fee',    icon: '🚚' },
  { id: 'express',     name: 'Express 24h Service',   price: 2500, unit: 'per item',    icon: '⚡' },
];

const TIME_SLOTS = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];

let currentStep = 1;
const TOTAL_STEPS = 4;

function initOrder() {
  renderServiceOptions();
  populateTimeSlots();
  setMinPickupDate();
  renderStepIndicator();
}

function renderServiceOptions() {
  const container = document.getElementById('service-selector');
  if (!container) return;
  container.innerHTML = SERVICES_LIST.map(s => `
    <div class="service-opt" data-id="${s.id}" onclick="toggleService('${s.id}')">
      <div class="so-check" id="check-${s.id}"></div>
      <div class="so-info">
        <div class="so-name">${s.icon} ${s.name}</div>
        <div class="so-price">₦${s.price.toLocaleString()} ${s.unit}</div>
      </div>
      <div class="so-qty" id="qty-wrap-${s.id}">
        <button class="qty-btn" onclick="changeQty(event,'${s.id}',-1)">−</button>
        <span class="qty-val" id="qty-${s.id}">1</span>
        <button class="qty-btn" onclick="changeQty(event,'${s.id}',1)">+</button>
      </div>
    </div>
  `).join('');
}

function toggleService(id) {
  const el = document.querySelector(`.service-opt[data-id="${id}"]`);
  const selected = App.orderState.services;
  const idx = selected.findIndex(s => s.id === id);
  if (idx === -1) {
    selected.push({ id, qty: 1 });
    el.classList.add('selected');
    el.querySelector('.so-check').innerHTML = '✓';
  } else {
    selected.splice(idx, 1);
    el.classList.remove('selected');
    el.querySelector('.so-check').innerHTML = '';
  }
  updateEstimate();
}

function changeQty(e, id, delta) {
  e.stopPropagation();
  const item = App.orderState.services.find(s => s.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  document.getElementById(`qty-${id}`).textContent = item.qty;
  updateEstimate();
}

function updateEstimate() {
  let total = 0;
  App.orderState.services.forEach(item => {
    const svc = SERVICES_LIST.find(s => s.id === item.id);
    if (svc) total += svc.price * item.qty;
  });
  App.orderState.totalEstimate = total;
  const el = document.getElementById('estimate-display');
  if (el) el.textContent = `₦${total.toLocaleString()}`;
}

function populateTimeSlots() {
  const sel = document.getElementById('pickup-time');
  if (!sel) return;
  sel.innerHTML = '<option value="">Select time</option>' + TIME_SLOTS.map(t => `<option value="${t}">${t}</option>`).join('');
}

function setMinPickupDate() {
  const inp = document.getElementById('pickup-date');
  if (!inp) return;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  inp.min = tomorrow.toISOString().split('T')[0];
}

// ── STEP NAVIGATION ──
function renderStepIndicator() {
  const labels = ['Your Details', 'Services', 'Schedule', 'Summary'];
  const container = document.getElementById('step-indicator');
  if (!container) return;
  let html = '';
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const isDone = i < currentStep;
    const isActive = i === currentStep;
    html += `
      <div class="si-step">
        <div class="si-circle ${isDone ? 'done' : isActive ? 'active' : ''}">${isDone ? '✓' : i}</div>
        <div class="si-label ${isActive ? 'active' : ''}">${labels[i-1]}</div>
      </div>`;
    if (i < TOTAL_STEPS) html += `<div class="si-line ${isDone ? 'done' : ''}"></div>`;
  }
  container.innerHTML = html;
}

function showStep(step) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(`step-${step}`);
  if (el) el.classList.add('active');
  currentStep = step;
  renderStepIndicator();
  if (step === 4) renderSummary();
}

function nextStep() {
  if (!validateCurrentStep()) return;
  collectCurrentStep();
  if (currentStep < TOTAL_STEPS) showStep(currentStep + 1);
}

function prevStep() {
  if (currentStep > 1) showStep(currentStep - 1);
}

function validateCurrentStep() {
  let valid = true;
  if (currentStep === 1) {
    const fields = [
      { id: 'order-name',    msg: 'Full name is required' },
      { id: 'order-phone',   msg: 'Phone number is required' },
      { id: 'order-address', msg: 'Pickup address is required' },
    ];
    fields.forEach(({ id, msg }) => {
      const el = document.getElementById(id);
      const err = el?.nextElementSibling;
      const empty = !el?.value.trim();
      el?.classList.toggle('error', empty);
      if (err) { err.textContent = msg; err.classList.toggle('show', empty); }
      if (empty) valid = false;
    });
    const phone = document.getElementById('order-phone');
    if (phone?.value && !/^[0-9+\-\s]{7,15}$/.test(phone.value.trim())) {
      phone.classList.add('error');
      const err = phone.nextElementSibling;
      if (err) { err.textContent = 'Enter a valid phone number'; err.classList.add('show'); }
      valid = false;
    }
    const email = document.getElementById('order-email');
    if (email?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.classList.add('error');
      const err = email.nextElementSibling;
      if (err) { err.textContent = 'Enter a valid email address'; err.classList.add('show'); }
      valid = false;
    }
  }
  if (currentStep === 2) {
    if (App.orderState.services.length === 0) {
      showToast('Please select at least one service', 'error');
      valid = false;
    }
  }
  if (currentStep === 3) {
    const date = document.getElementById('pickup-date');
    const time = document.getElementById('pickup-time');
    if (!date?.value) {
      showToast('Please select a pickup date', 'error'); valid = false;
    } else if (!time?.value) {
      showToast('Please select a pickup time', 'error'); valid = false;
    }
  }
  return valid;
}

function collectCurrentStep() {
  if (currentStep === 1) {
    App.orderState.name    = document.getElementById('order-name')?.value.trim() || '';
    App.orderState.phone   = document.getElementById('order-phone')?.value.trim() || '';
    App.orderState.email   = document.getElementById('order-email')?.value.trim() || '';
    App.orderState.address = document.getElementById('order-address')?.value.trim() || '';
  }
  if (currentStep === 3) {
    App.orderState.pickupDate = document.getElementById('pickup-date')?.value || '';
    App.orderState.pickupTime = document.getElementById('pickup-time')?.value || '';
    App.orderState.notes      = document.getElementById('order-notes')?.value.trim() || '';
  }
}

function renderSummary() {
  const o = App.orderState;
  // Contact
  const contact = document.getElementById('summary-contact');
  if (contact) contact.innerHTML = `
    <div class="summary-row"><span>Name</span><span>${o.name}</span></div>
    <div class="summary-row"><span>Phone</span><span>${o.phone}</span></div>
    ${o.email ? `<div class="summary-row"><span>Email</span><span>${o.email}</span></div>` : ''}
    <div class="summary-row"><span>Address</span><span>${o.address}</span></div>
  `;
  // Services
  const svcs = document.getElementById('summary-services');
  if (svcs) {
    let rows = o.services.map(item => {
      const svc = SERVICES_LIST.find(s => s.id === item.id);
      if (!svc) return '';
      const sub = svc.price * item.qty;
      return `<div class="summary-row"><span>${svc.name} × ${item.qty}</span><span>₦${sub.toLocaleString()}</span></div>`;
    }).join('');
    rows += `<div class="summary-row total"><span>Estimated Total</span><span>₦${o.totalEstimate.toLocaleString()}</span></div>`;
    svcs.innerHTML = rows;
  }
  // Schedule
  const sched = document.getElementById('summary-schedule');
  if (sched) sched.innerHTML = `
    <div class="summary-row"><span>Pickup Date</span><span>${formatDate(o.pickupDate)}</span></div>
    <div class="summary-row"><span>Pickup Time</span><span>${o.pickupTime}</span></div>
    ${o.notes ? `<div class="summary-row"><span>Notes</span><span>${o.notes}</span></div>` : ''}
  `;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function submitOrder() {
  const btn = document.getElementById('submit-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Placing order…'; }
  // Simulate submission (replace with real API/email service)
  setTimeout(() => {
    document.getElementById('form-card-inner').style.display = 'none';
    document.getElementById('confirm-screen').style.display = 'block';
    // Reset
    App.orderState = { name:'', phone:'', email:'', address:'', services:[], pickupDate:'', pickupTime:'', notes:'', totalEstimate:0 };
    currentStep = 1;
    initOrder();
    renderServiceOptions();
  }, 1500);
}

function resetOrder() {
  document.getElementById('form-card-inner').style.display = 'block';
  document.getElementById('confirm-screen').style.display = 'none';
  showStep(1);
  // Clear fields
  ['order-name','order-phone','order-email','order-address','pickup-date','order-notes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('pickup-time').value = '';
}
