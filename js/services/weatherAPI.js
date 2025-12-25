const API_KEY = "b2d857f1ee7b26af47c0d4d12a3b0e36";

export async function fetchWeatherByCity(city, unit = "metric") {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`;
  console.log("🌐 Fetching weather:", url);
  return fetchJSON(url);
}

export async function fetchWeatherByCoords(lat, lon, unit = "metric") {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
  return fetchJSON(url);
}

/*export async function fetchDailyForecast(lat, lon, unit = "metric") {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`;
  console.log("🌐 Weather status:", raw);
  const raw = await fetchJSON(url);

  // --- Group into daily averages ---
  const dayBuckets = {};

  raw.list.forEach(entry => {
    const dateKey = new Date(entry.dt * 1000).toISOString().split("T")[0];
    if (!dayBuckets[dateKey]) dayBuckets[dateKey] = [];
    dayBuckets[dateKey].push(entry.main.temp);
  });

  const daily = Object.keys(dayBuckets).slice(0, 5).map(dateKey => {
    const temps = dayBuckets[dateKey];
    const avg = temps.reduce((a, b) => a + b) / temps.length;

    return {
      dt: new Date(dateKey).getTime() / 1000,
      temp: { day: avg },
    };
  });

  return { daily };
}*/

export async function fetchUVIndex(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/uvi?appid=${API_KEY}&lat=${lat}&lon=${lon}`;
  console.log("🌐 Weather status:", url);
  const res = await fetch(url);
  if (!res.ok) throw new Error("UV fetch failed");
  const data = await res.json();

  return data.value;
}

export async function fetchAirQuality(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  console.log("🌫️ Fetching AQI:", url);

  return fetchJSON(url);
}

// --- Shared reusable fetch helper ---
async function fetchJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}
