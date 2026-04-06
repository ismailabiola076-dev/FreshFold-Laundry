// ── UTILS.JS — Page initializers ──

// ── HOME ──
function initHome() {}

// ── SERVICES ──
function initServices() {
  document.querySelectorAll('.service-card[data-order]').forEach(card => {
    card.addEventListener('click', () => App.navigate('order'));
  });
}

// ── PRICES ──
const PRICE_DATA = {
  'wash-fold': [
    { cat: 'Standard Items' },
    { item: 'T-shirts / Polo',        price: '₦800' },
    { item: 'Jeans / Trousers',        price: '₦1,000' },
    { item: 'Shirts (casual)',          price: '₦800' },
    { item: 'Shorts',                  price: '₦700' },
    { item: 'Underwear / Socks (set)', price: '₦400' },
    { cat: 'Bulk (per kg)' },
    { item: 'Wash & Fold (1–5 kg)',    price: '₦1,500/kg' },
    { item: 'Wash & Fold (5 kg+)',     price: '₦1,200/kg' },
  ],
  'dry-clean': [
    { cat: 'Men\'s Clothing' },
    { item: 'Suit (2-piece)',           price: '₦8,000' },
    { item: 'Suit (3-piece)',           price: '₦10,000' },
    { item: 'Blazer / Jacket',         price: '₦4,500' },
    { item: 'Dress Shirt',             price: '₦2,500' },
    { item: 'Trousers',                price: '₦2,000' },
    { cat: 'Women\'s Clothing' },
    { item: 'Gown / Evening Dress',    price: '₦7,000' },
    { item: 'Blouse',                  price: '₦2,500' },
    { item: 'Skirt',                   price: '₦2,000' },
    { item: 'Agbada / Iro & Buba',     price: '₦6,000' },
  ],
  'iron': [
    { cat: 'Per Item' },
    { item: 'Shirt / Blouse',          price: '₦600' },
    { item: 'Trouser / Jeans',         price: '₦600' },
    { item: 'Dress',                   price: '₦800' },
    { item: 'Suit (jacket + trousers)',price: '₦1,800' },
    { item: 'Native wear (set)',        price: '₦2,000' },
    { cat: 'Bulk ironing' },
    { item: '10 items',                price: '₦5,000' },
    { item: '20 items',                price: '₦9,000' },
  ],
  'bedding': [
    { cat: 'Bedding & Home Linen' },
    { item: 'Single bedsheet set',     price: '₦3,500' },
    { item: 'Queen/King bedsheet set', price: '₦5,000' },
    { item: 'Single duvet',            price: '₦6,000' },
    { item: 'Queen/King duvet',        price: '₦9,000' },
    { item: 'Pillow (each)',           price: '₦1,500' },
    { item: 'Curtain (per panel)',     price: '₦3,000' },
    { item: 'Tablecloth',              price: '₦2,000' },
  ],
};

function initPrices() {
  renderPriceTable('wash-fold');
  document.querySelectorAll('.price-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.price-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderPriceTable(tab.dataset.tab);
    });
  });
}

function renderPriceTable(key) {
  const data = PRICE_DATA[key];
  const tbody = document.getElementById('price-tbody');
  if (!tbody || !data) return;
  tbody.innerHTML = data.map(row => {
    if (row.cat) return `<tr class="cat-row"><td colspan="2">${row.cat}</td></tr>`;
    return `<tr><td>${row.item}</td><td>${row.price}</td></tr>`;
  }).join('');
}

// ── FAQ ──
const FAQ_DATA = [
  { cat: 'all',      q: 'How do I place an order?',                    a: 'Click "Order Online" in the navigation, fill in your contact details, select your services, choose a pickup time, and confirm. We\'ll contact you to confirm your slot.' },
  { cat: 'all',      q: 'What areas do you cover for pickup?',          a: 'We currently cover Lagos Island, Lekki, Victoria Island, Ajah, Yaba, Surulere, and Ikeja. We are expanding — check back or WhatsApp us to confirm your area.' },
  { cat: 'ordering', q: 'Can I order via WhatsApp?',                    a: 'Absolutely! You can message us on WhatsApp at any time and we\'ll create your order manually. The online form is just for convenience.' },
  { cat: 'ordering', q: 'How far in advance should I book?',            a: 'Standard orders need at least 24 hours notice. Express 24h service requires a same-day booking by 10 AM.' },
  { cat: 'pricing',  q: 'Are prices fixed or does the final bill vary?', a: 'Prices shown are standard rates. Heavily soiled items, special fabrics, or unusually large items may attract a surcharge — we\'ll always call before proceeding.' },
  { cat: 'pricing',  q: 'Do you offer discounts for bulk orders?',       a: 'Yes! Orders above 5 kg on wash & fold get a reduced per-kg rate. We also offer weekly subscription plans for households — ask us for details.' },
  { cat: 'pricing',  q: 'When do I pay?',                               a: 'Payment is made on delivery. We accept cash, bank transfer, and POS.' },
  { cat: 'delivery', q: 'How long does standard laundry take?',          a: 'Standard wash & fold takes 48–72 hours from pickup. Dry cleaning takes 3–5 business days. Express service is returned within 24 hours.' },
  { cat: 'delivery', q: 'What if my order is delayed?',                  a: 'We will proactively call you if anything changes. If we miss our promised window, we offer a discount on your next order.' },
  { cat: 'delivery', q: 'How are my clothes packaged for return?',       a: 'Clean items are neatly folded and packed in branded, sealed bags. Dry-cleaned and ironed items are hung on hangers and covered in protective wrapping.' },
  { cat: 'quality',  q: 'What if an item is damaged?',                   a: 'We inspect every item before cleaning. If damage occurs during our process, we take full responsibility and compensate you. Please note any pre-existing damage when you hand over your items.' },
  { cat: 'quality',  q: 'Do you use quality detergents?',               a: 'Yes. We use premium, skin-friendly detergents and handle delicate fabrics with care. Special items like silk, wool, or embellished clothing are cleaned separately.' },
  { cat: 'quality',  q: 'Can I specify preferences for my laundry?',     a: 'Yes. The order form has a notes field where you can tell us things like "use unscented detergent", "do not tumble dry", or "starch shirts lightly".' },
];

let faqQuery = '';
let faqCat = 'all';

function initFAQ() {
  renderFAQ();
  const search = document.getElementById('faq-search');
  if (search) search.addEventListener('input', e => { faqQuery = e.target.value.toLowerCase(); renderFAQ(); });
  document.querySelectorAll('.faq-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.faq-cat').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      faqCat = btn.dataset.cat;
      renderFAQ();
    });
  });
}

function renderFAQ() {
  const container = document.getElementById('faq-list');
  if (!container) return;
  const filtered = FAQ_DATA.filter(f =>
    (faqCat === 'all' || f.cat === faqCat) &&
    (!faqQuery || f.q.toLowerCase().includes(faqQuery) || f.a.toLowerCase().includes(faqQuery))
  );
  if (!filtered.length) {
    container.innerHTML = '<div class="faq-empty">No results found. Try a different search or category.</div>';
    return;
  }
  container.innerHTML = filtered.map((f, i) => `
    <div class="faq-item" id="faq-${i}">
      <div class="faq-q" onclick="toggleFAQ('faq-${i}')">
        <span class="faq-q-text">${f.q}</span>
        <div class="faq-icon">+</div>
      </div>
      <div class="faq-a" id="faq-a-${i}">
        <p>${f.a}</p>
      </div>
    </div>
  `).join('');
}

function toggleFAQ(id) {
  const item = document.getElementById(id);
  const ans = document.getElementById(id.replace('faq-', 'faq-a-'));
  const isOpen = item.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-item').forEach(el => { el.classList.remove('open'); });
  document.querySelectorAll('.faq-a').forEach(el => { el.classList.remove('open'); });
  if (!isOpen) { item.classList.add('open'); ans.classList.add('open'); }
}
