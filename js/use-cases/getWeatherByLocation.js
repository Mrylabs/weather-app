import { appState, setCity, setWeatherData, setDayMode } from "../state.js";
import {
  fetchWeatherByCoords,
  fetchUVIndex,
  fetchAirQuality,
} from "../services/weatherAPI.js";
import { normalizeWeather } from "./normalizeWeather.js";
import { normalizeAirQuality } from "./normalizeAirQuality.js";
import { fetchForecastByCoords } from "../services/weatherAPI.js";
import { normalizeForecast } from "./normalizeForecast.js";

export async function getWeatherByLocation(lat, lon) {
  try {
    const data = await fetchWeatherByCoords(lat, lon, appState.unit);

    if (data.cod !== 200) {
      return { error: "Location weather not found" };
    }

    const normalizedWeather = normalizeWeather(data, appState.unit);

    // 1️⃣ city from normalized weather
    setCity(normalizedWeather.city);

    // 2️⃣ base weather snapshot
    setWeatherData(normalizedWeather);

    // 3️⃣ day/night
    setDayMode(normalizedWeather.isDay);

    // 4️⃣ UV
    const uv = await fetchUVIndex(
      normalizedWeather.lat,
      normalizedWeather.lon
    );
    setWeatherData({ uvIndex: uv });

    // 5️⃣ AQI
    const airRaw = await fetchAirQuality(
      normalizedWeather.lat,
      normalizedWeather.lon
    );
    const normalizedAQI = normalizeAirQuality(airRaw);
    setWeatherData({ airQuality: normalizedAQI });
    
    // 6️⃣ Forecast enrichment
    const forecastRaw = await fetchForecastByCoords(
      normalizedWeather.lat,
      normalizedWeather.lon,
      appState.unit
    );

    const normalizedForecast = normalizeForecast(forecastRaw);
    setWeatherData({ forecast: normalizedForecast });

    return { weather: normalizedWeather };
  } catch (err) {
    console.error("getWeatherByLocation failed:", err);
    return { error: "Failed to fetch location weather" };
  }
}
