/*import { elements } from "./elements.js";

let flareCircles = [];

// INITIAL SETUP — create the flare circles only once
export function initSun() {
  if (!elements.sunFlare) return;

  elements.sunFlare.innerHTML = "";
  flareCircles = [];

  for (let i = 0; i < 3; i++) {
    const circle = document.createElement("div");
    circle.classList.add("flare-circle");

    const size = 120 + i * 50;
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;

    circle.style.top = `${-(size / 3)}px`;
    circle.style.left = `${-(size / 3)}px`;

    flareCircles.push(circle);
    elements.sunFlare.appendChild(circle);
  }
}


// INTERNAL — fade intensity based on cloud coverage
function updateSunIntensity(weatherMain, cloudCover) {
  if (!elements.sunFlare) return;

  // Full Sun → Only when sky is truly clear
  if (weatherMain.includes("clear") && cloudCover < 20) {
    elements.sunFlare.style.opacity = "1";
    return;
  }

  // Partial → Light haze or 20–60% clouds
  if (cloudCover >= 20 && cloudCover < 60) {
    elements.sunFlare.style.opacity = "0.5";
    return;
  }

  // Mostly cloudy → very dim
  if (cloudCover >= 60 && cloudCover < 90) {
    elements.sunFlare.style.opacity = "0.2";
    return;
  }

  // Heavy clouds (or fog/mist) → sun hidden
  elements.sunFlare.style.opacity = "0";
}


// PUBLIC — called once per weather update
export function applySun(isDay, weatherMain, cloudCover) {
  if (!elements.sunFlare) return;

  // Never show sun at night
  if (!isDay) {
    elements.sunFlare.style.opacity = "0";
    return;
  }

  updateSunIntensity(weatherMain.toLowerCase(), cloudCover);
}*/
