const BACKEND_BASE_URL = "https://weather-app-backend-4lng.onrender.com";
const REQUEST_TIMEOUT = 20000; // 20 seconds max wait

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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed (${response.status}): ${errorText || "Unknown error"}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    throw new Error(
      error.message || "Network error. Please check your connection."
    );
  }
}