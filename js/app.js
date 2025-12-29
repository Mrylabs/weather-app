import {
  handleCitySearch,
  handleEnterKey,
  handleLocationRequest,
  handleUnitToggle,
  initControllerOnLoad
} from "./controller.js";

import { initFavorites } from "./use-cases/favorites/favorites.js";
import { renderFavoriteCities } from "./UI/favoritesUI.js";
import { setupFavoriteDropdown } from "./UI/favoritesDropdown.js";

const searchBtn = document.querySelector(".search-btn");
const cityInput = document.querySelector(".search-input");
const unitToggle = document.querySelector(".unit-toggle");
const locationBtn = document.querySelector(".get-location-btn");

searchBtn.addEventListener("click", () => {
  handleCitySearch(cityInput.value.trim());
});

cityInput.addEventListener("keydown", (e) => {
  handleEnterKey(e, cityInput);
});

locationBtn.addEventListener("click", handleLocationRequest);
unitToggle.addEventListener("click", handleUnitToggle);

window.addEventListener("load", () => {
  const favorites = initFavorites();
  renderFavoriteCities(favorites);
  setupFavoriteDropdown();
  initControllerOnLoad();
});
