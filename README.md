Here’s a **clean, professional, and hackathon-ready README** you can directly paste into your GitHub repository.

No fluff. Clear structure. Investor-friendly. Judge-friendly.

---

# 🚀 In-Folio

### Democratizing Professional Visibility

**Built for the AMD Slingshot Hackathon**

---

## 🌍 Overview

**In-Folio** is a dual-mode professional networking platform designed to bridge the gap between the corporate workforce and the skilled-labor ecosystem.

While platforms like LinkedIn focus primarily on white-collar professionals, millions of skilled workers—painters, baristas, technicians, shop managers—remain digitally invisible.

In-Folio changes that.

We provide a **visual-first, merit-based networking system** where craftsmanship becomes currency.

---

## 🚨 The Problem

Most professional platforms are:

- Text-heavy
- Corporate-centric
- Resume-focused
- Biased toward office roles

Over **500+ million skilled workers globally** depend on fragile word-of-mouth networks and lack portable digital credibility when relocating.

They can _do the work_ — but cannot _prove the work_ digitally.

---

## 💡 The Solution — Two Worlds, One App

In-Folio introduces **two specialized environments** inside a single unified identity:

### 🏢 1. Professional Mode

- Resume-based networking
- Corporate job listings
- MNC-focused hiring ecosystem
- AI-powered resume generation

### 🛠 2. Marketplace Mode

- Visual-first work portfolios
- “Visual Imprints” (image/video proof of craftsmanship)
- Localized gig discovery
- Merit-based credibility scoring

Users can seamlessly toggle between identities.

---

## ✨ Core Features

### 🔄 Integrated Identity Toggle

Switch between Professional & Marketplace modes instantly.

### 🤖 AI Resume Maker

Powered by **Google Gemini 1.5 Flash**, converts:

- Informal descriptions
- Visual Imprints
- Raw project notes

Into professional-grade resumes.

### 📸 Visual Imprints

High-quality galleries prioritizing:

- Images
- Videos
- Before/after work
- Project documentation

Trust built through proof, not titles.

### 📍 Localized Discovery

Find verified talent nearby using proximity-based search.

---

## 🧠 Tech Stack

### 🎨 Frontend

- React
- TypeScript
- Tailwind CSS v4
- Glassmorphism UI

### 🔐 Backend & Auth

- Supabase
  - PostgreSQL
  - Authentication
  - Row Level Security (RLS)
  - Edge Functions (Deno)

### 🤖 AI Engine

- Google Gemini AI API (Gemini 1.5 Flash)

### ⚡ Performance Optimization

- Optimized for AMD Ryzen™ & EPYC™ hardware
- Fast frontend builds
- Efficient AI inference handling

---

## 🏗 System Architecture

```
Frontend (React SPA)
        ↓
Supabase Auth Layer
        ↓
Supabase Edge Functions (API Logic)
        ↓
PostgreSQL + RLS
        ↓
Gemini AI Integration
```

### Architecture Layers

- **Frontend Layer** – Responsive SPA with glassmorphism design
- **Auth Layer** – Secure real-time authentication
- **API Layer** – Supabase Edge Functions (Deno runtime)
- **Data Layer** – PostgreSQL with strict RLS policies
- **AI Layer** – Resume & content enhancement via Gemini

---

## ⚙️ Installation & Setup

### 1️⃣ Prerequisites

- Node.js (Latest LTS recommended)
- pnpm (recommended) or npm/yarn

---

### 2️⃣ Install Package Manager (Optional)

```bash
npm install -g pnpm
```

---

### 3️⃣ Install Dependencies

```bash
# Gemini AI SDK
npm install @google/generative-ai

# Core React dependencies
npm install react react-dom

# Install remaining dependencies
pnpm install
# OR
npm install
# OR
yarn install
```

---

### 4️⃣ Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

---

### 5️⃣ Run Development Server

```bash
pnpm dev
```

App runs at:

```
http://localhost:5173/
```

To expose to network:

```bash
pnpm dev --host
```

---

## 🏆 AMD Slingshot Hackathon

In-Folio was built for the **AMD Slingshot Hackathon**, showcasing how AI + high-performance compute can democratize professional opportunity worldwide.

We leverage AMD’s processing capabilities for:

- Fast builds
- Scalable inference
- Optimized frontend performance

---

## 🎯 Vision

We believe:

> Skill should be portable.
> Reputation should be visual.
> Opportunity should be equal.

In-Folio is not just a networking platform.
It’s a **digital reputation layer for the global workforce**.

---

## 👨‍💻 Developed By

**DEV Legion**

Built with ❤️ for innovation, equity, and impact.

---
