// /JS/UI/setupFavoriteDropdown.js
import { elements } from "./elements.js";
import { handleCitySearch } from "../controller.js";
import { loadFavorites, saveFavorites } from "../services/favoriteService.js";
import { renderFavoriteCities, updateFavoriteButton } from "./favoritesUI.js";
import { appState } from "../state.js";

export function setupFavoriteDropdown() {
  const toggleBtn = elements.favoriteDropdownToggle || document.querySelector(".favorite-toggle-btn");
  const dropdownList = elements.favoriteDropdownList || document.querySelector(".favorite-dropdown-list");

  if (!toggleBtn || !dropdownList) {
    console.warn("⚠️ Favorite dropdown elements missing");
    return;
  }

  // Toggle dropdown open/close
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent the document click handler from immediately closing it
    dropdownList.classList.toggle("hidden");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".favorite-dropdown")) {
      dropdownList.classList.add("hidden");
    }
  });

  // Handle clicks inside the dropdown: select or remove
  dropdownList.addEventListener("click", async (e) => {
    e.stopPropagation(); // keep clicks inside from bubbling to the document handler

    // Find the city from the clicked node or closest li
    const clickedRemove = e.target.closest(".remove-fav");
    const clickedItem = e.target.closest(".favorite-item");
    const city = (clickedItem && clickedItem.dataset.city) || (e.target && e.target.dataset.city);

    // If clicking the remove button (❌)
    if (clickedRemove && city) {
      let favorites = loadFavorites().filter((c) => c !== city);
      saveFavorites(favorites);
      renderFavoriteCities(favorites);

      // If the removed city was currently shown as favorited, update the star
      updateFavoriteButton(favorites.includes(appState.city));
      return;
    }

    // If clicking a city row (select it)
    if (clickedItem && city) {
      dropdownList.classList.add("hidden"); // close dropdown
      // delegate to controller to fetch & render
      await handleCitySearch(city);
      return;
    }

    // Otherwise ignore
  });
}

