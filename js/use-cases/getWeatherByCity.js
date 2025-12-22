import { appState, setCity, setWeatherData, setDayMode } from "../state.js";
import { fetchWeatherByCity, fetchUVIndex } from "../services/weatherAPI.js";
import { normalizeWeather } from "./normalizeWeather.js";

export async function getWeatherByCity(city) {
  setCity(city);

  try {
    const data = await fetchWeatherByCity(city, appState.unit);

    if (data.cod !== 200) {
      return { error: "City not found" };
    }

    const normalized = normalizeWeather(data, appState.unit);

    // 1️⃣ set full weather snapshot
    setWeatherData(normalized);

    // 2️⃣ day/night comes FROM normalized data
    setDayMode(normalized.isDay);

    // 3️⃣ enrich weather with UV (same state object)
    const uv = await fetchUVIndex(normalized.lat, normalized.lon);
    setWeatherData({ uvIndex: uv });

    return { weather: normalized };
  } catch (err) {
    console.error("getWeatherByCity failed:", err);
    return { error: "Network error" };
  }
}
