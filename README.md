#🚀ASML-ERP Dashboard — Frontend System

A modern, fully responsive **ERP dashboard UI** built with pure HTML, CSS, and JavaScript.  
Designed for scalability and ready for backend integration with any framework.

**Version:** 3.2.1  
**Build:** 20260503  

---

## 📸 Preview

![Dashboard Preview](assets/preview.png)

---

## 🌐 Live Demo

👉 [Click here to view the project](https://abu-salah-musha-lemon.github.io/admin-panel/)

---

## 📁 Project Structure

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
│   ├── sidebar.html    ← Sidebar navigation
│   ├── topbar.html     ← Topbar (search, dark mode, profile)
│   └── footer.html     ← Footer
│
└── assets/
├── css/
│   └── style.css   ← Design system (variables, components)
└── js/
├── app.js      ← Core logic, charts, navigation
└── global.js   ← Search, dark mode, shortcuts

---

## 🛠 Tech Stack

- HTML5  
- CSS3 (Custom Design System + Variables)  
- JavaScript (Vanilla)  
- Bootstrap 5.3  
- Bootstrap Icons  
- Chart.js  

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/erp-dashboard.git

# Open project folder
cd erp-dashboard

# Open in browser
open login.html
````

Or simply open any `.html` file directly — no build step required.

---

## 🔐 Demo Credentials

* **Email:** [admin@ASML-ERP.com](mailto:admin@ASML-ERP.com)
* **Password:** admin123

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action              |
| -------- | ------------------- |
| Ctrl + K | Open global search  |
| ESC      | Close modals/search |
| G → D    | Go to Dashboard     |
| G → S    | Go to Sales         |
| G → I    | Go to Inventory     |
| G → F    | Go to Finance       |
| G → R    | Go to Reports       |

---

## 🎨 Design System

* **Heading Font:** Syne
* **Body Font:** DM Sans
* **Primary Color:** `#F5A623` (Amber)
* **Sidebar:** `#0D1321` (Deep Navy)
* **Background:** `#F0F2F7`

Easily customizable via CSS variables in:

```
assets/css/style.css
```

---

## 🌙 Dark Mode

* Toggle via topbar or settings
* Automatically saved using `localStorage`

---

## 📦 CDN Dependencies

Bootstrap 5.3.3
Bootstrap Icons 1.11.3
Chart.js 4.4.3
Google Fonts (Syne + DM Sans)


No npm or build tools required.

---

## 🔌 Backend Integration Guide

This frontend is fully ready for backend integration:

| Feature | Integration Guide                      |
| ------- | -------------------------------------- |
| Tables  | Replace static data with API (`fetch`) |
| Forms   | Add `action` + `method`                |
| Charts  | Feed dynamic API data                  |
| Auth    | Replace `doLogin()` with JWT/session   |
| Modals  | Connect buttons to API endpoints       |

### ✅ Supported Backends

* Laravel
* Django
* Node.js / Express
* FastAPI
* Ruby on Rails

---

## 📱 Responsive Design

| Screen Size | Behavior               |
| ----------- | ---------------------- |
| > 992px     | Sidebar expanded       |
| 768–992px   | Sidebar collapsible    |
| < 768px     | Mobile overlay sidebar |

---

## ✅ Features

* 13 fully designed pages
* Responsive layout (mobile-first)
* Collapsible sidebar with persistence
* Global search (Ctrl + K)
* Dark mode support
* Keyboard navigation shortcuts
* Interactive charts (Chart.js)
* Toast notifications
* CRUD-ready tables & modals
* CRM Kanban board
* HRMS, Finance, Inventory modules
* E-commerce dashboard
* Reports with analytics
* Login system UI + SSO buttons
* 404 error page

---

## 🚧 Future Improvements

* Backend integration (API + database)
* Authentication system (JWT/session)
* Role-based access control
* Real-time data updates
* Advanced analytics

---

## 👤 Author

**Abu Salah Musha Lemon**

* GitHub: [https://github.com/abu-salah-musha-lemon](https://github.com/abu-salah-musha-lemon)
* Project: ASML-ERP Dashboard

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

---

## 🔥 Final note
This version is:
- Clean  
- Professional  
- Recruiter-friendly  
- Portfolio-ready  

---
