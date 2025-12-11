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
  // remove any bg-* classes (keeps other classes)
  const classes = Array.from(body.classList);
  classes.forEach((c) => {
    if (c.startsWith("bg-")) body.classList.remove(c);
  });
}

function updateWeatherMood(condition, isNight) {
  const body = document.body;

  // keep other classes but ensure mood-transition exists
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

export function updateAQI(aqi) {
  const meaning = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
  const label = meaning[aqi - 1];

  elements.aqiBox.textContent = `Air Quality: ${label}`;
}

export const weatherUI = {
  renderWeather,
  updateUV,
  updateAQI,
};


// Main Export: Render Current Weather
export function renderWeather(state) {
  const weather = state.weather;
  if (!weather) return;

  const weatherMain = (weather.weather[0].main || "").toLowerCase();
  const description = weather.weather[0].description || "";

  // Background & mood
  updateWeatherMood(weatherMain, !state.isDay);

  // Day/Night visuals
  updateSunFlare(state.isDay);

  // Determine rain/snow intensity (1h then 3h)
  const rainVolume =
    (weather.rain && (weather.rain["1h"] ?? weather.rain["3h"])) ?? 0;
  const snowVolume =
    (weather.snow && (weather.snow["1h"] ?? weather.snow["3h"])) ?? 0;

  // Weather particles module (now receives intensity + day flag)
  applyParticles(weatherMain, rainVolume, snowVolume, state.isDay);

  // Weather clouds module (now receives day flag)
  applyClouds(weatherMain, weather.clouds?.all ?? 0, state.isDay);

  // Emoji
  const emoji = getWeatherEmoji(weatherMain, state.isDay);

  // Units
  const unitSymbol = state.unit === "metric" ? "°C" : "°F";

  // Fill UI (elements come from elements.js)

  if (elements.temperature) {
    elements.temperature.textContent = `Temperature: ${Math.round(weather.main.temp)}${unitSymbol}`;
  }
  if (elements.feelsLike) {
    elements.feelsLike.textContent = `Feels like: ${Math.round(weather.main.feels_like)}${unitSymbol}`;
  }
  if (elements.cityName) elements.cityName.textContent = weather.name || "-";
  if (elements.humidity) elements.humidity.textContent = `💧 Humidity: ${weather.main.humidity}%`;
  if (elements.description) elements.description.textContent = description;
  if (elements.wind) elements.wind.textContent = `🍃 Wind: ${weather.wind.speed} m/s`;
  if (elements.icon) elements.icon.textContent = emoji;
  if (elements.message) elements.message.textContent = "";
}