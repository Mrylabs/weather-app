export function normalizeWeather(apiData, unit = "metric") {
  const dt = apiData.dt;
  const sunrise = apiData.sys.sunrise;
  const sunset = apiData.sys.sunset;

  const isDay = dt >= sunrise && dt < sunset;

  return {
    city: apiData.name,

    // coordinates
    lat: apiData.coord.lat,
    lon: apiData.coord.lon,

    // temperature
    temp: Math.round(apiData.main.temp),
    feelsLike: Math.round(apiData.main.feels_like),

    // atmosphere
    humidity: apiData.main.humidity,
    wind: apiData.wind.speed,
    description: apiData.weather[0]?.description ?? "",
    main: apiData.weather?.[0]?.main?.toLowerCase() ?? "clear",

    // visuals helpers
    clouds: apiData.clouds?.all ?? 0,
    rainVolume:
      apiData.rain?.["1h"] ??
      apiData.rain?.["3h"] ??
      0,
    snowVolume:
      apiData.snow?.["1h"] ??
      apiData.snow?.["3h"] ??
      0,

    // derived state
    isDay,
  };
}
