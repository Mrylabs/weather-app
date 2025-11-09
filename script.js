const apiKey = "b2d857f1ee7b26af47c0d4d12a3b0e36";
const ui = {
  cityName: document.getElementById("city-name"),
  temperature: document.getElementById("temperature"),
  feelsLike: document.getElementById("feels-like"),
  humidity: document.getElementById("humidity"),
  description: document.getElementById("description"),
  wind: document.getElementById("wind"),
  icon: document.getElementById("weather-icon"),
  timeIcon: document.getElementById("time-icon"),
  message: document.getElementById("message"),
  input: document.getElementById("city-input"),
  button: document.getElementById("search-btn"),
};



ui.button.addEventListener("click", () => {
  const city = ui.input.value;
  getWeather(city);
});
ui.input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getWeather(ui.input.value);
  }
});

async function getWeather(city) {
  ui.message.textContent = "Loading...";
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      ui.message.textContent = "City not found 😢";
      ui.cityName.textContent = "";
      ui.temperature.textContent = "";
      ui.feelsLike.textContent = "";
      ui.humidity.textContent = "";
      ui.description.textContent = "";
      ui.wind.textContent = "";
      return;
    }

    ui.message.textContent = "";

    const weatherMain = data.weather[0].main.toLowerCase();

    const now = data.dt;
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;
    const isDay = now >= sunrise && now < sunset;

    const body = document.body;

    if (isDay) {
      body.style.background = "linear-gradient(to bottom, #87ceeb, #f0f8ff)"; 
    } else {
      body.style.background = "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)";
    }
    body.style.transition = "background 1s ease";

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

  
    ui.cityName.textContent = data.name;
    ui.temperature.textContent = `Temperature: ${data.main.temp}°C`;
    ui.feelsLike.textContent = `Feels like: ${data.main.feels_like}°C`;
    ui.humidity.textContent = `Humidity: ${data.main.humidity}%`;
    ui.description.textContent = data.weather[0].description;
    ui.wind.textContent = `${data.wind.speed} m/s`;
    ui.icon.textContent = emoji; 

  } catch (error) {
    console.error(error);
    ui.message.textContent = "Something went wrong. Please try again.";
  }
}

window.addEventListener("load", () => {
  getWeather("Vienna");
});

