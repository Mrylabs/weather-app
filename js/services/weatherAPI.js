const BACKEND_BASE_URL = "https://weather-app-backend-4lng.onrender.com";

// -------- CURRENT WEATHER --------
export async function fetchWeatherByCity(city, unit = "metric") {
  const url = `${BACKEND_BASE_URL}/weather?city=${encodeURIComponent(
    city
  )}&unit=${unit}`;

  console.log("🌐 Fetching weather via backend:", url);
  return fetchJSON(url);
}

export async function fetchWeatherByCoords(lat, lon, unit = "metric") {
  const url = `${BACKEND_BASE_URL}/weather?lat=${lat}&lon=${lon}&unit=${unit}`;
  return fetchJSON(url);
}

// -------- FORECAST --------
export async function fetchForecastByCoords(lat, lon, unit = "metric") {
  const url = `${BACKEND_BASE_URL}/forecast?lat=${lat}&lon=${lon}&unit=${unit}`;
  return fetchJSON(url);
}

// -------- OPTIONAL / FUTURE --------
export async function fetchUVIndex() {
  return null;
}

export async function fetchAirQuality() {
  return null;
}

// -------- SHARED FETCH HELPER --------
async function fetchJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}
