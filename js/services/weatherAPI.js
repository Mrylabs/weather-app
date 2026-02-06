const BASE_URL = "http://localhost:3000";


export async function fetchWeatherByCity(city, unit = "metric") {
  const url = `http://localhost:3000/weather?city=${encodeURIComponent(
    city
  )}&unit=${unit}`;

  console.log("🌐 Fetching weather via backend:", url);
  return fetchJSON(url);
}


export async function fetchWeatherByCoords(lat, lon) {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}`;
  return fetchJSON(url);
}

export async function fetchForecastByCoords(lat, lon, unit = "metric") {
  return fetchJSON(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&unit=${unit}`
  );
}

window.__testForecast = fetchForecastByCoords;

export async function fetchUVIndex() {
  return null;
}

export async function fetchAirQuality() {
  return null;
}

// --- Shared reusable fetch helper ---
async function fetchJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}
