# ASML-ERP — Admin Dashboard (Frontend Demo)

A responsive, multi-module Enterprise Resource Planning (ERP) **frontend** built with HTML, CSS, and vanilla JavaScript. Version **v1.0.2 (reviewed)** includes working **browser-only** Sales and Inventory demo workflows, navigation improvements, clearer demo indicators, keyboard accessibility, and professional UX refinements.

> **Important:** This is **not** a production ERP, a secure login implementation, or a connected database application. Example records, reports, notification counts, and KPIs are sample data. Browser-local demo changes are not shared with other users or devices.
## 🌐 Live Demo
👉 [Click here to view the project](https://abu-salah-musha-lemon.github.io/admin-panel/)

---
## Quick start

1. Download/unzip the complete project. Keep `assets/` beside the HTML pages.
2. On Windows, double-click `START_ADMIN_PANEL.bat` (requires Python 3), or use the manual method below.
3. Install Python 3 if not already installed.
4. In the project root run:
   ```bash
   python -m http.server 8000
   ```
5. Open http://localhost:8000/login.html in a browser with an internet connection (CDN dependencies are needed for Bootstrap components, icons and charts).
6. Use the following **demo credentials**:

   - **Email:** `admin@asml-erp.com`
   - **Password:** `admin123`

You can also load `index.html` directly, but the recommended option is a local HTTP server.

**Security:** Credentials are compared in browser-side JavaScript. There is no server-issued session or access control. Do **not** enter real business data or deploy this demo as a live authentication system.

## Folder map

```text
admin-panel-main/
├── login.html              # Demo login
├── index.html              # Executive dashboard
├── sales.html              # Sales (functional browser-only CRUD)
├── inventory.html          # Inventory (functional browser-only CRUD)
├── purchase.html           # Purchase orders (sample UI)
├── warehouse.html          # Warehouse (sample UI)
├── ecommerce.html          # E-commerce (sample UI)
├── hrms.html               # HR (sample UI)
├── crm.html                # CRM (sample UI)
├── finance.html            # Finance (sample UI)
├── reports.html            # Analytics dashboard / printable reports
├── settings.html           # Settings & preferences
├── 404.html                # Error page
├── START_ADMIN_PANEL.bat   # One-click local launch on Windows (Python 3)
├── assets/
│   ├── css/
│   │   ├── style.css       # Existing design system
│   │   └── polish.css      # Responsive/UI/accessibility refinements
│   └── js/
│       ├── app.js          # Sidebar, chart helpers, toasts, safe local data helpers
│       ├── global.js       # Search, theme and shortcuts
│       ├── ux.js           # Shared UX, accessible labels, exports and preferences
│       ├── sales-demo.js   # Sales CRUD, validation, filters and CSV
│       └── inventory-demo.js # Inventory CRUD, validation, filters and CSV
├── partials/               # Reference-only reusable header/footer templates
├── tests/
│   ├── static_audit.py     # HTML/reference/syntax consistency checks
│   └── logic_smoke.cjs     # Sales & inventory data-filter smoke tests
├── DEVELOPER_GUIDE.md      # Code map, extension and backend guidance
├── TEST_REPORT.md          # Actual checks and limitations
└── CHANGELOG.md            # Reviewed changes
```

The files inside `partials/` are **reference templates**, not automatically injected at runtime. Existing pages contain their own sidebar and topbar markup.

## Working in the demo

| Feature | Status |
| --- | --- |
| Dashboard / KPI displays | Sample values, view only |
| Search Ctrl+K / navigation | Working in-page search/navigation |
| Sidebar, dark mode, appearance prefs | Working browser preferences |
| Sales | Create, view, edit, delete, filter, paginate, CSV export via `localStorage` |
| Inventory | Create, view, edit, delete, filter, paginate, CSV export via `localStorage` |
| Other modules | Mostly sample pages, not backed by persistent records |
| Reports | Sample charts; period view for time-series; PDF through browser print dialog |
| Login | Demo-only client-side check; **not authentication** |
| SSO, real permissions, email, payment, billing | Not implemented |

**Reset demo records:** Clear this site's browser storage (Local Storage keys `erp_demo_sales_v2` and `erp_demo_inventory_v2`), then reload the page. Changes are only stored in the current browser.

**Keyboard shortcuts:** `Ctrl/Cmd + K` search, `Esc` close search, `G` then `D/S/I/F/R` jump to Dashboard/Sales/Inventory/Finance/Reports. Navigation shortcuts do not run while typing in a field.

## CDN requirements

The project currently references third-party CDN resources:

- Bootstrap 5.3.3 (CSS and JS bundle)
- Bootstrap Icons 1.11.3
- Chart.js 4.4.3
- Google Fonts (Syne and DM Sans)

Internet access is required to load all visual components. If Chart.js is unavailable, charts display a fallback notice instead of breaking page initialization. Offline deployment should download/vendor these dependencies separately and update HTML references (licenses must be respected).

## Run available tests

```bash
python tests/static_audit.py
node tests/logic_smoke.cjs
```

Requires Python 3, BeautifulSoup4 and Node.js (for checks only). No npm install or build step is required to run the site itself.

For known limitations and the difference between *static checks* and *real-browser checks*, see `TEST_REPORT.md`. For backend integration and maintainability, see `DEVELOPER_GUIDE.md`.

## Credits

Original project: **ASML-ERP Dashboard**\
Author: **Abu Salah Musha Lemon**.\
This package preserves the original page structure and expands the demo behavior and documentation. Any original licensing terms should be verified before redistribution.
