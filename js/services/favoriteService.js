const STORAGE_KEY = "favoriteCities";

export function loadFavorites() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveFavorites(cities) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}
