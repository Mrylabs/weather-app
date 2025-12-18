import { elements } from "./UI/elements.js";
import { appState, loadStateFromStorage, saveUnit } from "./state.js";
import { updateFavoriteButton, renderFavoriteCities } from "./UI/favoritesUI.js";
import { renderWeather } from "./UI/weatherUI.js";
import { loadFavorites, saveFavorites } from "./services/favoriteService.js";
import { getWeatherByCity } from "./use-cases/getWeatherByCity.js";
import { getWeatherByLocation } from "./use-cases/getWeatherByLocation.js";

export function handleAddFavorite() {
  const city = appState.city;
  if (!city) return;

  let favorites = loadFavorites();

  if (!favorites.includes(city)) {
    favorites.push(city);
  } else {
    favorites = favorites.filter(c => c !== city);
  }

  saveFavorites(favorites);
  updateFavoriteButton(favorites.includes(city));
  renderFavoriteCities(favorites);
}

export function setupFavoriteListeners() {
  const list = elements.favoriteDropdownList;
  if (!list) return;

  list.addEventListener("click", (e) => {
    const city = e.target.dataset.city;

    if (e.target.classList.contains("remove-fav")) {
      let favorites = loadFavorites().filter(c => c !== city);
      saveFavorites(favorites);
      renderFavoriteCities(favorites);
      return;
    }

    const li = e.target.closest(".favorite-item");
    if (li) {
      handleCitySearch(li.dataset.city);
      elements.favoriteDropdownList.classList.add("hidden");
    }
  });
}

export function setupFavoriteDropdown() {
  elements.favoriteDropdownToggle.addEventListener("click", () => {
    elements.favoriteDropdownList.classList.toggle("hidden");
  });
}

export async function handleCitySearch(city) {
  if (!city || !city.trim()) {
    renderError("Please enter a city");
    return;
  }

  const result = await getWeatherByCity(city);
  if (result?.error) {
    renderError(result.error);
    return;
  }

  const favorites = loadFavorites();
  updateFavoriteButton(favorites.includes(city));

  renderWeather(appState);
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
      console.log("🧠 STATE AFTER FETCH:", appState.weather);
      renderWeather(appState);
    },
    () => handleCitySearch("Vienna")
  );
}

export function handleEnterKey(e, cityInput) {
  if (e.key === "Enter") {
    handleCitySearch(cityInput.value.trim());
  }
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
  handleCitySearch(appState.city);
}

export function initControllerOnLoad() {
  loadStateFromStorage();

  const favorites = loadFavorites();
  renderFavoriteCities(favorites);

  elements.addFavoriteBtn.addEventListener("click", handleAddFavorite);
  setupFavoriteDropdown();
  setupFavoriteListeners();

  if (appState.city) {
    handleCitySearch(appState.city);
  } else {
    handleLocationRequest();
  }

  setInterval(handleAutoRefresh, 10 * 60 * 1000);
}
