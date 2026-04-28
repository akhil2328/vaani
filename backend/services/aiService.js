import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export const processVoiceText = async (text) => {
  const lower = text.toLowerCase();

  // =========================
  // 🔥 TYPE DETECTION
  // =========================
  let type = "General";

  if (lower.includes("fire")) type = "Fire Emergency";
  else if (lower.includes("accident")) type = "Accident";
  else if (lower.includes("medical")) type = "Medical Emergency";
  else if (lower.includes("flood")) type = "Flood";

  // =========================
  // 🔥 SEVERITY
  // =========================
  let severity = "low";

  if (["Fire Emergency", "Medical Emergency", "Accident"].includes(type))
    severity = "high";
  else if (type === "Flood") severity = "medium";

  // =========================
  // 🔥 PRECISE LOCATION EXTRACTION
  // =========================

  let locationText = "India";

  // Try extracting after keywords
  const match = text.match(
    /(in|at|near)\s+([a-zA-Z0-9,\s]+)/i
  );

  if (match && match[2]) {
    locationText = match[2].trim();
  } else {
    // fallback → last 3 words (better than 2)
    const words = text.split(" ");
    locationText = words.slice(-3).join(" ");
  }

  console.log("PRECISE LOCATION:", locationText);

  // =========================
  // 🌍 GEO (HIGH PRECISION)
  // =========================
  try {
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(locationText)}`
    );

    const geoData = await geoRes.json();

    if (geoData.length > 0) {
      return {
        type,
        severity,
        location: {
          name: geoData[0].display_name,
          lat: parseFloat(geoData[0].lat),
          lng: parseFloat(geoData[0].lon),
        },
      };
    }
  } catch (err) {
    console.log("GEO ERROR:", err);
  }

  // =========================
  // 🔥 SAFE FALLBACK
  // =========================
  return {
    type,
    severity,
    location: {
      name: locationText,
      lat: 20.5937,
      lng: 78.9629,
    },
  };
};