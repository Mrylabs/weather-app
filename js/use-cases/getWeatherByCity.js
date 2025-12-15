import { appState, saveCity, setWeatherData, setDayMode } from "../state.js";
import { fetchWeatherByCity } from "../services/weatherService.js";
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

    const now = data.dt;
    const { sunrise, sunset } = data.sys;
    setDayMode(now >= sunrise && now < sunset);

    return {};
  } catch (err) {
    return { error: "Network error" };
  }
}
