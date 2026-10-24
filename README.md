# Tahajjud Calculator — Last Third of the Night

A clean, modern web application built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4** to calculate the **Last Third of the Night** for performing the Tahajjud (*Qiyam al-Layl*) prayer.

---

## How It Works

The app takes two inputs—**Maghrib (sunset)** and **Fajr (dawn)**—and computes the start of the last third of the night in three steps:

1. **Find Total Night Duration:** Calculates the total hours and minutes between **Maghrib** and **Fajr** (automatically handling the midnight wrap-around).
2. **Divide by Three:** Divides the total night duration by `3` to get the length of one-third of the night.
3. **Subtract from Fajr:** Subtracts one-third of the night's duration from the **Fajr** start time.

$$\text{Last Third Start Time} = \text{Fajr} - \left(\frac{\text{Fajr} - \text{Maghrib}}{3}\right)$$

### Example
- **Maghrib (Sunset):** `6:00 PM` (`18:00`)
- **Fajr (Dawn):** `5:00 AM` (`05:00`)
- **Step 1 — Total Night Duration:** `11 hours` (`660 minutes`)
- **Step 2 — Divide by 3:** `3 hours 40 minutes` (`220 minutes`)
- **Step 3 — Subtract from Fajr:** `5:00 AM - 3h 40m` = **`1:20 AM`** (Last third runs from `1:20 AM` until `5:00 AM`)

---

## Features

- **Instant Reactive Calculation:** Updates immediately as you change Maghrib or Fajr times.
- **Night Division Breakdown:** Displays all three thirds of the night (`First Third`, `Second Third`, and `Last Third`) as well as **Islamic Midnight** (the halfway point between Maghrib and Fajr).
- **Step-by-Step Math Explanation:** Shows the exact numbers for each of the 3 calculation steps.
- **12-Hour & 24-Hour Formats:** Toggle between `AM/PM` and `24-Hour` display at any time.
- **Quick Seasonal Presets:** Test common Equinox, Winter, and Summer schedules with one click.
- **One-Click Copy:** Copy a formatted summary of your Tahajjud window to share or save.

---

## Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm`

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open the local URL shown in your terminal (typically `http://localhost:5173`) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Project Structure

```text
├── index.html             # HTML entry point & fonts
├── package.json           # Scripts and dependencies
├── vite.config.ts         # Vite + Tailwind v4 configuration
└── src/
    ├── main.tsx           # React root mount
    ├── App.tsx            # Calculator UI & interactive components
    ├── index.css          # Tailwind CSS imports & base styles
    └── utils/
        └── tahajjud.ts    # Pure calculation & formatting functions
```
