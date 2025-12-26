export function normalizeForecast(rawForecast) {
  if (!rawForecast?.list) return [];

  const days = {};

  rawForecast.list.forEach(entry => {
    const dateKey = new Date(entry.dt * 1000)
      .toISOString()
      .split("T")[0];

    if (!days[dateKey]) {
      days[dateKey] = {
        temps: [],
        label: new Date(entry.dt * 1000).toLocaleDateString("en-US", {
          weekday: "short",
        }),
      };
    }

    days[dateKey].temps.push(entry.main.temp);
  });

  return Object.values(days)
    .slice(0, 5)
    .map(day => ({
      label: day.label,
      min: Math.round(Math.min(...day.temps)),
      max: Math.round(Math.max(...day.temps)),
    }));
}
