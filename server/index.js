import "dotenv/config";
import express from "express";

const app = express();
const PORT = 3000;

// simple CORS (manual, no package)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/weather", async (req, res) => {
  try {
    const { lat, lon, city, unit = "metric" } = req.query;

    console.log("DEBUG city:", city);
    console.log("DEBUG API KEY:", process.env.WEATHER_API_KEY);

    let url;

    if (city) {
      // City-based request
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&units=${unit}&appid=${process.env.WEATHER_API_KEY}`;
    } else if (lat && lon) {
      // Coordinates-based request
      url = url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${process.env.WEATHER_API_KEY}`;
    } else {
      return res.status(400).json({
        error: "Provide either city or lat/lon",
      });
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("Weather fetch failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  console.log("API KEY loaded:", !!process.env.WEATHER_API_KEY);

});

app.get("/forecast", async (req, res) => {
  const { lat, lon, unit = "metric" } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${process.env.WEATHER_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  res.status(response.ok ? 200 : response.status).json(data);
});


app.listen(PORT, () => {
  console.log(`🌤️ Server running on http://localhost:${PORT}`);
});
