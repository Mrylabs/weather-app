import { elements } from "./elements.js";

let cloudInterval = null;

function createCloud(cloudType = "medium", isDay = true) {
  const cloudLayer = elements.cloudLayer;
  if (!cloudLayer) return;

  const cloud = document.createElement("div");
  cloud.classList.add("cloud");

  cloud.style.top = Math.random() * 60 + 10 + "vh";
  const speed = 50 + Math.random() * 40;
  cloud.style.animationDuration = `${speed}s`;
  cloud.style.transform = `scale(${0.8 + Math.random() * 0.6})`;

  let puffCount =
    cloudType === "thin" ? 2 + Math.floor(Math.random() * 2) :
    cloudType === "thick" ? 5 + Math.floor(Math.random() * 3) :
    3 + Math.floor(Math.random() * 3);

  for (let i = 0; i < puffCount; i++) {
    const puff = document.createElement("div");
    puff.classList.add("cloud-puff");

    const size = 70 + Math.random() * 120;
    puff.style.width = `${size}px`;
    puff.style.height = `${size * 0.65}px`;
    puff.style.left = `${i * (size * 0.45)}px`;
    puff.style.top = `${Math.random() * 25 - 12}px`;

    // tint for day/night
    if (isDay) {
      puff.style.background = `radial-gradient(circle at 50% 50%,
        rgba(255,255,255,0.92) 0%,
        rgba(230,230,230,0.62) 60%,
        rgba(200,200,200,0.35) 100%)`;
      puff.style.boxShadow = "0 0 40px rgba(255,255,255,0.45)";
    } else {
      // nocturnal/dim clouds
      puff.style.background = `radial-gradient(circle at 50% 50%,
        rgba(180,200,220,0.14) 0%,
        rgba(130,150,170,0.16) 60%,
        rgba(90,110,130,0.08) 100%)`;
      puff.style.boxShadow = "0 0 32px rgba(120,140,170,0.06)";
    }

    puff.style.filter = "blur(8px)";
    puff.style.opacity = 0.75 + Math.random() * 0.1;

    cloud.appendChild(puff);
  }

  cloudLayer.appendChild(cloud);

  setTimeout(() => cloud.remove(), speed * 1000);
}

export function applyClouds(weatherMain, coverage = 0, isDay = true) {
  const cloudLayer = elements.cloudLayer;
  if (!cloudLayer || !weatherMain) return;


  cloudLayer.innerHTML = "";
  if (cloudInterval) clearInterval(cloudInterval);

  if (
    weatherMain.includes("clear") ||
    weatherMain.includes("haze") ||
    weatherMain.includes("mist") ||
    weatherMain.includes("fog")
  ) return;

  let type = "medium";
  let count = 2;
  if (coverage < 30) {
    type = "thin";
    count = 1;
  } else if (coverage < 60) {
    type = "medium";
    count = 2;
  } else {
    type = "thick";
    count = 4;
  }

  for (let i = 0; i < count; i++) createCloud(type, isDay);

  cloudInterval = setInterval(() => createCloud(type, isDay), 18000);
}
