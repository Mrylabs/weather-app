import { elements } from "./UI/elements.js";
import { appState, setUnit } from "./state.js";
import { renderWeather } from "./UI/weatherUI.js";
import { renderFavoriteCities, updateFavoriteButton } from "./UI/favoritesUI.js";
import { getWeatherByCity } from "./use-cases/getWeatherByCity.js";
import { getWeatherByLocation } from "./use-cases/getWeatherByLocation.js";
import {
  initFavorites,
  toggleFavorite,
  isFavorite,
} from "./use-cases/favorites/favorites.js";
import { renderError } from "./UI/weatherUI.js";

export async function handleCitySearch(city) {
  if (!city) {
    renderError("Please enter a city");
    return;
  }

  const result = await getWeatherByCity(city);
  if (result?.error) {
    renderError(result.error);
    return;
  }

  updateFavoriteButton(isFavorite(city));
  renderWeather(appState);
}

export function handleAddFavorite() {
  const favorites = toggleFavorite(appState.city);
  updateFavoriteButton(isFavorite(appState.city));
  renderFavoriteCities(favorites);
}

export async function handleLocationRequest() {
  if (!navigator.geolocation) {
    return handleCitySearch("Vienna");
  }

  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      const result = await getWeatherByLocation(
        coords.latitude,
        coords.longitude
      );

      if (result?.error) {
        handleCitySearch("Vienna");
        return;
      }

      updateFavoriteButton(isFavorite(appState.city));
      renderWeather(appState);
    },
    () => handleCitySearch("Vienna")
  );
}

export function handleUnitToggle() {
  const newUnit = appState.unit === "metric" ? "imperial" : "metric";
  setUnit(newUnit);
  localStorage.setItem("unit", newUnit);

  if (appState.city) handleCitySearch(appState.city);
}

export function initControllerOnLoad() {
  const favorites = initFavorites();
  renderFavoriteCities(favorites);

  elements.addFavoriteBtn.addEventListener("click", handleAddFavorite);

  if (appState.city) {
    handleCitySearch(appState.city);
  } else {
    handleLocationRequest();
  }
}

export function handleEnterKey(e, cityInput) {
  if (e.key === "Enter") {
    handleCitySearch(cityInput.value.trim());
  }
}
