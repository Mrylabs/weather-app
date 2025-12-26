import { appState, setCity, setWeatherData, setDayMode } from "../state.js";
import {
  fetchWeatherByCity,
  fetchUVIndex,
  fetchAirQuality,
} from "../services/weatherAPI.js";
import { normalizeWeather } from "./normalizeWeather.js";
import { normalizeAirQuality } from "./normalizeAirQuality.js";
import { fetchForecastByCoords } from "../services/weatherAPI.js";
import { normalizeForecast } from "./normalizeForecast.js";

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

    // 5️⃣ Forecast enrichment
    const forecastRaw = await fetchForecastByCoords(
      normalizedWeather.lat,
      normalizedWeather.lon,
      appState.unit
    );

    const normalizedForecast = normalizeForecast(forecastRaw);
    setWeatherData({ forecast: normalizedForecast });

    return { weather: normalizedWeather };
  } catch (err) {
    console.error("getWeatherByCity failed:", err);
    return { error: "Network error" };
  }
}
