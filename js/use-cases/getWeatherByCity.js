import { appState, setCity, setWeatherData, setDayMode } from "../state.js";
import {
  fetchWeatherByCity,
  fetchUVIndex,
  fetchAirQuality,
} from "../services/weatherAPI.js";
import { normalizeWeather } from "./normalizeWeather.js";
import { normalizeAirQuality } from "./normalizeAirQuality.js";

export async function getWeatherByCity(city) {
  setCity(city);

  try {
    const data = await fetchWeatherByCity(city, appState.unit);

    if (data.cod !== 200) {
      return { error: "City not found" };
    }

    const normalizedWeather = normalizeWeather(data, appState.unit);

    // 1️⃣ base weather snapshot
    setWeatherData(normalizedWeather);

    // 2️⃣ day/night derived from normalized weather
    setDayMode(normalizedWeather.isDay);

    // 3️⃣ UV enrichment
    const uv = await fetchUVIndex(
      normalizedWeather.lat,
      normalizedWeather.lon
    );
    setWeatherData({ uvIndex: uv });

    // 4️⃣ AQI enrichment (parallel domain)
    const airRaw = await fetchAirQuality(
      normalizedWeather.lat,
      normalizedWeather.lon
    );
    const normalizedAQI = normalizeAirQuality(airRaw);
    setWeatherData({ airQuality: normalizedAQI });

    return { weather: normalizedWeather };
  } catch (err) {
    console.error("getWeatherByCity failed:", err);
    return { error: "Network error" };
  }
}
