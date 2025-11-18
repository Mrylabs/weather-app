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

export async function getDailyForecast(lat, lon, unit = "metric") {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`
  );

  const data = await response.json();

  // Group by day
  const dayBuckets = {};

  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toISOString().split("T")[0]; // "2025-11-16"

    if (!dayBuckets[dayKey]) {
      dayBuckets[dayKey] = [];
    }

    dayBuckets[dayKey].push(item.main.temp);
  });

  // Convert into daily averages (or you can pick noon values)
  const daily = Object.keys(dayBuckets).slice(0, 5).map(dateKey => {
    const temps = dayBuckets[dateKey];
    const avg = temps.reduce((a, b) => a + b) / temps.length;

    return {
      dt: new Date(dateKey).getTime() / 1000,
      temp: { day: avg }
    };
  });

  return { daily };
}
