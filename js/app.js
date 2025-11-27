import {
  appState,
  loadStateFromStorage,
  saveUnit,
} from "./state.js";

import {
  renderWeather,
  renderError,
  renderForecast,
  initUI
} from "./ui.js";

import {
  getWeatherByCity 
} from "./use-cases/getWeatherByCity.js";

import { 
  getWeatherByLocation 
} from "./use-cases/getWeatherByLocation.js";

const searchBtn = document.querySelector(".search-btn");
const cityInput = document.querySelector(".search-input");
const unitToggle = document.querySelector(".unit-toggle");
const locationBtn = document.querySelector(".get-location-btn");


async function updateState(city) {
  // If empty input → STOP + show error
  if (!city || !city.trim()) {
    renderError("Please enter a city");
    return;
  }

  const result = await getWeatherByCity(city);

  if (result.error) {
    renderError(result.error);
    return;
  }

  renderWeather(appState);
  renderForecast(result.forecast);
}


function autoRefresh() {
  if (!appState.city) return;
  console.log("🔄 Auto-refreshing weather...");
  updateState(appState.city);
}

async function getMyLocation() {
  if (!navigator.geolocation) {
    return updateState("Vienna");
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      const result = await getWeatherByLocation(latitude, longitude);

      if (result.error) {
        updateState("Vienna");
        return;
      }

      renderWeather(appState);
    },
    () => updateState("Vienna")
  );
}

initUI();

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (!city) {
    renderError("Please enter a city");
    return;
  }

  updateState(city);
});


cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();

    if (!city) {
      renderError("Please enter a city");
      return;
    }

    updateState(city);
  }
});


locationBtn.addEventListener("click", () => {
  getMyLocation();
});

unitToggle.addEventListener("click", () => {
  appState.unit = appState.unit === "metric" ? "imperial" : "metric";
  saveUnit(appState.unit);
  updateState(appState.city);
});

window.addEventListener("load", () => {
  loadStateFromStorage();

  if (appState.city) {
    updateState(appState.city);
  } else {
    getMyLocation();
  }
  setInterval(autoRefresh, 10 * 60 * 1000);
});
