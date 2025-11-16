const apiKey = "b2d857f1ee7b26af47c0d4d12a3b0e36";

export async function getWeather(city, unit = "metric") {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`
  );
  const data = await response.json();
  return data;
}

  export async function getWeatherByCoords(lat, lon, unit = "metric") {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`
  );
  const data = await response.json();
  return data;
}
