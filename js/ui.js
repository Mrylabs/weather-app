const ui = {
  cityName: document.getElementById("city-name"),
  temperature: document.getElementById("temperature"),
  feelsLike: document.getElementById("feels-like"),
  humidity: document.getElementById("humidity"),
  description: document.getElementById("description"),
  wind: document.getElementById("wind"),
  icon: document.getElementById("weather-icon"),
  timeIcon: document.getElementById("time-icon"),
  message: document.getElementById("message"),
};

export function renderWeather(data) {
  const weatherMain = data.weather[0].main.toLowerCase();
  const now = data.dt;
  const sunrise = data.sys.sunrise;
  const sunset = data.sys.sunset;
  const isDay = now >= sunrise && now < sunset;

  document.body.style.background = isDay
    ? "linear-gradient(to bottom, #87ceeb, #f0f8ff)"
    : "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)";

  ui.timeIcon.textContent = isDay ? "☀️" : "🌙";

  let emoji = "";
  if (weatherMain.includes("clear")) emoji = isDay ? "☀️" : "🌙";
  else if (weatherMain.includes("cloud")) emoji = "☁️";
  else if (weatherMain.includes("rain")) emoji = "🌧️";
  else if (weatherMain.includes("snow")) emoji = "❄️";
  else if (weatherMain.includes("thunder")) emoji = "⚡";
  else if (weatherMain.includes("mist")) emoji = "🌫️";

  ui.cityName.textContent = data.name;
  ui.temperature.textContent = `Temperature: ${data.main.temp}°C`;
  ui.feelsLike.textContent = `Feels like: ${data.main.feels_like}°C`;
  ui.humidity.textContent = `Humidity: ${data.main.humidity}%`;
  ui.description.textContent = data.weather[0].description;
  ui.wind.textContent = `${data.wind.speed} m/s`;
  ui.icon.textContent = emoji;
}

export function renderError(message) {
  ui.message.textContent = message;
  ui.cityName.textContent = "";
  ui.temperature.textContent = "";
  ui.feelsLike.textContent = "";
  ui.humidity.textContent = "";
  ui.description.textContent = "";
  ui.wind.textContent = "";
  ui.icon.textContent = "";
  ui.timeIcon.textContent = "";
}

