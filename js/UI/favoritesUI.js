import { elements } from "./elements.js";

// Update the Add / Remove Favorite Button
export function updateFavoriteButton(isFavorite) {
  if (!elements.addFavoriteBtn) return;

  elements.addFavoriteBtn.textContent = isFavorite
    ? "★ Favorited"
    : "☆ Add to Favorites";

  elements.addFavoriteBtn.classList.toggle("favorited", isFavorite);
}


// Render Favorite Cities List
export function renderFavoriteCities(favorites) {
  if (!elements.favoriteList) return;

  elements.favoriteList.innerHTML = favorites
    .map(
      (city) => `
      <li class="favorite-item" data-city="${city}">
        <span class="favorite-name">${city}</span>
        <button class="remove-fav" data-city="${city}">❌</button>
      </li>
    `
    )
    .join("");
}
