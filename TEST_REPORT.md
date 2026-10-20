# Verification report — ASML-ERP reviewed frontend

**Reviewed:** 20 October 2026  
**Package:** static HTML/CSS/JavaScript frontend demo, version 3.3  
**Verification status:** **static checks and business-logic smoke tests passed; full browser UI/e2e verification unavailable**.

## What was tested

| Check | Result | How |
| --- | --- | --- |
| ZIP extracted / source read | Pass | Archive inspected and extracted |
| 13 HTML files have basic document structure, title, viewport | Pass | BeautifulSoup structural audit |
| Local asset references / internal file paths | Pass | All local script/style/page references checked |
| Duplicate HTML IDs | Pass | DOM ID uniqueness audit |
| External JS and inline JS syntax | Pass | Node `--check` |
| Correct script inclusion for modules | Pass | Static audit |
| Demo login email matches documentation | Pass | Static audit |
| Sales filter: search/status/dates | Pass | Node VM regression assertions |
| Inventory filter: name/SKU/category/status | Pass | Node VM regression assertions |
| Sales create: subtotal/discount/total calculation | Pass | Mocked form business-logic smoke test |
| Inventory create: stock-status calculation | Pass | Mocked form business-logic smoke test |
| HTTP file serving | Pass | Local Python HTTP server responded 200 to dashboard file |
| Real browser page navigation / visual layout | **Blocked — not tested** | Chromium in this environment returns `net::ERR_BLOCKED_BY_ADMINISTRATOR`, including for local pages |
| Modal interactions with Bootstrap loaded | **Not tested in a live browser** | Requires accessible browser and CDN resources |
| CDN resources available in test environment | **Not available** | Direct external DNS resolution failed; external scripts not bundled |
| Production auth / API / database | Not applicable | Backend is absent from supplied source |

**Current repeatable results:** `python tests/static_audit.py`: **345 checks, 0 failures**. `node tests/logic_smoke.cjs`: **pass**, filters and mocked save workflows.

## Important limitations

- These tests do **not** prove that every responsive layout, modal, dropdown, chart or animation looks correct in a browser.
- Charts require Chart.js to load from the internet; modals and dropdowns require Bootstrap bundle. A chart fallback message has been added, but not an offline replacement for Bootstrap.
- Several pages remain **sample interface designs**. Their buttons may explain that server integration is required rather than commit records.
- Demo Sales and Inventory records are saved to the current browser only. LocalStorage can be cleared by the browser or user.
- The login is an intentionally **insecure frontend demo credential check** and does not protect other HTML URLs.

## Manual browser QA checklist (recommended before deployment)

1. On Chrome/Firefox/Edge with Internet, open `login.html`, test empty/incorrect/demo credentials, Enter and show/hide password.
2. Open every page via sidebar navigation and global search; verify active nav, breadcrumb, icons and charts.
3. Check widths 1440px, 1024px, 768px and 390px; verify cards don't clip, sidebar overlay closes, tables scroll horizontally.
4. Check light and dark mode, theme persistence after reload, appearance controls and keyboard `Tab` focus outlines.
5. Test Sales and Inventory add/edit/view/delete, reload persistence, filters, pagination, empty states and CSV download.
6. Test input validation: blank customer/SKU, negative price/stock, duplicate SKU, invalid discount, delete confirmation.
7. Test Reports print-to-PDF on desktop browser; verify print margins and chart visibility.
8. Test `Ctrl/Cmd+K`, arrow navigation, Esc, and G shortcuts while typing in regular form fields.
9. Check all browser console errors and failed CDN requests; replace CDN references with locally hosted assets for offline deployment.
10. Before production use, complete backend/security/data workflows described in `DEVELOPER_GUIDE.md`.
