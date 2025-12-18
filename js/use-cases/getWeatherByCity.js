import { appState, saveCity, setWeatherData, setDayMode } from "../state.js";
import { fetchWeatherByCity, fetchUVIndex } from "../services/weatherAPI.js";
import { normalizeWeather } from "./normalizeWeather.js";

export async function getWeatherByCity(city) {
  saveCity(city);

  try {
    const data = await fetchWeatherByCity(city, appState.unit);

    if (data.cod !== 200) {
      return { error: "City not found" };
    }

    const normalized = normalizeWeather(data, appState.unit);
    setWeatherData(normalized);
    setDayMode(normalized.isDay);

    const uv = await fetchUVIndex(normalized.lat, normalized.lon);
    setWeatherData({ uvIndex: uv });

    return { weather: normalized };
  } catch (err) {
    console.error("getWeatherByCity failed:", err);
    return { error: "Network error" };
  }
}
