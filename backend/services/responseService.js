import axios from "axios";

// ======================
// DISTANCE
// ======================

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;

  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// ======================
// FALLBACK RESPONDERS
// ======================

const buildFallbackResponders = (lat, lng, type) => {
  const lower = type.toLowerCase();

  if (lower.includes("fire")) {
    return [
      {
        name: "Nearest Fire Station",
        lat: lat + 0.003,
        lng: lng + 0.002,
        distance: "1.0",
        type: "fire",
        status: "enroute",
        eta: 4,
      },
    ];
  }

  if (lower.includes("medical")) {
    return [
      {
        name: "Nearest Hospital",
        lat: lat + 0.002,
        lng: lng + 0.002,
        distance: "1.0",
        type: "medical",
        status: "enroute",
        eta: 3,
      },
    ];
  }

  if (lower.includes("crime")) {
    return [
      {
        name: "Nearest Police Station",
        lat: lat + 0.002,
        lng: lng + 0.002,
        distance: "1.0",
        type: "crime",
        status: "enroute",
        eta: 5,
      },
    ];
  }

  return [
    {
      name: "Emergency Response Unit",
      lat: lat + 0.002,
      lng: lng + 0.002,
      distance: "1.0",
      type: "general",
      status: "enroute",
      eta: 4,
    },
  ];
};

// ======================
// GET RESPONDERS
// ======================

export const getNearbyResponders = async (lat, lng, type) => {
  try {
    const API_KEY = process.env.GEOAPIFY_KEY;

    let category = "healthcare.hospital";

    const lowerType = type.toLowerCase();

    // ======================
    // CATEGORY
    // ======================

    if (lowerType.includes("fire")) {
      category = "service.fire_station";
    } else if (lowerType.includes("crime")) {
      category = "service.police";
    } else if (lowerType.includes("medical")) {
      category = "healthcare.hospital";
    }

    const url = `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lng},${lat},10000&bias=proximity:${lng},${lat}&limit=10&apiKey=${API_KEY}`;

    console.log("GEO URL:", url);

    const response = await axios.get(url);

    const features = response.data.features || [];

    let responders = features.map((item) => {
      const props = item.properties;

      const responderLat = props.lat;

      const responderLng = props.lon;

      const distance = calculateDistance(lat, lng, responderLat, responderLng);

      return {
        name: props.name || "Unknown Responder",

        lat: responderLat,

        lng: responderLng,

        distance: distance.toFixed(1),
      };
    });

    // ======================
    // FALLBACK
    // ======================

    if (responders.length === 0) {
      console.log("NO RESPONDERS FOUND -> FALLBACK");

      responders = buildFallbackResponders(lat, lng, type);
    }

    console.log("RESPONDERS:", responders);

    return responders;
  } catch (err) {
    console.log("RESPONDER ERROR:", err.message);

    return buildFallbackResponders(lat, lng, type);
  }
};
