export const appState = {
  city: "",
  weather: {
  city: null,
  lat: null,
  lon: null,
  temp: null,
  feelsLike: null,
  humidity: null,
  wind: null,
  description: "",
  main: "",
  clouds: 0,
  rainVolume: 0,
  snowVolume: 0,
  uvIndex: null},
  isDay: true,
  unit: "metric",
  favorites: [],
};


export function setCity(city) {
  appState.city = city;
}

export function setUnit(unit) {
  appState.unit = unit;
}

export function setWeatherData(partial) {
  appState.weather = {
    ...appState.weather,
    ...partial,
  };
}

export function setDayMode(isDay) {
  appState.isDay = isDay;
}

export function setFavorites(favorites) {
  appState.favorites = favorites;
}
