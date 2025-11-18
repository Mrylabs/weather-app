import { getWeather, getWeatherByCoords, getDailyForecast } from "./api.js";
import { renderWeather, renderError, renderForecast } from "./ui.js";

let appState = {
  city: "",
  weather: null,
  isDay: true,
  unit: "metric",
};

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const unitToggle = document.getElementById("unit-toggle");
const locationBtn = document.getElementById("location-btn");


async function updateState(city) {
  appState.city = city;

  try {
    const data = await getWeather(city, appState.unit);

    if (data.cod !== 200) {
      renderError("City not found 😢");
      return;
    }

    appState.weather = data;
    localStorage.setItem("lastCity", city);

    const { lat, lon } = data.coord;
    const forecastData = await getDailyForecast(lat, lon, appState.unit);
    renderForecast(forecastData.daily);

    const now = data.dt;
    const { sunrise, sunset } = data.sys;
    appState.isDay = now >= sunrise && now < sunset;

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
          const data = await getWeatherByCoords(latitude, longitude, appState.unit);

          appState.city = data.name;
          appState.weather = data;
          renderWeather(appState);

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


searchBtn.addEventListener("click", () => updateState(cityInput.value));

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") updateState(cityInput.value);
});

unitToggle.addEventListener("click", () => {
  appState.unit = appState.unit === "metric" ? "imperial" : "metric";
  localStorage.setItem("unit", appState.unit);
  updateState(appState.city);
});

locationBtn.addEventListener("click", () => {
  getMyLocation();
});


window.addEventListener("load", () => {
  const savedCity = localStorage.getItem("lastCity");
  appState.unit = localStorage.getItem("unit") || "metric";

  if (savedCity) {
    updateState(savedCity);
  } else {
    getMyLocation();
  }
  setInterval(autoRefresh, 10 * 60 * 1000);
});
