import { appState, setCity, setWeatherData, setDayMode } from "../state.js";
import { fetchWeatherByCoords, fetchUVIndex } from "../services/weatherAPI.js";
import { normalizeWeather } from "./normalizeWeather.js";

export async function getWeatherByLocation(lat, lon) {
  try {
    const data = await fetchWeatherByCoords(lat, lon, appState.unit);

    if (data.cod !== 200) {
      return { error: "Location weather not found" };
    }

    const normalized = normalizeWeather(data, appState.unit);

    // 1️⃣ city comes from normalized weather
    setCity(normalized.city);

    // 2️⃣ set base weather snapshot
    setWeatherData(normalized);

    // 3️⃣ day/night comes from normalized data
    setDayMode(normalized.isDay);

    // 4️⃣ enrich weather with UV
    const uv = await fetchUVIndex(normalized.lat, normalized.lon);
    setWeatherData({ uvIndex: uv });

    return { weather: normalized };
  } catch (err) {
    console.error("getWeatherByLocation failed:", err);
    return { error: "Failed to fetch location weather" };
  }
}
