# Changelog

## 3.3 — reviewed frontend demo (2026-10-20)

### Fixed / improved

- Made demo login email consistent across login form and README (`admin@asml-erp.com`).
- Added explicit demo warnings because browser-side credentials and sample records are not secure/production-ready.
- Added functional Sales browser-local CRUD, validation, multi-line totals, search, status/date filtering, pagination and CSV export.
- Added functional Inventory browser-local CRUD, SKU validation, search/category/stock-status filters, pagination and CSV export.
- Added accessibility labels to common controls and modal fields; improved focus visibility and reduced-motion support.
- Improved mobile sidebar open/close and `Escape` handling, plus active navigation indication.
- Added consistent search access and better `Ctrl/Cmd+K` search focus handling.
- Prevented navigation-shortcut triggers when the user is typing into form controls.
- Improved dark mode startup and icon state, theme preference behavior, accent persistence, table density and typography preferences.
- Added chart fallback messaging when Chart.js is not available.
- Changed several false-success backend-only interactions into explicit informative demo notices.
- Added working CSV export of displayed tables where applicable and print-to-PDF behavior on Reports.
- Added refreshed responsive, dark-mode and print design rules in `assets/css/polish.css`.
- Added static audit, browser-independent logic checks, developer guide and test report.

### Still not implemented

- Secure authentication, backend API, database, role-based access, true stock transactions.
- Production reports, notifications, purchases, HR, CRM, finance, integrations, billing, SSO, cloud backups.
- Automated browser visual/e2e tests (browser launches are restricted in the verification environment).

### Original project

ASML-ERP Dashboard frontend by Abu Salah Musha Lemon; original HTML modules and overall visual identity retained.
