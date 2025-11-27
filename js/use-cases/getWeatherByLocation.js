import { appState, saveCity, setWeatherData } from "../state.js";
import { fetchWeatherByCoords } from "../services/weatherService.js";

export async function getWeatherByLocation(lat, lon) {
  try {
    const data = await fetchWeatherByCoords(lat, lon, appState.unit);

    setWeatherData(data);
    saveCity(data.name);

    return { weather: data };
  } catch (err) {
    return { error: "Failed to fetch coordinates weather" };
  }
}
