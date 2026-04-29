export const elements = {
  cityTitle: document.getElementById("city-title"),
  temperature: document.getElementById("temperature"),

  feelsLike: document.querySelector("#feels-like .value"),
  humidity: document.querySelector("#humidity .value"),
  wind: document.querySelector("#wind .value"),
  uvBox: document.querySelector("#uv-index .value"),
  aqiBox: document.querySelector("#air-quality .value"),

  description: document.getElementById("description"),
  icon: document.getElementById("weather-icon"),
  message: document.querySelector(".error-message"),

  favoriteDropdownToggle: document.querySelector(".favorite-toggle-btn"),
  favoriteDropdownList: document.querySelector(".favorite-dropdown-list"),
  addFavoriteBtn: document.querySelector(".favorite-btn"),

  searchInput: document.querySelector(".search-input"),
  searchBtn: document.querySelector(".search-btn"),

  cloudLayer: document.getElementById("cloud-layer"),
  particleLayer: document.getElementById("weather-particles"),

  chartCanvas: document.getElementById("forecastChart"),
  forecastChart: document.getElementById("forecastChart"),
};
