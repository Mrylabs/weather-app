export const appState = {
  city: "",
  weather: null,
  isDay: true,
  unit: "metric",
  favorites: [], 
};


export function loadStateFromStorage() {
  const savedCity = localStorage.getItem("lastCity");
  const savedUnit = localStorage.getItem("unit");
  const savedFavorites = localStorage.getItem("favorites");

  if (savedCity) appState.city = savedCity;
  if (savedUnit) appState.unit = savedUnit;

  if (savedFavorites) {
    try {
      appState.favorites = JSON.parse(savedFavorites);
    } catch {
      appState.favorites = [];
    }
  }
}


export function saveCity(city) {
  appState.city = city;
  localStorage.setItem("lastCity", city);
}

export function saveUnit(unit) {
  appState.unit = unit;
  localStorage.setItem("unit", unit);
}

export function setWeatherData(weather) {
  appState.weather = weather;
  return weather;
}

export function setDayMode(isDay) {
  appState.isDay = isDay;
}

export function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(appState.favorites));
}

export function addFavorite(city) {
  if (!appState.favorites.includes(city)) {
    appState.favorites.push(city);
    saveFavorites();
  }
}

export function removeFavorite(city) {
  appState.favorites = appState.favorites.filter(c => c !== city);
  saveFavorites();
}

export function isFavorite(city) {
  return appState.favorites.includes(city);
}
