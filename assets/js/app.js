/* ============================================================
   ERP DASHBOARD — GLOBAL JAVASCRIPT
   ============================================================ */

'use strict';

/* ---- SIDEBAR STATE ---------------------------------------- */
const ERPApp = {

  init() {
    this.sidebar = document.getElementById('sidebar');
    this.overlay = document.getElementById('sidebarOverlay');
    this.mainContent = document.querySelector('.main-content');
    this.topbar = document.querySelector('.topbar');

    this.restoreSidebarState();
    this.bindToggle();
    this.bindOverlay();
    this.highlightActiveNav();
    this.initSubmenus();
    this.initDropdowns();
    this.initTooltips();
    this.handleResize();
  },

  /* Restore sidebar collapsed state from localStorage */
  restoreSidebarState() {
    const collapsed = localStorage.getItem('erp_sidebar_collapsed') === 'true';
    if (collapsed && window.innerWidth > 991) {
      document.body.classList.add('sidebar-collapsed');
      this.sidebar?.classList.add('collapsed');
    }
  },

  /* Toggle sidebar */
  bindToggle() {
    const btn = document.getElementById('sidebarToggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (window.innerWidth <= 991) {
        // Mobile: slide in/out
        this.sidebar.classList.toggle('mobile-open');
        this.overlay.classList.toggle('show');
      } else {
        // Desktop: collapse/expand
        const isCollapsed = this.sidebar.classList.toggle('collapsed');
        document.body.classList.toggle('sidebar-collapsed', isCollapsed);
        localStorage.setItem('erp_sidebar_collapsed', isCollapsed);
      }
    });
  },

  /* Close sidebar on overlay click (mobile) */
  bindOverlay() {
    this.overlay?.addEventListener('click', () => {
      this.sidebar.classList.remove('mobile-open');
      this.overlay.classList.remove('show');
    });
  },

  /* Highlight current page in nav */
  highlightActiveNav() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href === page || (page === '' && href === 'index.html')) {
        link.classList.add('active');
        // Open parent submenu if inside one
        const parentCollapse = link.closest('.collapse');
        if (parentCollapse) {
          parentCollapse.classList.add('show');
          const trigger = document.querySelector(`[data-bs-target="#${parentCollapse.id}"]`);
          trigger?.setAttribute('aria-expanded', 'true');
        }
      }
    });
  },

  /* Submenus */
  initSubmenus() {
    document.querySelectorAll('.nav-link[data-bs-toggle="collapse"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-bs-target');
        const target = document.querySelector(targetId);
        if (!target) return;
        const isOpen = target.classList.contains('show');
        // Close all submenus
        document.querySelectorAll('.nav-submenu.show').forEach(sub => sub.classList.remove('show'));
        document.querySelectorAll('.nav-link[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
        if (!isOpen) {
          target.classList.add('show');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  },

  /* Bootstrap dropdowns fallback init */
  initDropdowns() {
    // Handled by Bootstrap 5 automatically
  },

  /* Tooltip for collapsed sidebar */
  initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(el => {
      // CSS handles tooltip via ::after pseudoelement
    });
  },

  /* Responsive re-check */
  handleResize() {
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991) {
        this.sidebar?.classList.remove('mobile-open');
        this.overlay?.classList.remove('show');
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => ERPApp.init());


/* ============================================================
   CHART HELPERS
   ============================================================ */
const ChartHelper = {

  defaults: {
    font: 'DM Sans',
    gridColor: 'rgba(90,101,128,0.1)',
    textColor: '#5A6580',
  },

  lineChart(ctx, labels, datasets, options = {}) {
    return new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: { font: { family: this.defaults.font, size: 12 }, color: this.defaults.textColor, boxWidth: 12, padding: 16 }
          },
          tooltip: { backgroundColor: '#0D1321', titleFont: { family: 'Syne', size: 12 }, bodyFont: { family: 'DM Sans', size: 12 }, padding: 12, cornerRadius: 8 }
        },
        scales: {
          x: {
            grid: { color: this.defaults.gridColor },
            ticks: { font: { family: this.defaults.font, size: 11 }, color: this.defaults.textColor }
          },
          y: {
            grid: { color: this.defaults.gridColor },
            ticks: { font: { family: this.defaults.font, size: 11 }, color: this.defaults.textColor }
          }
        },
        ...options
      }
    });
  },

  barChart(ctx, labels, datasets, options = {}) {
    return new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { font: { family: this.defaults.font, size: 12 }, color: this.defaults.textColor, boxWidth: 12, padding: 16 }
          },
          tooltip: { backgroundColor: '#0D1321', titleFont: { family: 'Syne', size: 12 }, bodyFont: { family: 'DM Sans', size: 12 }, padding: 12, cornerRadius: 8 }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: this.defaults.font, size: 11 }, color: this.defaults.textColor } },
          y: { grid: { color: this.defaults.gridColor }, ticks: { font: { family: this.defaults.font, size: 11 }, color: this.defaults.textColor } }
        },
        borderRadius: 6,
        ...options
      }
    });
  },

  doughnutChart(ctx, labels, data, colors, options = {}) {
    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff', hoverOffset: 6 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { family: this.defaults.font, size: 12 }, color: this.defaults.textColor, boxWidth: 12, padding: 16 }
          },
          tooltip: { backgroundColor: '#0D1321', titleFont: { family: 'Syne', size: 12 }, bodyFont: { family: 'DM Sans', size: 12 }, padding: 12, cornerRadius: 8 }
        },
        ...options
      }
    });
  },

  areaChart(ctx, labels, datasets, options = {}) {
    datasets = datasets.map(d => ({ ...d, fill: true, tension: 0.4 }));
    return this.lineChart(ctx, labels, datasets, options);
  }
};


/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */
const Utils = {
  formatCurrency(n, currency = '$') {
    return currency + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },
  formatNumber(n) {
    return Number(n).toLocaleString('en-US');
  },
  today() {
    return new Date().toISOString().split('T')[0];
  },
  randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  showToast(msg, type = 'success') {
    const wrap = document.getElementById('toastWrap');
    if (!wrap) return;
    const id = 'toast_' + Date.now();
    const icons = { success: 'bi-check-circle-fill', danger: 'bi-x-circle-fill', warning: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' };
    const colors = { success: '#22C55E', danger: '#EF4444', warning: '#F59E0B', info: '#3B82F6' };
    wrap.insertAdjacentHTML('beforeend', `
      <div id="${id}" class="toast align-items-center border-0 show" role="alert" style="background:#0D1321; color:#fff; border-radius:10px; min-width:260px;">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <i class="bi ${icons[type]}" style="color:${colors[type]}; font-size:16px;"></i>
            <span style="font-size:13px;">${msg}</span>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="document.getElementById('${id}').remove()"></button>
        </div>
      </div>
    `);
    setTimeout(() => document.getElementById(id)?.remove(), 3500);
  }
};
