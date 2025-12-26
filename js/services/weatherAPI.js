const API_KEY = "b2d857f1ee7b26af47c0d4d12a3b0e36";

export async function fetchWeatherByCity(city, unit = "metric") {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`;
  console.log("🌐 Fetching weather:", url);
  return fetchJSON(url);
}

export async function fetchWeatherByCoords(lat, lon, unit = "metric") {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
  return fetchJSON(url);
}

export async function fetchForecastByCoords(lat, lon, unit = "metric") {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`;
  console.log("🌐 Fetching forecast:", url);
  return fetchJSON(url);
}
window.__testForecast = fetchForecastByCoords;

export async function fetchUVIndex(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/uvi?appid=${API_KEY}&lat=${lat}&lon=${lon}`;
  console.log("🌐 Weather status:", url);
  const res = await fetch(url);
  if (!res.ok) throw new Error("UV fetch failed");
  const data = await res.json();

  return data.value;
}

export async function fetchAirQuality(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  console.log("🌫️ Fetching AQI:", url);

  return fetchJSON(url);
}

// --- Shared reusable fetch helper ---
async function fetchJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}
