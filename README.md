# 🌤️ Weather App — Clean Architecture (Vanilla JavaScript)

A **production‑grade Weather Application** built with **Vanilla JavaScript**, designed to deeply understand **frontend architecture, state management, and data flow** before moving to frameworks like React.

This project intentionally avoids frameworks to expose *how modern apps actually work under the hood* — from API boundaries to UI rendering pipelines.

---

## 🎯 Project Goals

* Build a real‑world weather app with live data
* Enforce **clean separation of concerns**
* Prevent UI–API coupling
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
├─ services/                 # API calls only (no state, no UI)
│  └─ weatherAPI.js
│
├─ use-cases/                # Application logic & state updates
│  ├─ getWeatherByCity.js
│  ├─ getWeatherByLocation.js
│  ├─ normalizeWeather.js
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
```

---

## 🔄 Data Flow (Single Render Pipeline)

```
User Action
   ↓
Controller
   ↓
Use‑Case (City / Location)
   ↓
Service (API Fetch)
   ↓
Normalizer (API → Domain Model)
   ↓
State Update (merged, not replaced)
   ↓
UI Render (from state only)
```

**Important rule:**

> UI never touches raw API data.

---

## 🧩 Services Layer (API Only)

**Location:** `services/weatherAPI.js`

Responsibilities:

* Fetch weather by city
* Fetch weather by coordinates
* Fetch UV index
* fetch forcast & air quality

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
* Display UV index
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
* State setters must **merge**, not replace
* Every entry point must normalize data
* Removing legacy files is sometimes the real fix
* UI errors often reveal architectural issues upstream

---

## 🚀 Why This Project Matters

This project demonstrates:

* Real‑world frontend architecture
* Clean separation of concerns
* Production‑grade debugging skills
* Thoughtful state management
* A clear migration path to React

This is **not tutorial‑style code**. it reflects how scalable frontend systems are built.

---

## 🔮 Next Steps

* Re‑introduce 7‑day forecast with clean normalization
* Visualize forecast using chartUI.js
* Re‑introduce Air Quality Index (AQI) with proper normalization
* Deploy with Vercel
* Migrate architecture directly to React without redesign

---

Built with care to understand **how frontend apps actually work** not just how to make them render.
