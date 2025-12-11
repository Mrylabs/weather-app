import { elements } from "./elements.js";

export function updateFavoriteButton(isFavorite) {
  if (!elements.addFavoriteBtn) return;

  elements.addFavoriteBtn.textContent = isFavorite ? "★" : "☆";
  elements.addFavoriteBtn.classList.toggle("favorited", isFavorite);
}

export function renderFavoriteCities(favorites) {
  if (!elements.favoriteDropdownList) return;

  elements.favoriteDropdownList.innerHTML = favorites
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
