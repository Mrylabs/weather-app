export function normalizeWeather(apiData, unit = "metric") {
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
    main: apiData.weather[0]?.main?.toLowerCase() ?? "",

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

    // time
    dt: apiData.dt,
    sunrise: apiData.sys.sunrise,
    sunset: apiData.sys.sunset,

    unit
  };
}
