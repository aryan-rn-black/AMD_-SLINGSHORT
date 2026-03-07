# 🚀 In-Folio

### Democratizing Professional Visibility

_Built for the AMD Slingshot Hackathon_

---

## 🌍 Overview

**In-Folio** is a dual-mode professional networking platform designed to bridge the gap between the corporate workforce and the skilled-labor ecosystem.

Platforms like LinkedIn dominate corporate hiring.

But what about:

- The painter with 10 years of mastery?
- The barista who built a brand following?
- The technician who can rebuild an engine blindfolded?

They have skill.
They have proof.
They have no platform.

Word-of-mouth is fragile.
Relocation resets reputation.
Talent goes unseen.

This is not a feature gap.
This is a systemic exclusion problem.

---

## 🚨 The Problem

Most professional platforms are:

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

## ⚙️ Preview

### 1️⃣ Paste it in any browser

```bash
https://amd-slingshort.vercel.app/
```
      OR
### 2️⃣ Click It
<a href="https://amd-slingshort.vercel.app/">
  <img src="https://miro.medium.com/v2/resize:fit:1400/1*REfqHJ0KREL21X2yYSdaMw.gif" width="100%" alt="Click me" style="height:10%">
</a>

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
