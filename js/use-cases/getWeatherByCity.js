import { appState, saveCity, setWeatherData, setDayMode } from "../state.js";
import { fetchWeatherByCity, fetchDailyForecast } from "../services/weatherService.js";

export async function getWeatherByCity(city) {
  saveCity(city);

  try {
    const data = await fetchWeatherByCity(city, appState.unit);

    if (data.cod !== 200) {
      return { error: "City not found" };
    }

    setWeatherData(data);

    const { lat, lon } = data.coord;
    const forecastData = await fetchDailyForecast(lat, lon, appState.unit);

    const now = data.dt;
    const { sunrise, sunset } = data.sys;
    setDayMode(now >= sunrise && now < sunset);

    return {
      weather: data,
      forecast: forecastData.daily
    };
  } catch (err) {
    return { error: "Network error" };
  }
}
