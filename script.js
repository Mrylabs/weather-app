const apiKey = "b2d857f1ee7b26af47c0d4d12a3b0e36";
const cityInput = document.getElementById("city-input");
const message = document.getElementById("message");
const searchBtn = document.getElementById("search-btn");

const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const wind = document.getElementById("wind");
const icon = document.getElementById("weather-icon");


searchBtn.addEventListener("click", () => {
  const city = cityInput.value;
  getWeather(city);
});
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getWeather(cityInput.value);
  }
});

async function getWeather(city) {
  message.textContent = "Loading...";
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      message.textContent = "City not found 😢";
      cityName.textContent = "";
      temperature.textContent = "";
      description.textContent = "";
      wind.textContent = "";
      return;
    }

    message.textContent = "";

    const weatherMain = data.weather[0].main.toLowerCase();

    const now = data.dt;
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;
    const isDay = now >= sunrise && now < sunset;

    const body = document.body;

    // simple day/night backgrounds
    if (isDay) {
      body.style.background = "linear-gradient(to bottom, #87ceeb, #f0f8ff)"; 
    } else {
      body.style.background = "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)";
    }
    body.style.transition = "background 1s ease";

    // show sun/moon icon
    const timeIcon = document.getElementById("time-icon");
    if (timeIcon) timeIcon.textContent = isDay ? "☀️" : "🌙";


    let emoji = "🌈";
    if (weatherMain.includes("clear")) {
    emoji = isDay ? "☀️" : "🌙";}
    else if (weatherMain.includes("cloud")) emoji = "☁️";
    else if (weatherMain.includes("rain")) emoji = "🌧️";
    else if (weatherMain.includes("snow")) emoji = "❄️";
    else if (weatherMain.includes("thunder")) emoji = "⚡";
    else if (weatherMain.includes("mist")) emoji = "🌫️"; 

  
    cityName.textContent = data.name;
    temperature.textContent = `Temperature: ${data.main.temp}°C`;
    description.textContent = data.weather[0].description;
    wind.textContent = `${data.wind.speed} m/s`;
    icon.textContent = emoji; 

  } catch (error) {
    console.error(error);
    message.textContent = "Something went wrong. Please try again.";
  }
}

window.addEventListener("load", () => {
  getWeather("Vienna");
});

