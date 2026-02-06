# 🌤️ Weather App — Clean Architecture (Vanilla JavaScript)

A **production‑grade Weather Application** built with **Vanilla JavaScript**, designed to deeply understand **frontend architecture, state management, and data flow** before moving to frameworks like React.

This project intentionally avoids frameworks to expose *how modern apps actually work under the hood* — from API boundaries, backend proxies to UI rendering pipelines.

---

## 🎯 Project Goals

* Build a real‑world weather app with live data
* Enforce **clean separation of concerns**
* Prevent UI–API coupling
* Secure sensitive API keys
* Design a **React‑ready architecture** in plain JavaScript
* Learn to debug **state and data flow**, not just DOM issues

---

## 🧠 Architectural Principles

This app enforces three non‑negotiable rules:

> **One place fetches data**
> **One place mutates state**
> **One place renders UI**

Everything in the codebase exists to protect these rules.

---

## 🗂️ Folder Structure

```
js/
├─ services/                 # Frontend API adapter (talks to backend only)
│  └─ weatherAPI.js
│
├─ use-cases/                # Application logic & state updates
│  ├─ getWeatherByCity.js
│  ├─ getWeatherByLocation.js
│  ├─ normalizeWeather.js
│  ├─ normalizeForecast.js
│  └─ favorites/
│     ├─ favorites.js
│     └─ storage.js
│
├─ UI/                       # Pure rendering (no fetch, no state mutation)
│  ├─ weatherUI.js
│  ├─ cloudsUI.js
│  ├─ particlesUI.js
│  ├─ chartUI.js
│  ├─ favoritesUI.js
│  ├─ favoritesDropdown.js
│  └─ elements.js
│
├─ controller.js             # Event handling & orchestration
├─ state.js                  # Single source of truth
└─ app.js                    # App bootstrap

server/
├─ index.js                  # Minimal Node.js proxy server
├─ package.json
└─ .env                      # API key (ignored by Git)
```

---
## 🔐 API Key Security (Backend Proxy)

To prevent exposing the OpenWeather API key in the browser, the app uses a minimal Node.js backend proxy.

key points:

* The frontend never talks directly to OpenWeather
* All API requests go through `http://localhost:3000`
* The API key lives in `server/.env` and is never committed
* This mirrors real production setups (Vercel, Netlify, etc.)
---

## 🔄 Data Flow (Single Render Pipeline)

```
User Action
   ↓
Controller
   ↓
Use-Case (City / Location)
   ↓
Service (Frontend → Backend Proxy)
   ↓
External API (OpenWeather)
   ↓
Normalizer (API → Domain Model)
   ↓
State Update (merged, not replaced)
   ↓
UI Render (from state only)
```
UI never touches raw API data.
Frontend never sees the API key.
---


## 🧩 Services Layer (API Only)

**Location:** `services/weatherAPI.js`

Responsibilities:

* Call backend proxy endpoints
* Fetch weather by coordinates
* Fetch forecast index
* fetch optional enrichments (UV, AQI)

Rules:

* ❌ No DOM access
* ❌ No state access
* ❌ No formatting or logic

Services return **raw API responses only**.

---

## 🔁 Normalization Layer (Critical Boundary)

**Location:** `use-cases/normalizeWeather.js`

Purpose:

* Convert OpenWeather API data into a stable internal domain model

Example internal model:

```js
{
  city,
  lat,
  lon,
  temp,
  feelsLike,
  humidity,
  wind,
  description,
  main,
  clouds,
  rainVolume,
  snowVolume,
  isDay,
  uvIndex
}
```

Benefits:

* UI stability even if API changes
* Easier debugging
* Predictable rendering
* Seamless React migration

---

## 🧠 State Management

**Location:** `state.js`

* Single source of truth
* Holds only **normalized domain data**
* Weather updates are **merged**, not overwritten

State owns:

* `weather`
* `city`
* `unit`
* `isDay`
* `favorites`
* `airQuality`
* `uvIndex`

---

## ⭐ Favorites Architecture

Favorites logic follows Clean Architecture principles:

* UI triggers intent
* Controller delegates to use-cases
* State owns the favorites list
* Storage sync is centralized

This prevents:

* UI-driven state mutations
* Duplicate storage logic
* Hidden side effects
* Tight coupling between UI and persistence

---

## 📊 Chart UI Layer

**Location:** `UI/chartUI.js`

Responsibilities:

* Render forecast charts (temperature, precipitation, etc.)
* Consume only normalized state data
* Remain stateless and deterministic

Rules:

* ❌ No fetch calls
* ❌ No state mutation
* ❌ No business logic

Charts are treated as pure visual output, making them easy to replace or migrate to React chart libraries later.

---

## 🎨 UI Layer (Pure Rendering)

**Location:** `UI/`

Responsibilities:

* Render weather from state
* Apply backgrounds & day/night mood
* Render particles & clouds
* Display UV & AQI when available
* Render favorites dropdown
* Render forecast charts

Rules:

* ❌ No fetch calls
* ❌ No state mutation
* ❌ No business logic

UI functions are **deterministic** — same state in, same UI out.

---

## 🎮 Controller Layer (Thin Orchestrator)

**Location:** `controller.js`

Responsibilities:

* Handle user events (search, location,unit toggle, favorites)
* Call use‑cases
* Handle errors
* Trigger UI rendering

Controller does **not**:

* Fetch data
* Normalize data
* Mutate state directly

---

## 🧪 Debugging Lessons Learned

* Silent UI failures often mean **broken state**, not broken DOM
* Backend errors propagate as frontend symptoms
* API boundaries clarify responsibilities
* Removing legacy files is sometimes the real fix
* Clean architecture makes debugging obvious

---

## 🚀 Why This Project Matters

This project demonstrates:

* Real‑world frontend architecture
* Secure API key handling
* Backend–frontend separation
* Production‑grade debugging skills
* A clear migration path to React

---

## 🔮 Next Steps

* Improve UV fallback handling
* Expand AQI normalization
* Add tests around use-cases
* Migrate architecture directly to React without redesign

---

Built with care to understand **how frontend apps actually work** not just how to make them render.
