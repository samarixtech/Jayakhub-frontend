# JayakHub — Multi-Tenant B2B Food Delivery Platform
### Final Project Report
**Date:** June 20, 2026  
**Prepared by:** Samarix  
**Project:** JayakHub — IFDP (Integrated Food Delivery Platform)

---

## 1. Executive Summary

JayakHub is a multi-tenant, multi-portal B2B food delivery platform built on Next.js 16 with React 19. It serves three distinct user roles — **Customers**, **Restaurants**, and **Admins** — each through a dedicated portal with role-scoped access, localization (multi-country, multi-language routing), and a shared backend API layer.

The platform is production-grade in architecture: server-side data fetching via Next.js Server Actions, Redux for client-side cart and discovery state, Radix UI primitives styled with Tailwind CSS, and Framer Motion for transitions. It supports Arabic and English locales out of the box via `[country]/[language]` dynamic routing.

---

## 2. Platform Architecture

### 2.1 Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS + Radix UI |
| State Management | Redux Toolkit (`@reduxjs/toolkit`) |
| Animations | Framer Motion |
| Icons | Lucide React |
| PDF Generation | jsPDF + jspdf-autotable |
| Charts | Recharts |
| API Layer | Next.js Server Actions (`"use server"`) |
| Localization | Dynamic `[country]/[language]` routing |

### 2.2 Routing Structure

```
src/app/[country]/[language]/
├── (auth)/              — Login, Register, OTP, Password Reset
├── (public)/            — Marketing, Legal, Static pages
├── (onboarding)/        — Restaurant onboarding flow
├── (restaurant-discovery)/ — Customer-facing restaurant browsing
│   ├── all-restaurants/
│   ├── restaurants/[id]/
│   ├── checkout/
│   ├── order/
│   └── wishlist/
└── (dashboard)/
    ├── customer/        — Customer portal
    └── restaurant/      — Restaurant portal (+ POS)
```

### 2.3 Redux State

- **`cartSlice`** — POS cart items, order type, pending orders, table selection
- **`discoverySlice`** — Customer-facing restaurant/menu discovery state

---

## 3. Portal Status Overview

| Portal | Status | Notes |
|---|---|---|
| Customer Portal | ✅ Completed | Pending final testing (requires Admin to be live) |
| Admin Portal | ✅ Completed | Fully operational |
| Restaurant Portal | 🔄 In Progress | Active development; POS module is the current focus |

---

## 4. Customer Portal

**Status: Completed — Awaiting Integration Testing**

The customer portal provides the full end-to-end food ordering experience. Testing will be finalized once the Admin portal is confirmed live in production.

### 4.1 Features

| Module | Description |
|---|---|
| **Restaurant Discovery** | Browse all restaurants, filter by category, country, cuisine |
| **Restaurant Detail** | Menu browsing, item details, reviews |
| **Wishlist** | Save favourite restaurants |
| **Checkout** | Cart review, address selection, payment |
| **Order Tracking** | Live order status with confirmation screen |
| **Order History** | Full past orders list with reorder capability |
| **Payment History** | Transaction records per order |
| **Wallet** | Customer wallet balance management |
| **Address Management** | Add / edit / default delivery addresses |
| **Profile Settings** | Personal info, password change, account deletion |
| **Notifications** | In-app notification feed |

### 4.2 Public Pages (Marketing Site)

Complete marketing website integrated in the same Next.js app:
- Home, About Us, Services, Careers, Newsroom, News & Press
- Business / Partners / Drivers landing pages
- Help Center, Contact
- Legal: Terms of Service, Privacy Policy, Cookie Policy, Refund Policy, Delivery Policy, Safety

---

## 5. Admin Portal

**Status: Completed**

The Admin portal provides platform-wide oversight including restaurant approvals, user management, financial oversight, and plan management.

### 5.1 Features

| Module | Description |
|---|---|
| **Dashboard** | Platform KPIs, revenue overview, order stats |
| **Restaurant Management** | Approve / reject / suspend restaurants |
| **User Management** | Customer and restaurant account management |
| **Order Management** | Cross-restaurant order monitoring |
| **Finance & Payouts** | Payout scheduling, transaction records |
| **Reports** | Platform-level analytics and exports |
| **Plan Management** | Define subscription plans (feature-gated) |
| **Settings** | Platform configuration, localization toggles |

---

## 6. Restaurant Portal

**Status: In Progress — Active Development**

The restaurant portal is the most feature-rich of the three. It covers everything a restaurant operator needs to run daily operations, manage their menu, process payments, and view business analytics.

### 6.1 Completed Modules

#### Dashboard
- Revenue overview with date-range filtering
- Order stats (total, pending, completed, cancelled)
- Revenue charts (line/bar via Recharts)
- Recent activity feed

#### Menu Management
- **Categories** — Create, edit, sort, toggle visibility
- **Items** — Full CRUD with image upload, pricing, discount support, availability toggle
- **Variant Groups** — Define option groups (e.g. Size, Extras)
- **Variants** — Options per group with additional pricing

#### Orders
- Live order list with status filters (Pending, Preparing, Ready, Delivered, Cancelled)
- Order detail view
- Status update controls
- Date-range and order-type filters
- Order stats summary cards

#### Payments & Finance
- Finance overview with revenue donut chart
- Revenue chart (daily/weekly/monthly breakdown)
- Transaction list with detail sidebar
- Finance report export (PDF via jsPDF)

#### Payouts
- Payout request management
- All payouts sheet with status tracking
- Payout detail view

#### Reports
- Business reports with export capability
- Date-range filtering
- PDF/CSV generation

#### Marketing
- Promotions and offer management

#### Reviews
- Customer review list and response management

#### Support
- Ticket-based support interface

#### Users (Staff)
- Restaurant staff account management
- Role-based access (Owner, Cashier, Manager)

#### Settings
- **Profile** — Restaurant name, logo, cover image
- **Location** — Address, map coordinates
- **Hours** — Operating hours per day
- **Documents** — License and legal document uploads
- **Finance** — Bank/payment account details
- **Security** — Password management

#### Onboarding
- Multi-step wizard for new restaurant registration
- Steps: Basic Info → Location → Menu Setup → Documents → Review
- Context-driven (`OnboardingContext`) with step progress indicator

### 6.2 POS Module (Current Focus)

The POS (Point of Sale) module is a full-featured in-restaurant cashier interface designed to be used on tablets and desktop terminals.

#### Architecture
- Dedicated layout separate from the restaurant dashboard
- `POSContext` for UI state (open/close panels, table selection, category filter)
- Redux `cartSlice` as the single source of truth for cart operations
- `useCLC` context for dynamic currency formatting (`formatPrice()`)
- Keyboard shortcuts for common cashier actions (F1–F4)

#### POS Components

| Component | Description |
|---|---|
| `POSHeader` | Navbar with search, category filter, online orders link, pending orders badge, keyboard shortcuts, register controls |
| `POSMenuGridView` | Responsive item grid with discount badges, discounted price display, strikethrough original price |
| `POSCartPanel` | Right-side cart with order type toggle (Dine-In / Takeaway / Delivery), table/customer display, item cards with variant details, quantity controls, subtotal, Pay/Pay Later actions |
| `PaymentModal` | Full payment flow — method selection → confirm → receipt |
| `ItemModifiersModal` | Variant selection modal fetching from `/item-variants/:itemId`; supports one selection per group (multi-group); dispatches `updateItemVariations` to Redux |
| `TableModal` | Table grid selection for Dine-In orders |
| `PendingOrdersSidebar` | Saved pending orders list with recall and delete |
| `CloseRegisterModal` | End-of-shift register close with summary |
| `ShiftReportPDF` | PDF shift summary generation |
| `KeyboardShortcutsModal` | Reference modal for cashier hotkeys |
| `POSSettingsModal` | POS-specific settings |

#### POS Features — Completed

- **Order Types:** Dine-In (table-bound), Takeaway, Delivery
- **Item Discount Display:** Fixed-amount discounts shown as red badge on menu card; discounted price in green with strikethrough original price
- **Cart Item Cards:** Variant names + prices displayed below item name; discounted vs original price
- **Variant / Modifiers:**
  - Fetches variant groups and options from `GET /item-variants/:itemId`
  - One selection per variant group (independent toggle per group)
  - Pre-populates from existing `selectedVariations` on item
  - Stores as `selectedVariations[]` array in Redux
- **Pending Orders:** Save cart to pending queue (F2), recall from sidebar
- **Payment Flow:**
  - Method selection (Cash / Card / etc.)
  - Paid Amount input (auto-filled from cart total)
  - Delivery Charges field (shown only for Delivery orders)
  - Total Payable calculated from Redux cart (not context — prevents divergence)
  - Posts to `POST /cart-add` with structured payload including item IDs, quantities, variant group IDs, variant option names, table name, delivery fee
- **Receipt Screen:**
  - Reads from API response (`receiptData`)
  - Displays per-item: name, quantity, total amount, discount rows with strikethrough, variant group → option name → additional price
  - Footer: items subtotal, delivery fee (if applicable), grand total, payment method
- **Print Receipt:**
  - Opens new browser window with inline-styled receipt HTML
  - Auto-triggers `window.print()` after a short delay
  - Closes print window after printing
- **Keyboard Shortcuts:** F1 (focus search), F2 (save to pending), F3 (open payment), F4 (pending orders)

#### POS API Endpoints Used

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/pos-items` | Fetch menu items for POS grid |
| `GET` | `/item-variants/:itemId` | Fetch variant groups for an item |
| `POST` | `/cart-add` | Submit order and receive receipt data |
| `GET` | `/cart-list` | Load persisted cart from server |
| `GET` | `/tables` | Fetch table layout for Dine-In |

---

## 7. Plan Management System (Upcoming Feature)

### 7.1 Overview

A subscription plan system will be implemented as an additional feature layer, controlled from both the **Admin portal** and the **Restaurant portal**. This introduces feature-gating at the platform level.

### 7.2 Architecture

```
Admin Portal
└── Plan Management
    ├── Create / edit subscription plans
    ├── Define feature flags per plan
    └── Assign plans to restaurants manually

Restaurant Portal
└── Plan Subscription
    ├── View available plans
    ├── Select and purchase a plan
    └── Feature access based on active plan

Shared
└── Plan-based feature control
    ├── Gate UI components by active plan tier
    └── API-level enforcement via plan metadata
```

### 7.3 Planned Scope

| Item | Description |
|---|---|
| **Plan Tiers** | Defined by Admin (e.g. Basic, Pro, Enterprise) |
| **Feature Flags** | Per-plan toggles for specific portal features |
| **Plan Purchasing** | Restaurant self-service during or after onboarding |
| **Onboarding Integration** | Plan selection step added to restaurant onboarding wizard |
| **Dual Control** | Admin can assign/override plan; Restaurant selects/upgrades |
| **Gating Strategy** | Frontend feature checks against active plan metadata returned by auth/session API |

---

## 8. Authentication & Localization

### 8.1 Auth Flows
- Customer: Register → OTP Verify → Login
- Restaurant: Register (with business info) → OTP → Onboarding → Dashboard
- Shared: Forgot Password → OTP → New Password

### 8.2 Localization
- All routes prefixed with `[country]/[language]` (e.g. `/sa/en/`, `/sa/ar/`)
- Arabic (`ar.json`) and English (`en.json`) message files per component module
- RTL layout considerations in place

---

## 9. Development Priorities (Current Sprint)

| Priority | Item | Status |
|---|---|---|
| 1 | POS — Print receipt | ✅ Completed |
| 2 | POS — Variant selection + display | ✅ Completed |
| 3 | POS — Discount price display (fixed amount) | ✅ Completed |
| 4 | POS — Payment modal total fix | ✅ Completed |
| 5 | POS — API receipt data display | ✅ Completed |
| 6 | Plan management system | 🔜 Planned |
| 7 | Onboarding — Plan purchase step | 🔜 Planned |
| 8 | Customer portal — Integration testing | 🔜 Pending Admin go-live |

---

## 10. Known Gaps & Notes

| Item | Note |
|---|---|
| Customer portal testing | Blocked on Admin being live in production — will be unblocked once Admin is deployed |
| Plan feature flags | Not yet implemented; restaurants currently have unrestricted access to all portal features |
| POS — multi-quantity variants | Each cart item holds one variant selection set; quantity increase duplicates same variant configuration (by design) |
| Tax | Removed from POS cart and payment modal by design decision; no tax calculation in current flow |
| Notifications (POS) | Removed from POS navbar by design decision — cashier UX kept minimal |

---

## 11. Summary

JayakHub is a comprehensive B2B food delivery SaaS platform with a clean three-portal architecture. The **Customer Portal** and **Admin Portal** are feature-complete and ready for production validation. The **Restaurant Portal** is in active development with its POS module as the current priority — the core POS cashier experience (menu browsing, cart management, variant selection, discount handling, payment processing, and receipt printing) is now complete.

The next major feature addition is the **Plan Management System**, which will introduce subscription tiers with feature gating controlled from both the Admin and Restaurant sides, including plan purchasing as part of the restaurant onboarding flow.
