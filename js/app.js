import {
  appState,
  loadStateFromStorage,
  saveCity,
  saveUnit,
  setWeatherData,
  setDayMode,
} from "./state.js";

import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  fetchDailyForecast
} from "./services/weatherService.js";

import {
  renderWeather,
  renderError,
  renderForecast,
  initUI
} from "./ui.js";


const searchBtn = document.querySelector(".search-btn");
const cityInput = document.querySelector(".search-input");
const unitToggle = document.querySelector(".unit-toggle");
const locationBtn = document.querySelector(".get-location-btn");


async function updateState(city) {
  appState.city = saveCity(city);

  try {
    const data = await fetchWeatherByCity(city, appState.unit);

    if (data.cod !== 200) {
      renderError("City not found 😢");
      return;
    }

    appState.weather = setWeatherData(data);
    localStorage.setItem("lastCity", city);

    const { lat, lon } = data.coord;
    const forecastData = await fetchDailyForecast(lat, lon, appState.unit);
    renderForecast(forecastData.daily);

    const now = data.dt;
    const { sunrise, sunset } = data.sys;
    setDayMode(now >= sunrise && now < sunset);

    renderWeather(appState);

  } catch (err) {
  console.error("UPDATE STATE ERROR:", err);
  renderError("Something went wrong. Please try again.");
  }
}

function autoRefresh() {
  if (!appState.city) return;
  console.log("🔄 Auto-refreshing weather...");
  updateState(appState.city);
}

async function getMyLocation() {
  try {
    if (!navigator.geolocation) {
      console.warn("❌ Browser does not support geolocation. Using fallback...");
      return updateState("Vienna");
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const data = await fetchWeatherByCoords(latitude, longitude, appState.unit);

          appState.city = data.name;
          appState.weather = data;
          renderWeather(appState);
          saveCity(data.name);

        } catch (err) {
          console.warn("❌ Failed to fetch coords weather. Using fallback...");
          updateState("Vienna");
        }
      },
      (err) => {
        console.warn("❌ Geolocation blocked or error:", err);
        updateState("Vienna");
      }
    );

  } catch (err) {
    console.warn("❌ Unexpected geolocation failure:", err);
    updateState("Vienna");
  }
}
initUI();


searchBtn.addEventListener("click", () => updateState(cityInput.value));

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") updateState(cityInput.value);
});

unitToggle.addEventListener("click", () => {
  appState.unit = appState.unit === "metric" ? "imperial" : "metric";
  saveUnit(appState.unit);
  updateState(appState.city);
});

locationBtn.addEventListener("click", () => {
  getMyLocation();
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
