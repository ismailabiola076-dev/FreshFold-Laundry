// ── APP.JS — Router + Global State ──

const App = {
  currentPage: 'home',
  orderState: {
    name: '', phone: '', email: '', address: '',
    services: [], pickupDate: '', pickupTime: '', notes: '', totalEstimate: 0
  },

  init() {
    this.handleRoute();
    window.addEventListener('hashchange', () => this.handleRoute());
    this.initNavScroll();
    this.initHamburger();
    this.updateNavLinks();
  },

  handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const validPages = ['home', 'services', 'prices', 'order', 'faq'];
    const page = validPages.includes(hash) ? hash : 'home';
    this.showPage(page);
  },

  showPage(page) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.currentPage = page;
    this.updateNavLinks();
  },

  updateNavLinks() {
    document.querySelectorAll('[data-page]').forEach(el => {
      el.classList.toggle('active', el.dataset.page === this.currentPage);
    });
  },

  initNavScroll() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  },

  initHamburger() {
    const btn = document.getElementById('hamburger');
    const menu = document.getElementById('mobile-menu');
    btn.addEventListener('click', () => {
      btn.classList.toggle('open');
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        btn.classList.remove('open');
        menu.classList.remove('open');
      });
    });
  },

  navigate(page) {
    window.location.hash = page;
  }
};

// ── TOAST NOTIFICATIONS ──
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ── DOM READY ──
document.addEventListener('DOMContentLoaded', () => {
  App.init();
  initHome();
  initServices();
  initPrices();
  initOrder();
  initFAQ();
});
