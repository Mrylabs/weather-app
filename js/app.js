import { getWeather, getWeatherByCoords } from "./api.js";
import { renderWeather, renderError } from "./ui.js";

let appState = {
  city: "",
  weather: null,
  isDay: true,
  unit: "metric",
};

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

async function updateState(city) {
  appState.city = city;
  try {
    const data = await getWeather(city);

    if (data.cod !== 200) {
      renderError("City not found 😢");
      return;
    }

    appState.weather = data;

    const now = data.dt;
    const { sunrise, sunset } = data.sys;
    appState.isDay = now >= sunrise && now < sunset;

    renderWeather(appState);

  } catch (err) {
    renderError("Something went wrong. Please try again.");
  }
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
          const data = await getWeatherByCoords(latitude, longitude);

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

window.addEventListener("load", () => getMyLocation());
