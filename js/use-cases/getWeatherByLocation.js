import { appState, saveCity, setWeatherData, setDayMode } from "../state.js";
import { fetchWeatherByCoords, fetchUVIndex } from "../services/weatherAPI.js";
import { normalizeWeather } from "./normalizeWeather.js";

export async function getWeatherByLocation(lat, lon) {
  try {
    const data = await fetchWeatherByCoords(lat, lon, appState.unit);

    if (data.cod !== 200) {
      return { error: "Location not found" };
    }

    const normalized = normalizeWeather(data, appState.unit);
    setWeatherData(normalized);
    saveCity(normalized.city);

    const uv = await fetchUVIndex(normalized.lat, normalized.lon);
    setWeatherData({ uvIndex: uv });

    setDayMode(normalized.isDay);

    return { weather: normalized };
  } catch (err) {
    console.error("getWeatherByLocation failed:", err);
    return { error: "Failed to fetch coordinates weather" };
  }
}
