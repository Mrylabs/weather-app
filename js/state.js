export const appState = {
  city: "",
  weather: {
    city: null,
    lat: null,
    lon: null,

    // temperature
    temp: null,
    feelsLike: null,

    // atmosphere
    humidity: null,
    wind: null,
    description: "",
    main: "",
    clouds: 0,
    rainVolume: 0,
    snowVolume: 0,

    // enrichments
    uvIndex: null,
    airQuality: {
      index: null,
      level: "Unavailable",
      color: "gray",
    },
  },

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
