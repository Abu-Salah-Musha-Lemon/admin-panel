# ASML-ERP Dashboard — Frontend System
**Version:** 3.2.1 | **Build:** 20260503

---

## 📁 Project Structure

```
erp-dashboard/
├── index.html          ← Executive Dashboard (KPIs, charts, activity)
├── login.html          ← Login page with demo credentials + SSO buttons
├── sales.html          ← Sales orders, filters, rep performance
├── purchase.html       ← Purchase orders, vendor management
├── hrms.html           ← Employees, attendance, payroll, leaves
├── crm.html            ← Leads, deal pipeline (Kanban), contacts
├── inventory.html      ← Products, stock levels, supplier list
├── warehouse.html      ← Warehouse cards, stock transfers, capacity
├── ecommerce.html      ← Online orders, customers, product listings, reviews
├── finance.html        ← Invoices, payments, expenses, P&L
├── reports.html        ← Multi-module charts, saved/scheduled reports
├── settings.html       ← Profile, security, appearance, users, billing, audit
├── 404.html            ← Error page
│
├── partials/
│   ├── sidebar.html    ← Sidebar navigation (reference/copy-paste)
│   ├── topbar.html     ← Topbar with search, dark mode, profile
│   └── footer.html     ← Page footer
│
└── assets/
    ├── css/
    │   └── style.css   ← Full design system (CSS vars, components)
    └── js/
        ├── app.js      ← Sidebar, nav highlight, chart helpers, utils
        └── global.js   ← Search modal, dark mode, keyboard shortcuts
```

---

## 🚀 Quick Start

1. Open `login.html` in a browser
2. Use demo credentials: `admin@ASML-ERP.com` / `admin123`
3. You'll be redirected to `index.html`

Or open any `.html` file directly — no server required.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open global search |
| `ESC` | Close search / modals |
| `G → D` | Go to Dashboard |
| `G → S` | Go to Sales |
| `G → I` | Go to Inventory |
| `G → F` | Go to Finance |
| `G → R` | Go to Reports |

---

## 🎨 Design System

- **Font Display:** Syne (headings)
- **Font Body:** DM Sans (UI text)
- **Primary accent:** `#F5A623` (Amber)
- **Sidebar:** `#0D1321` (Deep Navy)
- **Background:** `#F0F2F7`

CSS custom properties defined in `assets/css/style.css` — change `--accent` to retheme instantly.

---

## 🌙 Dark Mode

- Toggle via topbar moon icon or `Settings > Appearance`
- Persisted in `localStorage`

---

## 📦 CDN Dependencies

```html
Bootstrap 5.3.3       bootstrap.min.css / bootstrap.bundle.min.js
Bootstrap Icons 1.11.3  bootstrap-icons.min.css
Chart.js 4.4.3        chart.umd.min.js
Google Fonts          Syne + DM Sans
```

No npm, no build step — pure HTML/CSS/JS.

---

## 🔌 Backend Integration Guide

All pages use semantic IDs and data-driven rendering ready for API wiring:

| Pattern | Details |
|---------|---------|
| Tables | Rendered via JS arrays → swap for `fetch('/api/...')` |
| Forms | Standard HTML forms → add `action` + `method` |
| Charts | ChartHelper wrapper → feed real data from API |
| Auth | `login.html` → replace `doLogin()` with JWT/session call |
| Modals | Submit buttons → replace `onclick` with API `POST` |

Compatible backends: **Laravel**, **Django**, **Node.js/Express**, **FastAPI**, **Rails**

---

## 📱 Responsive Breakpoints

| Breakpoint | Behavior |
|-----------|---------|
| `> 992px` | Sidebar expanded/collapsible |
| `768–992px` | Sidebar hidden, toggle button |
| `< 768px` | Sidebar slide-in overlay, stacked cards |

---

## ✅ Completed Features

- [x] 13 pages (including login + 404)
- [x] Collapsible sidebar with localStorage persist
- [x] Mobile slide-in sidebar with overlay
- [x] Active nav auto-highlight per page
- [x] Topbar: notifications, profile dropdown, search, dark mode
- [x] Global search modal (Ctrl+K) with keyboard navigation
- [x] Dark mode with localStorage persist
- [x] Keyboard shortcuts (G+D, G+S, etc.)
- [x] Chart.js integration (line, bar, area, doughnut)
- [x] Toast notification system
- [x] All tables: sortable headers, status badges, edit/delete actions
- [x] All modals: create/edit forms for each module
- [x] Settings: profile, security/2FA, appearance, notifications, company, users/roles, integrations, billing, audit log, backup
- [x] CRM Kanban pipeline
- [x] HRMS tabs: employees, attendance, payroll, leaves
- [x] Finance tabs: invoices, payments, expenses, P&L
- [x] E-Commerce tabs: orders, customers, products, reviews
- [x] Warehouse cards with capacity bars + transfer log
- [x] Reports: 8 chart types across 6 modules + scheduled reports table
- [x] Login page with SSO buttons + credential validation
- [x] 404 error page with quick links

---

*ASML-ERP Frontend — Ready for backend integration.*
---
## 🚀 Live Demo
👉 [Click here to view the project](https://abu-salah-musha-lemon.github.io/admin-panel/)
