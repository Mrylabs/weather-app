import { getWeather } from "./api.js";
import {renderWeather, renderError} from "./ui.js";

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

async function handleSearch(defaultCity) {
  const city = defaultCity || cityInput.value;
  try {
    const data = await getWeather(city);
    if (data.cod !== 200) {
      renderError("City not found 😢");
      return;
    }
     renderWeather(data);
  } catch (err) {
    renderError("Something went wrong. Please try again.");
  }
}

searchBtn.addEventListener("click", handleSearch);
cityInput.addEventListener("keydown", (e) => {
if (e.key === "Enter") handleSearch();
});

window.addEventListener("load", () => handleSearch("Vienna"));
