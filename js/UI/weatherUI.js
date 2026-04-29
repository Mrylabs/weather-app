import { elements } from "./elements.js";
import { applyParticles } from "./particlesUI.js";
import { applyClouds } from "./cloudsUI.js";
import { renderForecastChart } from "./chartsUI.js";

// Helpers
const UNAVAILABLE = "Unavailable";

function getUnitSymbol(unit) {
  return unit === "metric" ? "°C" : "°F";
}

function getWindUnit(unit) {
  return unit === "metric" ? "m/s" : "mph";
}

function formatValue(value, suffix = "") {
  if (value === null || value === undefined || value === "") {
    return UNAVAILABLE;
  }

  return `${value}${suffix}`;
}

export function clearWeatherUI() {
  if (!elements.cityTitle) return;

  elements.cityTitle.textContent = "";
  elements.temperature.textContent = "";
  elements.feelsLike.textContent = UNAVAILABLE;
  elements.humidity.textContent = UNAVAILABLE;
  elements.description.textContent = "";
  elements.wind.textContent = UNAVAILABLE;
  elements.icon.textContent = "";
  elements.message.textContent = "";

  if (elements.uvBox) elements.uvBox.textContent = UNAVAILABLE;
  if (elements.aqiBox) elements.aqiBox.textContent = UNAVAILABLE;
}

function getWeatherEmoji(condition, isDay) {
  if (!condition) return "";

  if (condition.includes("clear")) return isDay ? "☀️" : "🌙";
  if (condition.includes("cloud")) return "☁️";
  if (condition.includes("rain")) return "🌧️";
  if (condition.includes("snow")) return "❄️";
  if (condition.includes("thunder")) return "⚡";
  if (condition.includes("mist")) return "🌫️";
  return "";
}

function clearMoodClasses(body) {
  const classes = Array.from(body.classList);

  classes.forEach((className) => {
    if (className.startsWith("bg-")) {
      body.classList.remove(className);
    }
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
  else if (condition.includes("mist") || condition.includes("fog")) {
    body.classList.add("bg-fog");
  } else if (condition.includes("wind")) {
    body.classList.add("bg-windy");
  }
}

export function updateUV(uv) {
  if (!elements.uvBox) return;

  elements.uvBox.textContent = formatValue(uv);
}

export function updateAQI(airQuality) {
  if (!elements.aqiBox) return;

  elements.aqiBox.textContent = airQuality?.level ?? UNAVAILABLE;
}

export function renderWeather(state) {
  console.log("🧠 FULL STATE:", JSON.stringify(state, null, 2));

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
    uvIndex,
    airQuality,
  } = weather;

  if (!main) return;

  const condition = main.toLowerCase();
  const unitSymbol = getUnitSymbol(state.unit);
  const windUnit = getWindUnit(state.unit);

  applyParticles(condition, rainVolume ?? 0, snowVolume ?? 0, state.isDay);
  applyClouds(condition, clouds ?? 0, state.isDay);
  updateWeatherMood(condition, !state.isDay);

  elements.cityTitle.textContent = city ?? "";
  elements.temperature.textContent = formatValue(temp, unitSymbol);
  elements.feelsLike.textContent = formatValue(feelsLike, unitSymbol);
  elements.humidity.textContent = formatValue(humidity, "%");
  elements.wind.textContent = formatValue(wind, ` ${windUnit}`);
  elements.description.textContent = description ?? UNAVAILABLE;
  elements.icon.textContent = getWeatherEmoji(condition, state.isDay);

  updateUV(uvIndex);
  updateAQI(airQuality);

  if (weather.forecast?.length) {
    renderForecastChart(weather.forecast);
  }
}

export function renderError(msg) {
  if (!elements.message) return;
  elements.message.textContent = msg;
}
