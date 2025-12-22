const STORAGE_KEY = "favoriteCities";

export function loadFavoritesFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveFavoritesToStorage(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}
