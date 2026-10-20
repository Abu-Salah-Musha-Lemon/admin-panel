# Developer guide — ASML-ERP frontend demo

## 1. Runtime architecture

This is a **multi-page static HTML application**, not an SPA or connected ERP. Each HTML page contains sample data and its own content, so page-to-page navigation loads another `.html` document. Bootstrap supplies modals/dropdowns; Chart.js supplies visual charts. Native browser `localStorage` persists only *selected demonstration features*. No API endpoints or permissions currently exist.

```text
Browser loads e.g. sales.html
      │
      ├── Bootstrap 5 styles & icons (CDNs)
      ├── assets/css/style.css (original styling)
      ├── assets/css/polish.css (reviewed UX overrides)
      │
      ├── Bootstrap bundle and Chart.js (CDNs)
      ├── assets/js/app.js (shared sidebar, chart helper, toast, ERPStore)
      ├── assets/js/global.js (search, theme, shortcut, PageTracker)
      ├── assets/js/ux.js (search button injection, accessibility, settings, exports)
      ├── Inline seed data and chart initialization
      └── assets/js/sales-demo.js (sales logic, on sales.html only)
```

For Inventory replace `sales-demo.js` with `inventory-demo.js`. Other pages currently have chart/sample-data rendering only.

**Script order matters**: `app.js` must be before `global.js`, `ux.js`, and the demo modules because they call `Utils`, `ERPStore`, and `ChartHelper`. Page-local modules are currently loaded at the bottom, after inline seed data. They initialize during `DOMContentLoaded`.

## 2. Key source files

| File | Responsibility | Safe edit points |
| --- | --- | --- |
| `assets/css/style.css` | Original tokens, card/table/sidebar layout | Global design tokens near `:root` |
| `assets/css/polish.css` | Reviewed additions, focus states, responsive and print styles | Prefer adding new customizations here |
| `assets/js/app.js` | `ERPApp`, `ChartHelper`, `Utils`, `ERPStore` | Chart options, toast presentation, safe storage helpers |
| `assets/js/global.js` | `SearchModal`, `DarkMode`, `PageTracker`, shortcuts | `SearchModal.data`, keyboard behaviors |
| `assets/js/ux.js` | Universal search button, accessibility labels, demo export, settings preferences | `ERPUX.settings()`, `ERPUX.actions()` |
| `assets/js/sales-demo.js` | `SalesDemo`: sample dataset CRUD + filter + CSV | `save()`, `rows()`, `render()` |
| `assets/js/inventory-demo.js` | `InventoryDemo`: product records, validation, filter, CSV | `save()`, `rows()`, `render()` |
| `sales.html` | Sales form markup, initial sample records and chart | `salesData` array and `#addSaleModal` |
| `inventory.html` | Inventory form, initial products and chart | `products` array and `#addProductModal` |
| `reports.html` | Sample chart series, monthly/quarterly/year period | `refreshCharts()` and chart datasets |
| `settings.html` | Settings menu, appearance and demo placeholders | `setAccent()` |

`partials/` contains **reference templates only**. Pages currently duplicate their layout; editing a partial alone does not update every page. To reduce maintenance later, migrate layout to a templating/build system.

## 3. Editing a UI theme

1. Change the original palette variables in `assets/css/style.css` (`--accent`, `--sidebar-bg`, `--bg-base`, etc.).
2. Add refined overrides to `assets/css/polish.css` instead of duplicating original CSS everywhere.
3. Test desktop (1440×900), tablet (768×1024), and mobile (390×844).
4. Respect `prefers-reduced-motion`; do not introduce fast or involuntary animation.
5. Check both light and dark modes, modal open/close, keyboard tab order and focus outlines.

Theme, accent, font sizing, compact tables, and sidebar preferences save in browser storage. Appearance and navigation are not tied to a user account.

## 4. Sales workflow

**Files**: `sales.html` + `assets/js/sales-demo.js`.

- `salesData`: initial sample records. On load, browser storage `erp_demo_sales_v2` can replace them.
- `SalesDemo.init()`: binds form submit button, filters, date controls, export and pagination.
- `SalesDemo.rows()`: applies search, status and date filters.
- `SalesDemo.render()`: renders current page; user-visible fields are HTML-escaped.
- `SalesDemo.save()`: validates customer/date/item values, computes quantity, subtotal, discount and total, then mutates the in-memory demo array.
- `SalesDemo.persist()`: stores the array in localStorage.
- `SalesDemo.export()`: exports currently filtered rows to CSV.

**To change Sales product choices**, edit the product `<select>` in `#addSaleModal` and corresponding price mapping in `SalesDemo.init()` (change event). These are currently demo choices, not linked to Inventory and do not decrement stock.

## 5. Inventory workflow

**Files**: `inventory.html` + `assets/js/inventory-demo.js`.

- `products`: sample seed records.
- `InventoryDemo.init()`: restores demo data and binds controls.
- `InventoryDemo.rows()`: applies search, category, stock-status filters.
- `InventoryDemo.save()`: checks mandatory fields, SKU uniqueness, nonnegative prices and integer stock quantities.
- `InventoryDemo.render()`: displays stock status, row actions and pagination.
- `InventoryDemo.export()`: exports currently filtered rows to CSV.

Storage key: `erp_demo_inventory_v2`. Stock status is computed as out of stock (`0`), low stock (less than or equal to reorder threshold), or in stock (above threshold).

**Important:** Sales and Inventory are **separate frontend demonstrations**. They do not share a transactional data model, reserve stock, decrement stock on orders, or perform accounting reconciliation.

## 6. Add a new page

1. Copy an existing page with a related layout.
2. Change `<title>`, breadcrumb, page heading, and `PageTracker.titles`.
3. Add the new page's URL to each page sidebar or introduce a template system first.
4. Add a searchable entry in `SearchModal.data` in `global.js`.
5. Include `style.css`, then `polish.css`, and (at the bottom) Bootstrap/Chart.js if needed, followed by `app.js`, `global.js`, `ux.js`.
6. Give all controls semantic labels and wire real actions, or clearly identify them as demo-only.
7. Run `python tests/static_audit.py` and `node tests/logic_smoke.cjs`.

## 7. Backend migration checklist

Before deploying a real business admin panel:

1. Choose a backend and API contract (e.g. Django REST, Laravel, Express, FastAPI).
2. Replace browser-only login with server-enforced sessions, secure cookies, CSRF protection (where applicable), rate limiting, MFA and password hashing.
3. Enforce role-based access control **on the server**, per tenant and record.
4. Design database schema, constraints, migrations and transaction boundaries for users, stock, orders, purchases, warehouse movements, payments and audit logs.
5. Implement server-side validation, pagination, searching, filters, exports and secure file upload.
6. Make sales/inventory transactions atomic; prevent overselling and record stock adjustments separately.
7. Integrate SSO, payments, invoices, email, notification delivery and backups only once services exist.
8. Replace all sample KPIs and fake notification/session statuses with real queried values.
9. Add automated backend and end-to-end browser tests, CI, CSP, deployment secrets, monitoring and production observability.
10. Remove demo credentials and sample data from production pages.

**Do not** treat `localStorage` as an authorization, sensitive record storage or production database. **Do not** trust the frontend to enforce permissions.

## 8. Dependencies, versioning and tests

No npm installation is necessary to view the demo, but Bootstrap, Bootstrap Icons, Chart.js, and Google Fonts are currently loaded through CDNs. For offline development, vendor them appropriately.

To run source checks:

```bash
python tests/static_audit.py
node tests/logic_smoke.cjs
```

To serve and manually check the browser UI:

```bash
python -m http.server 8000
# then open http://localhost:8000/login.html
```

See `TEST_REPORT.md` for the actual verification coverage and limitations.
