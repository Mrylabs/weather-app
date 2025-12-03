export const ui = {};

const sunFlare = document.getElementById("sun-flare");

export function initUI() {
  ui.cityName     = document.querySelector(".weather-description");
  ui.temperature  = document.getElementById("temperature");
  ui.feelsLike    = document.getElementById("feels-like");
  ui.humidity     = document.getElementById("humidity");
  ui.description  = document.getElementById("description");
  ui.wind         = document.getElementById("wind");
  ui.icon         = document.getElementById("weather-icon");
  ui.timeIcon     = document.getElementById("time-icon");
  ui.message      = document.querySelector(".error-message");
  ui.chartCanvas  = document.getElementById("forecastChart");
  ui.favoriteList = document.getElementById("favorite-list");
  ui.sunFlare = document.getElementById("sun-flare");
  ui.addFavoriteBtn = document.querySelector(".add-favorite-btn");
}

function createFlareCircles() {
  if (!ui.sunFlare) return;
  ui.sunFlare.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    const circle = document.createElement("div");
    circle.className = "flare-circle";

    const size = 120 + i * 50;
    circle.style.width = size + "px";
    circle.style.height = size + "px";

    circle.style.top = -(size / 3) + "px";
    circle.style.left = -(size / 3) + "px";

    ui.sunFlare.appendChild(circle);
  }
}

createFlareCircles();

let forecastChart = null;

function getWeatherEmoji(main, isDay) {
  if (main.includes("clear")) return isDay ? "☀️" : "🌙";
  if (main.includes("cloud")) return "☁️";
  if (main.includes("rain")) return "🌧️";
  if (main.includes("snow")) return "❄️";
  if (main.includes("thunder")) return "⚡";
  if (main.includes("mist")) return "🌫️";
  return "";
}


function updateTimeIcon(isDay) {
  if (!ui.timeIcon) return;

  ui.timeIcon.classList.remove("fade-in");
  ui.timeIcon.classList.add("fade-out");

  setTimeout(() => {
    ui.timeIcon.src = isDay ? "./assets/sun.svg" : "./assets/moon.svg";
    ui.timeIcon.classList.remove("fade-out");
    ui.timeIcon.classList.add("fade-in");
  }, 200);
}

function updateWeatherMood(condition, isNight) {
  const body = document.body;

  body.className = "mood-transition";

  if (isNight) {
    body.classList.add("bg-night");
    return;
  }

  if (condition.includes("clear")) body.classList.add("bg-clear");
  else if (condition.includes("cloud")) body.classList.add("bg-cloudy");
  else if (condition.includes("rain")) body.classList.add("bg-rain");
  else if (condition.includes("thunder")) body.classList.add("bg-thunder");
  else if (condition.includes("snow")) body.classList.add("bg-snow");
  else if (condition.includes("mist") || condition.includes("fog")) body.classList.add("bg-fog");
  else if (condition.includes("wind")) body.classList.add("bg-windy");
}

// --- WEATHER PARTICLES ---
let particleInterval = null;

function clearParticles() {
  const container = document.getElementById("weather-particles");
  if (!container) return;

  container.innerHTML = "";
  if (particleInterval) {
    clearInterval(particleInterval);
    particleInterval = null;
  }
}

function generateSnowParticles() {
  const container = document.getElementById("weather-particles");
  clearParticles();

  particleInterval = setInterval(() => {
    const snow = document.createElement("div");
    snow.className = "snowflake";

    const size = Math.random() * 8 + 4;
    snow.style.width = `${size}px`;
    snow.style.height = `${size}px`;
    snow.style.left = `${Math.random() * 100}vw`;
    snow.style.animationDuration = `${5 + Math.random() * 5}s`;

    container.appendChild(snow);

    setTimeout(() => snow.remove(), 12000);
  }, 200);
}

function generateRainParticles() {
  const container = document.getElementById("weather-particles");
  clearParticles();

  particleInterval = setInterval(() => {
    const drop = document.createElement("div");
    drop.className = "raindrop";

    drop.style.left = `${Math.random() * 100}vw`;
    drop.style.animationDuration = `${0.7 + Math.random() * 0.5}s`;

    container.appendChild(drop);

    setTimeout(() => drop.remove(), 2000);
  }, 80);
}

// CLOUD SYSTEM
const cloudLayer = document.getElementById("cloud-layer");

function createCloud(cloudType = "medium") {
  const cloud = document.createElement("div");
  cloud.classList.add("cloud");

  // Start anywhere between 10–70% vertical height
  cloud.style.top = Math.random() * 60 + 10 + "vh";

  const speed = 50 + Math.random() * 40;
  cloud.style.animationDuration = `${speed}s`;
  cloud.style.transform = `scale(${0.8 + Math.random() * 0.6})`;

  let puffCount =
    cloudType === "thin"  ? 2 + Math.floor(Math.random() * 2) :
    cloudType === "thick" ? 5 + Math.floor(Math.random() * 3) :
                            3 + Math.floor(Math.random() * 3);

  for (let i = 0; i < puffCount; i++) {
    const puff = document.createElement("div");
    puff.classList.add("cloud-puff");

    const size = 70 + Math.random() * 120;
    puff.style.width = `${size}px`;
    puff.style.height = `${size * 0.65}px`;

    puff.style.left = `${i * (size * 0.45)}px`;
    puff.style.top = `${Math.random() * 25 - 12}px`;

    puff.style.filter = "blur(8px)";
    puff.style.opacity = 0.85 + Math.random() * 0.1;

    cloud.appendChild(puff);
  }

  cloudLayer.appendChild(cloud);

  setTimeout(() => cloud.remove(), speed * 1000);
}
function updateSunFlare(isDay) {
  const flare = document.getElementById("sun-flare");
  if (!flare) return;

  flare.style.opacity = isDay ? "1" : "0";
}

export function clearUI() {
  if (!ui.cityName) return;

  ui.cityName.textContent     = "";
  ui.temperature.textContent  = "";
  ui.feelsLike.textContent    = "";
  ui.humidity.textContent     = "";
  ui.description.textContent  = "";
  ui.wind.textContent         = "";
  ui.icon.textContent         = "";
  ui.message.textContent      = "";

  if (ui.timeIcon) {
    ui.timeIcon.classList.remove("fade-in", "fade-out");
    ui.timeIcon.src = "";
  }

  if (forecastChart) {
    forecastChart.destroy();
    forecastChart = null;
  }
}

export function renderError(message) {
  clearUI();
  ui.message.textContent = message;
}

let cloudInterval = null;

function applyClouds(weatherMain, coverage) {
  if (!cloudLayer) return;

  // Clear everything first
  cloudLayer.innerHTML = "";
  if (cloudInterval) clearInterval(cloudInterval);

  // Disable clouds for clear, haze, fog, mist
  if (
    weatherMain.includes("clear") ||
    weatherMain.includes("haze") ||
    weatherMain.includes("mist") ||
    weatherMain.includes("fog")
  ) return;

  // Determine cloud density
  let type = "medium";
  let count = 2;

  if (coverage < 30) {
    type = "thin";
    count = 1;
  } else if (coverage < 60) {
    type = "medium";
    count = 2;
  } else {
    type = "thick";
    count = 4;
  }

  // Create initial clouds
  for (let i = 0; i < count; i++) {
    createCloud(type);
  }

  // Continuous drifting clouds
  cloudInterval = setInterval(() => {
    createCloud(type);
  }, 18000);
}

export function updateFavoriteButton(isFavorite) {
  if (!ui.addFavoriteBtn) return;

  ui.addFavoriteBtn.textContent = isFavorite
    ? "★ Favorited"
    : "☆ Add to Favorites";

  ui.addFavoriteBtn.classList.toggle("favorited", isFavorite);
}

export function renderWeather(state) {
  const weather = state.weather;
  if (!weather) return;

  const weatherMain = weather.weather[0].main.toLowerCase();
  const description = weather.weather[0].description;

  applyClouds(weatherMain, weather.clouds.all);


  updateWeatherMood(weatherMain, !state.isDay);
  // PARTICLE LOGIC
if (weatherMain.includes("snow")) {
  generateSnowParticles();
} else if (weatherMain.includes("rain")) {
  generateRainParticles();
} else if (weatherMain.includes("thunder")) {
  generateRainParticles(); // thunderstorms use heavy rain look
} else {
  clearParticles();
}

function updateSun(weatherMain, cloudCover) {
  if (!sunFlare) return;

  // clear sky, no clouds
  if (weatherMain.includes("clear") && cloudCover < 20) {
    sunFlare.style.opacity = 1;
  } else {
    sunFlare.style.opacity = 0;
  }
}
updateSun(weatherMain, weather.clouds.all);


  document.body.classList.toggle("day-mode", state.isDay);
  document.body.classList.toggle("night-mode", !state.isDay);

  updateTimeIcon(state.isDay);

  const emoji = getWeatherEmoji(weatherMain, state.isDay);
  const unitSymbol = state.unit === "metric" ? "°C" : "°F";

  ui.temperature.textContent = `Temperature: ${Math.round(weather.main.temp)}${unitSymbol}`;
  ui.feelsLike.textContent   = `Feels like: ${Math.round(weather.main.feels_like)}${unitSymbol}`;
  ui.cityName.textContent    = weather.name;
  ui.humidity.textContent    = `💧 Humidity: ${weather.main.humidity}%`;
  ui.description.textContent = description;
  ui.wind.textContent        = `🍃 Wind: ${weather.wind.speed} m/s`;
  ui.icon.textContent        = emoji;
  ui.message.textContent     = "";
}


export function renderForecast(daily, unit = "metric") {
  if (!daily || !ui.chartCanvas) return;

  const labels = daily.map(day =>
    new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })
  );

  const temps = daily.map(day => {
    const c = Math.round(day.temp.day);
    return unit === "metric" ? c : Math.round(c * 9/5 + 32);
  });

  if (forecastChart) forecastChart.destroy();

  const ctx = ui.chartCanvas.getContext("2d");

  forecastChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Daily Temperature",
          data: temps,
          borderWidth: 2,
          tension: 0.4
        }
      ]
    },
    options: {
      scales: { y: { beginAtZero: false } },
      plugins: { legend: { display: false } }
    }
  });
}
export function renderFavoriteCities(favorites) {
  if (!ui.favoriteList) return;

  ui.favoriteList.innerHTML = favorites
    .map(
      (city) => `
      <li class="favorite-item" data-city="${city}">
        <span class="favorite-name">${city}</span>
        <button class="remove-fav" data-city="${city}">❌</button>
      </li>
    `
    )
    .join("");
}
