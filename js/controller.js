import { appState, loadStateFromStorage, saveUnit } from "./state.js";
import {renderError, renderForecast } from "./ui.js";
import { updateFavoriteButton, renderFavoriteCities } from "./UI/favoritesUI.js";
import { weatherUI, renderWeather } from "./UI/weatherUI.js";
import { loadFavorites, saveFavorites } from "./services/favoriteService.js";
import { getWeatherByCity } from "./use-cases/getWeatherByCity.js";
import { getWeatherByLocation } from "./use-cases/getWeatherByLocation.js";
import { getUVIndex, getAirQuality } from "./services/weatherService.js";

export function handleAddFavorite() {
  const city = appState.city;
  if (!city) return;

  let favorites = loadFavorites();

  if (!favorites.includes(city)) {
    favorites.push(city);
    saveFavorites(favorites);
  }

  updateFavoriteButton(true);
  renderFavoriteCities(favorites);
}

export function setupFavoriteListeners() {
  const list = document.getElementById("favorite-list");
  if (!list) return;

  list.addEventListener("click", async (e) => {
    const city = e.target.dataset.city;
    if (!city) return;

    // Remove favorite
    if (e.target.matches(".remove-fav")) {
      let favorites = loadFavorites().filter(c => c !== city);
      saveFavorites(favorites);
      renderFavoriteCities(favorites);
      return;
    }

    // Select favorite city
    if (e.target.matches(".favorite-item, .favorite-name")) {
      const result = await getWeatherByCity(city);

      if (result.error) {
        renderError(result.error);
        return;
      }

      appState.city = city;
      renderWeather(appState);
      renderForecast(result.forecast);
    }
  });
}

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

  appState.city = city;
  appState.weather = result.weather; 
  appState.unit = appState.unit || "metric"; 

  const lat = result.weather.coord.lat;
  const lon = result.weather.coord.lon;

   const [uv, aqi] = await Promise.all([
     getUVIndex(lat, lon),
     getAirQuality(lat, lon),
    ]);

  appState.uvIndex = uv;
  appState.airQuality = aqi;

  const favorites = loadFavorites();
  updateFavoriteButton(favorites.includes(city));

  renderWeather(appState);
  weatherUI.updateUV(uv);
  weatherUI.updateAQI(aqi);
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
      appState.city = result.weather.name;
      appState.weather = result.weather;

      // UV + AQI
      const lat = result.weather.coord.lat;
      const lon = result.weather.coord.lon;

      const [uv, aqi] = await Promise.all([
        getUVIndex(lat, lon),
        getAirQuality(lat, lon),
      ]);

      appState.uvIndex = uv;
      appState.airQuality = aqi;

      renderWeather(appState);
      weatherUI.updateUV(uv);
      weatherUI.updateAQI(aqi);
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

  // Render favorites on startup
  const favorites = loadFavorites();
  renderFavoriteCities(favorites);

  setupFavoriteListeners();

  if (appState.city) {
    handleCitySearch(appState.city);
  } else {
    handleLocationRequest();
  }

  setInterval(handleAutoRefresh, 10 * 60 * 1000);
}
