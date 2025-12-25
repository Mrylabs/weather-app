export function normalizeAirQuality(apiData) {
  const aqi = apiData?.list?.[0]?.main?.aqi ?? null;

  if (aqi === null) {
    return {
      index: null,
      level: "Unavailable",
    };
  }

  const levels = {
    1: "Good",
    2: "Fair",
    3: "Moderate",
    4: "Poor",
    5: "Very Poor",
  };

  return {
    index: aqi,
    level: levels[aqi] ?? "Unavailable",
  };
}
