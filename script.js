const apiKey = "b2d857f1ee7b26af47c0d4d12a3b0e36";
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const wind = document.getElementById("wind");


searchBtn.addEventListener("click", () => {
  const city = cityInput.value;
  getWeather(city);
});

async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    cityName.textContent = data.name;
    temperature.textContent = `Temperature: ${data.main.temp}°C`;
    description.textContent = data.weather[0].description;
    wind.textContent = `${data.wind.speed} m/s`;

  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}


