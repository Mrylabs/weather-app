const apiKey = "b2d857f1ee7b26af47c0d4d12a3b0e36";

export async function getWeather(city) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    return data;
  }