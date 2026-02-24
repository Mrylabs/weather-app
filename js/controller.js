import { elements } from "./UI/elements.js";
import { appState, setUnit } from "./state.js";
import { renderWeather } from "./UI/weatherUI.js";
import { renderFavoriteCities, updateFavoriteButton } from "./UI/favoritesUI.js";
import { getWeatherByCity } from "./use-cases/getWeatherByCity.js";
import { getWeatherByLocation } from "./use-cases/getWeatherByLocation.js";
import {
  initFavorites,
  toggleFavorite,
  isFavorite,
} from "./use-cases/favorites/favorites.js";
import { renderError } from "./UI/weatherUI.js";

const loader = document.getElementById("loader");

function showLoader() {
  loader?.classList.remove("hidden");
}
function hideLoader() {
  loader?.classList.add("hidden");
}


export async function handleCitySearch(city) {
  if (!city) {
    renderError("Please enter a city");
    return;
  }

  showLoader();

  try {
    const result = await getWeatherByCity(city);

    if (result?.error) {
      renderError(result.error);
      return;
    }

    updateFavoriteButton(isFavorite(city));
    renderWeather(appState);

  } catch (error) {
    renderError(error.message || "Something went wrong");
  } finally {
    hideLoader();
  }
}

export function handleAddFavorite() {
  const favorites = toggleFavorite(appState.city);
  updateFavoriteButton(isFavorite(appState.city));
  renderFavoriteCities(favorites);
}

export async function handleLocationRequest() {
  if (!navigator.geolocation) {
    return handleCitySearch("Vienna");
  }

  showLoader();

  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      try {
        const result = await getWeatherByLocation(
          coords.latitude,
          coords.longitude
        );

        if (result?.error) {
          handleCitySearch("Vienna");
          return;
        }

        updateFavoriteButton(isFavorite(appState.city));
        renderWeather(appState);

      } catch (error) {
        renderError(error.message || "Location failed");
      } finally {
        hideLoader();
      }
    },
    () => {
      hideLoader();
      handleCitySearch("Vienna");
    }
  );
}

export function handleUnitToggle() {
  const newUnit = appState.unit === "metric" ? "imperial" : "metric";
  setUnit(newUnit);
  localStorage.setItem("unit", newUnit);

  if (appState.city) handleCitySearch(appState.city);
}

export function initControllerOnLoad() {
  const favorites = initFavorites();
  renderFavoriteCities(favorites);

  elements.addFavoriteBtn.addEventListener("click", handleAddFavorite);

  if (appState.city) {
    handleCitySearch(appState.city);
  } else {
    handleLocationRequest();
  }
}

export function handleEnterKey(e, cityInput) {
  if (e.key === "Enter") {
    handleCitySearch(cityInput.value.trim());
  }
}
