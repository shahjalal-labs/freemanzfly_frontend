# FreemanZ LLC - Aviation E-Commerce & Course Platform

<p align="center">
  <img src="assets/banner.svg" alt="FreemanZ Frontend Banner" width="100%">
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js" alt="Next.js"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react" alt="React"></a>
  <a href="https://next-auth.js.org"><img src="https://img.shields.io/badge/NextAuth.js-v4-purple?style=for-the-badge&logo=next.js" alt="NextAuth"></a>
  <a href="https://stripe.com"><img src="https://img.shields.io/badge/Stripe-Checkout-008CDD?style=for-the-badge&logo=stripe" alt="Stripe"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind%20CSS-v3.4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS"></a>
  <a href="https://radix-ui.com"><img src="https://img.shields.io/badge/Radix%20UI-Primitives-161618?style=for-the-badge&logo=radix-ui" alt="Radix UI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License"></a>
</p>

---

## 📖 Overview

**FreemanZ Frontend (`freemanzfly_frontend`)** is a dedicated aviation apparel, equipment, and flight training platform. Built with Next.js 15 (Turbopack) and React 19, the application features user authentication via NextAuth (Google OAuth & credentials), structured flight course curriculum viewers, physical goods e-commerce with cart and Stripe checkout, and profile dashboard management.

---

## ⚡ Key Features

- **🔐 NextAuth Authentication:** Google Social Sign-In, credentials registration, email OTP validation, and secure profile onboarding.
- **🛫 Flight Courses & Modules:** Interactive syllabus viewers and educational video courses for aspiring pilots and aviation enthusiasts.
- **🛍️ Integrated E-Commerce Store:** Product catalog, item variants, cart state management, and streamlined checkout.
- **💳 Stripe Payment Processing:** Seamless transaction settlement for courses and merchandise with order success handling.
- **📱 Modern Responsive Architecture:** Built with Radix UI, Tailwind CSS, Lucide icons, and EmailJS transactional contact support.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client_App ["Next.js 15 Application"]
        A[NextAuth Session Provider] --> B[App Router Pages]
        B --> C[Course Curriculum Hub]
        B --> D[Product Store & Cart]
        B --> E[User Profile Setup]
    end

    subgraph External_Services ["Services & Gateways"]
        D -->|Checkout Flow| Stripe[Stripe Payment Gateway]
        A -->|OAuth 2.0| Google[Google Identity]
        B -->|Inquiries| EmailJS[EmailJS Notification]
    end

    Client_App --> External_Services
```

---

## 🗂️ Project Structure

```
freemanzfly_frontend/
├── assets/
│   └── banner.svg               # Architectural repository banner
├── src/
│   ├── app/
│   │   ├── (AuthLayout)/        # Login, Signup, OTP, Reset Password
│   │   ├── (default)/           # Product catalog, Course details, Cart, Checkout
│   │   ├── api/auth/            # NextAuth route handler
│   │   ├── globals.css          # Styling tokens
│   │   └── layout.tsx
│   ├── components/              # Shared UI components & navigation
│   ├── assets/                  # Course graphics & brand imagery
│   └── lib/                     # Utilities & auth config
├── package.json
└── tsconfig.json
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 15** | Modern App Router with Turbopack bundler |
| **React 19** | React component runtime |
| **NextAuth.js** | Multi-provider authentication and session management |
| **Stripe SDK** | Secure payment checkout integration |
| **Tailwind CSS** | Responsive utility styling |
| **Radix UI** | Accessible UI primitives (dialogs, dropdowns, accordions) |
| **EmailJS** | Client-side contact and support dispatch |

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shahjalal-labs/freemanzfly_frontend.git
   cd freemanzfly_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
