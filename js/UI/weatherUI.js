import { elements } from "./elements.js";
import { applyParticles } from "./particlesUI.js";
import { applyClouds } from "./cloudsUI.js";

// Helpers
export function clearWeatherUI() {
  if (!elements.cityTitle) return;

  elements.cityTitle.textContent    = "";
  elements.temperature.textContent  = "";
  elements.feelsLike.textContent    = "";
  elements.humidity.textContent     = "";
  elements.description.textContent  = "";
  elements.wind.textContent         = "";
  elements.icon.textContent         = "";
  elements.message.textContent      = "";
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

export function updateUV(uv) {
  if (uv == null) return;
  elements.uvBox.textContent = `UV: ${uv}`;
}

export function updateAQI(airQuality) {
  if (!airQuality || !elements.aqiBox) return;

  elements.aqiBox.innerHTML = `
    <span class="label">AQI: </span>
    <span class="value">${airQuality.level}</span>
  `;
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

  applyParticles(condition, rainVolume ?? 0, snowVolume ?? 0, state.isDay);
  applyClouds(condition, clouds ?? 0, state.isDay);
  updateWeatherMood(condition, !state.isDay);

  elements.cityTitle.textContent = city ?? "";
  elements.temperature.textContent = `${temp}${state.unit === "metric" ? "°C" : "°F"}`;
  elements.feelsLike.textContent = `Feels like: ${feelsLike}`;
  elements.humidity.textContent = `💧 Humidity: ${humidity}%`;
  elements.wind.textContent = `🍃 Wind: ${wind} m/s`;
  elements.description.textContent = description ?? "";
  elements.icon.textContent = getWeatherEmoji(condition, state.isDay);

  if (uvIndex !== null && uvIndex !== undefined) {
    updateUV(uvIndex);
  }
  if (airQuality) {
  updateAQI(airQuality);
}
}

export function renderError(msg) {
  if (!elements.message) return;
  elements.message.textContent = msg;
}