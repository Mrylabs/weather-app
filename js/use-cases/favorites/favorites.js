import { appState, setFavorites } from "../../state.js";
import {
  loadFavoritesFromStorage,
  saveFavoritesToStorage,
} from "./storage.js";

export function initFavorites() {
  const favorites = loadFavoritesFromStorage();
  setFavorites(favorites);
  return favorites;
}

export function toggleFavorite(city) {
  if (!city) return appState.favorites;

  let favorites;

  if (appState.favorites.includes(city)) {
    favorites = appState.favorites.filter((c) => c !== city);
  } else {
    favorites = [...appState.favorites, city];
  }

  setFavorites(favorites);
  saveFavoritesToStorage(favorites);
  return favorites;
}

export function removeFavorite(city) {
  const favorites = appState.favorites.filter((c) => c !== city);
  setFavorites(favorites);
  saveFavoritesToStorage(favorites);
  return favorites;
}

export function isFavorite(city) {
  return appState.favorites.includes(city);
}
