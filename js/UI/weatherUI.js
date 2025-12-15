import { elements } from "./elements.js";
import { applyParticles } from "./particlesUI.js";
import { applyClouds } from "./cloudsUI.js";

// Helpers
function getWeatherEmoji(main, isDay) {
  if (main.includes("clear")) return isDay ? "☀️" : "🌙";
  if (main.includes("cloud")) return "☁️";
  if (main.includes("rain")) return "🌧️";
  if (main.includes("snow")) return "❄️";
  if (main.includes("thunder")) return "⚡";
  if (main.includes("mist")) return "🌫️";
  return "";
}

function clearMoodClasses(body) {
  const classes = Array.from(body.classList);
  classes.forEach((c) => {
    if (c.startsWith("bg-")) body.classList.remove(c);
  });
}

function updateWeatherMood(condition, isNight) {
  const body = document.body;

  body.classList.add("mood-transition");
  clearMoodClasses(body);

  if (isNight) {
    body.classList.add("bg-night");
    return;
  }

  if (condition.includes("clear")) body.classList.add("bg-clear");
  else if (condition.includes("cloud")) body.classList.add("bg-cloudy");
  else if (condition.includes("rain")) body.classList.add("bg-rain");
  else if (condition.includes("thunder")) body.classList.add("bg-thunder");
  else if (condition.includes("snow")) body.classList.add("bg-snow");
  else if (condition.includes("mist") || condition.includes("fog"))
    body.classList.add("bg-fog");
  else if (condition.includes("wind")) body.classList.add("bg-windy");
}

function updateSunFlare(isDay) {
  if (!elements.sunFlare) return;
  elements.sunFlare.style.opacity = isDay ? "1" : "0";
}

export function updateUV(uv) {
  elements.uvBox.textContent = `UV Index: ${uv}`;
}

/*export function updateAQI(aqi) {
  const meaning = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
  const label = meaning[aqi - 1];

  elements.aqiBox.textContent = `Air Quality: ${label}`;
}*/

export const weatherUI = {
  renderWeather,
  updateUV,
  //updateAQI,
};


export function renderWeather(state) {
  const weather = state.weather;
  if (!weather) return;

  const {
    city,
    temp,
    feelsLike,
    humidity,
    wind,
    description,
    main,
    clouds,
    rainVolume,
    snowVolume,
  } = weather;

  // Visuals (purely driven by normalized data)
  updateWeatherMood(main, !state.isDay);
  updateSunFlare(state.isDay);

  applyParticles(main, rainVolume, snowVolume, state.isDay);
  applyClouds(main, clouds, state.isDay);

  const emoji = getWeatherEmoji(main, state.isDay);
  const unitSymbol = state.unit === "metric" ? "°C" : "°F";

  // Text UI
  elements.cityTitle.textContent = city;
  elements.temperature.textContent = `${temp}${unitSymbol}`;
  elements.feelsLike.textContent = `Feels like: ${feelsLike}${unitSymbol}`;
  elements.humidity.textContent = `💧 Humidity: ${humidity}%`;
  elements.wind.textContent = `🍃 Wind: ${wind} m/s`;
  elements.description.textContent = description;
  elements.icon.textContent = emoji;
}