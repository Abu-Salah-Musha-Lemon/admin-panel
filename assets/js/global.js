/* ============================================================
   ERP DASHBOARD — GLOBAL ENHANCEMENTS
   Search Modal · Keyboard Shortcuts · Active Nav · Dark Mode
   ============================================================ */

'use strict';

/* ---- GLOBAL SEARCH MODAL ---------------------------------- */
const SearchModal = {
  data: [
    { label:'Dashboard', url:'index.html', icon:'bi-grid-1x2-fill', cat:'Pages' },
    { label:'Sales Orders', url:'sales.html', icon:'bi-graph-up-arrow', cat:'Pages' },
    { label:'Purchase Orders', url:'purchase.html', icon:'bi-bag-fill', cat:'Pages' },
    { label:'HRMS — Employees', url:'hrms.html', icon:'bi-people-fill', cat:'Pages' },
    { label:'CRM — Leads', url:'crm.html', icon:'bi-person-lines-fill', cat:'Pages' },
    { label:'Inventory', url:'inventory.html', icon:'bi-boxes', cat:'Pages' },
    { label:'Warehouse', url:'warehouse.html', icon:'bi-building', cat:'Pages' },
    { label:'E-Commerce Orders', url:'ecommerce.html', icon:'bi-cart4', cat:'Pages' },
    { label:'Finance — Invoices', url:'finance.html', icon:'bi-wallet2', cat:'Pages' },
    { label:'Reports & Analytics', url:'reports.html', icon:'bi-bar-chart-fill', cat:'Pages' },
    { label:'Settings', url:'settings.html', icon:'bi-gear-fill', cat:'Pages' },
    { label:'Profile Settings', url:'settings.html', icon:'bi-person-circle', cat:'Settings' },
    { label:'Security & 2FA', url:'settings.html', icon:'bi-shield-lock', cat:'Settings' },
    { label:'Users & Roles', url:'settings.html', icon:'bi-people', cat:'Settings' },
    { label:'Billing & Plan', url:'settings.html', icon:'bi-credit-card', cat:'Settings' },
    { label:'Integrations', url:'settings.html', icon:'bi-plug', cat:'Settings' },
  ],

  init() {
    this.inject();
    this.bindKeys();
    document.querySelectorAll('[data-action="open-search"]').forEach(btn => {
      btn.addEventListener('click', () => this.open());
    });
  },

  inject() {
    const html = `
    <div id="globalSearch" style="display:none;position:fixed;inset:0;z-index:99999;background:rgba(13,19,33,0.6);backdrop-filter:blur(4px);align-items:flex-start;justify-content:center;padding-top:80px;" role="dialog" aria-modal="true" aria-label="Global search">
      <div style="background:#fff;border-radius:16px;width:100%;max-width:580px;box-shadow:0 24px 80px rgba(13,19,33,0.3);overflow:hidden;animation:fadeInUp 0.2s ease;">
        <!-- Search input -->
        <div style="display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border);">
          <i class="bi bi-search" style="font-size:18px;color:var(--text-muted);flex-shrink:0;"></i>
          <input id="globalSearchInput" type="text" placeholder="Search pages, actions, settings..." autocomplete="off"
            style="flex:1;border:none;outline:none;font-family:var(--font-body);font-size:15px;color:var(--text-primary);background:transparent;"
            oninput="SearchModal.search(this.value)" onkeydown="SearchModal.keyNav(event)">
          <kbd style="font-size:11px;color:var(--text-muted);background:var(--bg-base);border:1px solid var(--border);border-radius:5px;padding:2px 6px;">ESC</kbd>
        </div>
        <!-- Results -->
        <div id="globalSearchResults" style="max-height:400px;overflow-y:auto;padding:8px;"></div>
        <!-- Footer -->
        <div style="padding:10px 20px;border-top:1px solid var(--border);display:flex;gap:16px;font-size:11px;color:var(--text-muted);">
          <span><kbd style="background:var(--bg-base);border:1px solid var(--border);border-radius:4px;padding:1px 5px;">↑↓</kbd> Navigate</span>
          <span><kbd style="background:var(--bg-base);border:1px solid var(--border);border-radius:4px;padding:1px 5px;">↵</kbd> Go</span>
          <span><kbd style="background:var(--bg-base);border:1px solid var(--border);border-radius:4px;padding:1px 5px;">ESC</kbd> Close</span>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    document.getElementById('globalSearch').addEventListener('click', (e) => {
      if (e.target.id === 'globalSearch') this.close();
    });
  },

  open() {
    const modal = document.getElementById('globalSearch');
    modal.style.display = 'flex';
    document.getElementById('globalSearchInput').value = '';
    this.search('');
    setTimeout(() => document.getElementById('globalSearchInput').focus(), 50);
  },

  close() {
    document.getElementById('globalSearch').style.display = 'none';
    this._selected = -1;
  },

  _selected: -1,
  _filtered: [],

  search(q) {
    this._selected = -1;
    if (!q.trim()) {
      this._filtered = this.data.slice(0, 10);
    } else {
      const lq = q.toLowerCase();
      this._filtered = this.data.filter(d =>
        d.label.toLowerCase().includes(lq) || d.cat.toLowerCase().includes(lq)
      );
    }
    this.render();
  },

  render() {
    const container = document.getElementById('globalSearchResults');
    if (!this._filtered.length) {
      container.innerHTML = `<div style="text-align:center;padding:32px;color:var(--text-muted);font-size:13px;"><i class="bi bi-search" style="font-size:28px;display:block;margin-bottom:8px;opacity:0.3;"></i>No results found</div>`;
      return;
    }

    let html = '';
    let lastCat = null;
    this._filtered.forEach((item, i) => {
      if (item.cat !== lastCat) {
        html += `<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);padding:8px 12px 4px;">${item.cat}</div>`;
        lastCat = item.cat;
      }
      html += `<a href="${item.url}" class="search-result-item" data-idx="${i}" onclick="SearchModal.close()"
        style="display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:8px;color:var(--text-primary);text-decoration:none;transition:background 0.15s;${i === this._selected ? 'background:var(--accent-light);' : ''}">
        <div style="width:32px;height:32px;border-radius:8px;background:var(--bg-base);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="bi ${item.icon}" style="font-size:14px;color:var(--accent);"></i>
        </div>
        <span style="font-size:13.5px;font-weight:500;">${item.label}</span>
        <i class="bi bi-arrow-right-short" style="margin-left:auto;color:var(--text-muted);font-size:16px;"></i>
      </a>`;
    });
    container.innerHTML = html;
  },

  keyNav(e) {
    const items = document.querySelectorAll('.search-result-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._selected = Math.min(this._selected + 1, items.length - 1);
      this._highlight(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this._selected = Math.max(this._selected - 1, 0);
      this._highlight(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this._selected >= 0 && items[this._selected]) {
        window.location.href = items[this._selected].href;
      }
    } else if (e.key === 'Escape') {
      this.close();
    }
  },

  _highlight(items) {
    items.forEach((el, i) => {
      el.style.background = i === this._selected ? 'var(--accent-light)' : '';
    });
    if (items[this._selected]) items[this._selected].scrollIntoView({ block:'nearest' });
  },

  bindKeys() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K = open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
      // ESC = close search
      if (e.key === 'Escape') {
        this.close();
      }
      // G + D = go to dashboard
      if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key === 'g') {
        this._gKey = true;
        setTimeout(() => this._gKey = false, 1000);
      }
      if (this._gKey) {
        if (e.key === 'd') { e.preventDefault(); window.location.href = 'index.html'; }
        if (e.key === 's') { e.preventDefault(); window.location.href = 'sales.html'; }
        if (e.key === 'i') { e.preventDefault(); window.location.href = 'inventory.html'; }
        if (e.key === 'f') { e.preventDefault(); window.location.href = 'finance.html'; }
        if (e.key === 'r') { e.preventDefault(); window.location.href = 'reports.html'; }
      }
    });
  },

  _gKey: false
};

/* ---- KEYBOARD SHORTCUTS HINT ------------------------------ */
const ShortcutHint = {
  show() {
    const el = document.getElementById('shortcutHint');
    if (el) { el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2000); }
  }
};

/* ---- DARK MODE -------------------------------------------- */
const DarkMode = {
  init() {
    const saved = localStorage.getItem('erp_dark_mode');
    if (saved === 'true') this.enable(false);
    this.bindToggle();
  },

  enable(save = true) {
    document.body.classList.add('dark-mode');
    if (save) localStorage.setItem('erp_dark_mode', 'true');
    document.querySelectorAll('[data-dark-icon]').forEach(i => i.className = 'bi bi-sun-fill');
  },

  disable(save = true) {
    document.body.classList.remove('dark-mode');
    if (save) localStorage.setItem('erp_dark_mode', 'false');
    document.querySelectorAll('[data-dark-icon]').forEach(i => i.className = 'bi bi-moon-fill');
  },

  toggle() {
    if (document.body.classList.contains('dark-mode')) this.disable();
    else this.enable();
  },

  bindToggle() {
    document.querySelectorAll('[data-action="toggle-dark"]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  }
};

/* ---- PAGE TITLE TRACKER ----------------------------------- */
const PageTracker = {
  titles: {
    'index.html': 'Dashboard',
    'sales.html': 'Sales',
    'purchase.html': 'Purchase',
    'hrms.html': 'HRMS',
    'crm.html': 'CRM',
    'inventory.html': 'Inventory',
    'warehouse.html': 'Warehouse',
    'ecommerce.html': 'E-Commerce',
    'finance.html': 'Finance',
    'reports.html': 'Reports',
    'settings.html': 'Settings',
    'login.html': 'Login',
  },
  init() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.title = (this.titles[page] || 'Page') + ' — NexaERP';
  }
};

/* ---- TOPBAR SEARCH BUTTON WIRE-UP ------------------------- */
const TopbarSearch = {
  init() {
    // Wire the search icon in topbar to open global search
    document.querySelectorAll('.topbar-btn').forEach(btn => {
      const icon = btn.querySelector('i.bi-search');
      if (icon) {
        btn.setAttribute('data-action', 'open-search');
        btn.setAttribute('title', 'Search (Ctrl+K)');
      }
    });
  }
};

/* ---- INIT ALL --------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  PageTracker.init();
  TopbarSearch.init();
  SearchModal.init();
  DarkMode.init();

  // Inject dark mode toggle into topbar if not present
  const actions = document.querySelector('.topbar-actions');
  if (actions && !document.querySelector('[data-action="toggle-dark"]')) {
    const btn = document.createElement('button');
    btn.className = 'topbar-btn';
    btn.setAttribute('data-action', 'toggle-dark');
    btn.setAttribute('title', 'Toggle Dark Mode');
    btn.innerHTML = '<i class="bi bi-moon-fill" data-dark-icon style="font-size:14px;"></i>';
    actions.insertBefore(btn, actions.firstChild);
    btn.addEventListener('click', () => DarkMode.toggle());
  }

  // Ctrl+K shortcut hint
  const hint = document.createElement('div');
  hint.id = 'shortcutHint';
  hint.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#0D1321;color:#fff;font-size:12px;padding:8px 16px;border-radius:20px;z-index:10000;opacity:0;transition:opacity 0.3s;pointer-events:none;';
  hint.innerHTML = '<i class="bi bi-keyboard"></i> Press <kbd style="background:rgba(255,255,255,0.15);padding:1px 6px;border-radius:4px;font-family:monospace;">Ctrl+K</kbd> to search anywhere';
  document.body.appendChild(hint);
  hint.style.transition = 'opacity 0.3s';

  const style = document.createElement('style');
  style.textContent = `
    #shortcutHint.show { opacity: 1 !important; }

    /* DARK MODE OVERRIDES */
    body.dark-mode {
      --bg-base: #0F172A;
      --bg-card: #1E293B;
      --bg-hover: #263248;
      --border: #2D3F58;
      --text-primary: #E2E8F0;
      --text-secondary: #94A3B8;
      --text-muted: #64748B;
      --topbar-bg: #1E293B;
    }
    body.dark-mode .topbar { background: var(--topbar-bg); border-color: var(--border); }
    body.dark-mode .card { background: var(--bg-card); border-color: var(--border); }
    body.dark-mode .erp-table thead th { background: #172033; }
    body.dark-mode .erp-table tbody tr:hover { background: var(--bg-hover); }
    body.dark-mode .form-control,
    body.dark-mode .form-select { background: var(--bg-card); border-color: var(--border); color: var(--text-primary); }
    body.dark-mode .dropdown-menu { background: var(--bg-card); border-color: var(--border); }
    body.dark-mode .dropdown-item { color: var(--text-primary); }
    body.dark-mode .dropdown-item:hover { background: var(--bg-hover); }
    body.dark-mode #globalSearch > div { background: var(--bg-card); }
    body.dark-mode #globalSearchInput { color: var(--text-primary); }
    body.dark-mode .search-result-item { color: var(--text-primary) !important; }
    body.dark-mode .search-result-item:hover { background: var(--bg-hover) !important; }
    body.dark-mode .modal-content { background: var(--bg-card); color: var(--text-primary); }
    body.dark-mode .erp-table tbody td { color: var(--text-primary); border-color: var(--border); }
    body.dark-mode .page-footer { background: var(--bg-card); border-color: var(--border); }
    body.dark-mode .kpi-card { background: var(--bg-card); border-color: var(--border); }
    body.dark-mode .topbar-profile { border-color: var(--border); }
    body.dark-mode .topbar-btn { border-color: var(--border); color: var(--text-secondary); }
    body.dark-mode .btn-outline { border-color: var(--border); color: var(--text-primary); }
    body.dark-mode .nav-tabs .nav-link { color: var(--text-secondary); }
    body.dark-mode .nav-tabs { border-color: var(--border); }
    body.dark-mode .pipeline-col { background: #172033; }
    body.dark-mode .deal-card { background: var(--bg-card); border-color: var(--border); }

    /* Smooth dark mode transition */
    body, body * { transition: background-color 0.25s ease, border-color 0.25s ease, color 0.1s ease; }
    .sidebar, .sidebar * { transition: none !important; }
    .progress-fill { transition: width 0.8s ease !important; }
  `;
  document.head.appendChild(style);
});
