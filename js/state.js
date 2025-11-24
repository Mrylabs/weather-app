export const appState = {
  city: "",
  weather: null,
  isDay: true,
  unit: "metric",
};

export function loadStateFromStorage() {
  const savedCity = localStorage.getItem("lastCity");
  const savedUnit = localStorage.getItem("unit");

  if (savedCity) appState.city = savedCity;
  if (savedUnit) appState.unit = savedUnit;
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
