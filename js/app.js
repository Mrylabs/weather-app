import { getWeather } from "./api.js";
import {renderWeather, renderError} from "./ui.js";

let appState = {
  city: "Vienna",
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
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;
    appState.isDay = now >= sunrise && now < sunset;

    renderWeather(appState);

  } catch (err) {
    renderError("Something went wrong. Please try again.");
  }
}

searchBtn.addEventListener("click", () => updateState(cityInput.value));
cityInput.addEventListener("keydown", (e) => {
if (e.key === "Enter") updateState(cityInput.value);
});

window.addEventListener("load", () => updateState("Vienna"));
