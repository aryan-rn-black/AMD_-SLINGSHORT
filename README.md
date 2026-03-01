# AMD\_-SLINGSHORT

In-Folio: Democratizing Professional Visibility

Built for the AMD Slingshot Hackathon

In-Folio is a dual-mode professional networking web application that bridges the gap between the corporate "white-collar" world and the local "skilled-labor" workforce. While platforms like LinkedIn cater to office roles, In-Folio provides a dedicated marketplace for artisans, tradesmen, and local businesses to build a portable digital reputation through visual proof.

🚀 The Problem

Most professional networks are text-heavy and corporate-centric. This leaves over 500 million skilled workers (painters, baristas, shop managers) digitally invisible. They rely on fragile word-of-mouth networks and lack a way to showcase their "craft" when moving across cities or countries.

💡 The Solution: Two Worlds, One App

In-Folio utilizes two separate, specialized account types to reduce complexity and provide targeted experiences:

Professional Mode: A traditional corporate networking environment focused on resumes, MNC job listings, and office-based careers.

Marketplace Mode: A visual-first ecosystem where workers post "Visual Imprints"—high-quality galleries of their work—to establish trust and merit-based credibility.

✨ Key Features

Integrated Identity Toggle: Seamlessly switch between the Professional and Marketplace environments.

AI Resume Maker: Powered by Google Gemini AI, this tool converts informal descriptions and "Visual Imprints" into professional-grade resumes.

Visual Portfolios: Dedicated project cards that prioritize images/videos over job titles.

Localized Discovery: A proximity-based search to find verified local talent or gig opportunities instantly.

🛠️ Tech Stack

Frontend: React, TypeScript, Tailwind CSS v4.

Backend/Auth: Supabase (PostgreSQL, Auth, Edge Functions).

AI Engine: Google Gemini AI API.

Performance: Optimized for AMD Ryzen™ and EPYC™ hardware.

⚙️ Installation & Setup

Follow these steps to get the project running locally.

1. Prerequisites

Ensure you have Node.js installed on your machine. We recommend using pnpm for package management.

2. Install Global Dependencies

npm install -g pnpm

# Optional: if you prefer yarn

# npm install -g yarn

3. Install Project Dependencies

Run these commands in the project root directory:

# Install Gemini AI SDK

npm install @google/generative-ai

# Core React dependencies

npm install react react-dom

# Install all other dependencies

pnpm install

# OR

npm install

# OR

yarn install

4. Environment Variables

Create a .env file in the root and add your keys:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key

5. Run the Project

Start the development server:

pnpm dev

The application will be available at:
➜ Local: http://localhost:5173/

To expose the project to your network, use pnpm dev --host.

🏛️ System Architecture

In-Folio follows a layered architecture:

Frontend Layer: React SPA with Glassmorphism UI.

Auth Layer: Real-time Supabase Auth with fallback mechanisms.

API Layer: Supabase Edge Functions (Deno) handling business logic.

Data Layer: PostgreSQL with Row Level Security (RLS).

AI Layer: Direct integration with Gemini 1.5 Flash for resume generation.

🏆 AMD Slingshot Hackathon

This project was developed for the AMD Slingshot Hackathon, focusing on how AI and high-performance compute can empower the global workforce. We leverage AMD's processing power to handle intensive frontend builds and AI inference requests.

Developed with ❤️ by [DEV legion]
