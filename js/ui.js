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
  ui.message.textContent = "";
  ui.cityName.textContent = data.name;
  ui.temperature.textContent = `Temperature: ${data.main.temp}°C`;
  ui.feelsLike.textContent = `Feels like: ${data.main.feels_like}°C`;
  ui.humidity.textContent = `Humidity: ${data.main.humidity}%`;
  ui.description.textContent = data.weather[0].description;
  ui.wind.textContent = `${data.wind.speed} m/s`;
  ui.icon.textContent = "🌤️"; 
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
}
