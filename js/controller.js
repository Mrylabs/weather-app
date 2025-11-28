import { appState, loadStateFromStorage, saveUnit } from "./state.js";
import { renderWeather, renderError, renderForecast } from "./ui.js";
import { getWeatherByCity } from "./use-cases/getWeatherByCity.js";
import { getWeatherByLocation } from "./use-cases/getWeatherByLocation.js";

export async function handleCitySearch(city) {
  if (!city || !city.trim()) {
    renderError("Please enter a city");
    return;
  }

  const result = await getWeatherByCity(city);

  if (result.error) {
    renderError(result.error);
    return;
  }

  renderWeather(appState);
  renderForecast(result.forecast);
}

export function handleEnterKey(e, cityInput) {
  if (e.key === "Enter") {
    handleCitySearch(cityInput.value.trim());
  }
}

export async function handleLocationRequest() {
  if (!navigator.geolocation) {
    return handleCitySearch("Vienna");
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      const result = await getWeatherByLocation(latitude, longitude);

      if (result.error) {
        return handleCitySearch("Vienna");
      }

      renderWeather(appState);
    },
    () => handleCitySearch("Vienna")
  );
}

export function handleUnitToggle() {
  appState.unit = appState.unit === "metric" ? "imperial" : "metric";
  saveUnit(appState.unit);

  if (appState.city) {
    handleCitySearch(appState.city);
  }
}

export function handleAutoRefresh() {
  if (!appState.city) return;
  console.log("🔄 Auto-refreshing weather...");
  handleCitySearch(appState.city);
}

export function initControllerOnLoad() {
  loadStateFromStorage();

  if (appState.city) {
    handleCitySearch(appState.city);
  } else {
    handleLocationRequest();
  }

  setInterval(handleAutoRefresh, 10 * 60 * 1000);
}
