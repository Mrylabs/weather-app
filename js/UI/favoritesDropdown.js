import { elements } from "./elements.js";
import { handleCitySearch } from "../controller.js";
import { removeFavorite, isFavorite } from "../use-cases/favorites/favorites.js";
import { renderFavoriteCities, updateFavoriteButton } from "./favoritesUI.js";
import { appState } from "../state.js";

export function setupFavoriteDropdown() {
  const toggleBtn = elements.favoriteDropdownToggle;
  const dropdownList = elements.favoriteDropdownList;

  if (!toggleBtn || !dropdownList) return;

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownList.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".favorite-dropdown")) {
      dropdownList.classList.add("hidden");
    }
  });

  dropdownList.addEventListener("click", async (e) => {
    e.stopPropagation();

    const removeBtn = e.target.closest(".remove-fav");
    const item = e.target.closest(".favorite-item");
    const city = item?.dataset.city;

    if (removeBtn && city) {
      const favorites = removeFavorite(city);
      renderFavoriteCities(favorites);
      updateFavoriteButton(isFavorite(appState.city));
      return;
    }

    if (item && city) {
      dropdownList.classList.add("hidden");
      await handleCitySearch(city);
    }
  });
}
