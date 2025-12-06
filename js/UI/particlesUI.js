import { elements } from "./elements.js";

let particleInterval = null;
let thunderInterval = null;
let thunderTimeout = null;

function getParticleColor(isDay) {
  return isDay ? "rgba(255,255,255,0.95)" : "rgba(200,220,255,0.95)";
}
function getRainColor(isDay) {
  return isDay ? "rgba(255,255,255,0.45)" : "rgba(160,180,220,0.35)";
}

function ensureParticleContainer() {
  if (!elements.particleLayer) return null;
  elements.particleLayer.innerHTML = "";
  return elements.particleLayer;
}

// Rain
function startRain(intensity = "medium", isDay = true) {
  const layer = ensureParticleContainer();
  if (!layer) return;

  const color = getRainColor(isDay);
  const count = intensity === "light" ? 80 : intensity === "heavy" ? 260 : 150;

  for (let i = 0; i < count; i++) {
    const drop = document.createElement("div");
    drop.classList.add("raindrop");
    drop.style.left = Math.random() * 100 + "vw";
    drop.style.background = color;
    drop.style.animationDuration = 0.45 + Math.random() * 0.6 + "s";
    drop.style.animationDelay = Math.random() * 0.5 + "s";
    layer.appendChild(drop);
  }
}

// Snow
function startSnow(intensity = "medium", isDay = true) {
  const layer = ensureParticleContainer();
  if (!layer) return;

  const color = getParticleColor(isDay);
  const count = intensity === "light" ? 40 : intensity === "heavy" ? 140 : 85;

  for (let i = 0; i < count; i++) {
    const flake = document.createElement("div");
    flake.classList.add("snowflake");
    flake.style.left = Math.random() * 100 + "vw";
    flake.style.background = color;
    flake.style.opacity = 0.6 + Math.random() * 0.4;
    flake.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
    flake.style.animationDuration = 3 + Math.random() * 3 + "s";
    flake.style.animationDelay = Math.random() * 2 + "s";
    // subtle horizontal drift
    flake.style.setProperty("--drift", `${(Math.random() - 0.5) * 30}px`);
    layer.appendChild(flake);
  }
}

// Lightning (creates a temporary full-screen flash element)
function startThunderFlash() {
  const layer = elements.particleLayer;
  if (!layer) return;

  const flash = document.createElement("div");
  flash.className = "particle-flash";
  flash.style.position = "fixed";
  flash.style.inset = "0";
  flash.style.pointerEvents = "none";
  flash.style.background = "rgba(255,255,255,0.9)";
  flash.style.opacity = "0";
  flash.style.zIndex = 9999;
  flash.style.transition = "opacity 80ms linear";

  layer.appendChild(flash);

  // quick flash
  requestAnimationFrame(() => {
    flash.style.opacity = "1";
    setTimeout(() => {
      flash.style.opacity = "0";
      setTimeout(() => flash.remove(), 250);
    }, 70 + Math.random() * 180);
  });
}

function manageThunderFlashes() {
  if (!elements.particleLayer) return;

  clearInterval(particleInterval);
  clearInterval(thunderInterval);
  clearTimeout(thunderTimeout);

  thunderInterval = setInterval(() => {
    if (Math.random() < 0.45) startThunderFlash();
  }, 1200);
  // ensure we clear it after some time if you later call clearParticles()
}

// Cleanup
function clearParticles() {
  if (elements.particleLayer) elements.particleLayer.innerHTML = "";
  clearInterval(particleInterval);
  clearInterval(thunderInterval);
  clearTimeout(thunderTimeout);
  particleInterval = null;
  thunderInterval = null;
  thunderTimeout = null;
}

// Public API
export function applyParticles(condition, rainVolume = 0, snowVolume = 0, isDay = true) {
  clearParticles();
  condition = (condition || "").toLowerCase();

  if (condition.includes("drizzle")) {
    startRain("light", isDay);
    return;
  }

  if (condition.includes("rain")) {
    if (rainVolume === 0) startRain("light", isDay);
    else if (rainVolume < 5) startRain("medium", isDay);
    else startRain("heavy", isDay);
    return;
  }

  if (condition.includes("snow")) {
    if (snowVolume === 0) startSnow("light", isDay);
    else if (snowVolume < 4) startSnow("medium", isDay);
    else startSnow("heavy", isDay);
    return;
  }

  if (condition.includes("thunder")) {
    manageThunderFlashes();
    startRain("medium", isDay);
    return;
  }

  clearParticles();
}
