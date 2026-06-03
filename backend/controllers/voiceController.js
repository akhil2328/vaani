import Crisis from "../models/Crisis.js";

import { processVoiceText } from "../services/aiService.js";

import { getNearbyResponders } from "../services/responseService.js";

// ======================
// HANDLE VOICE
// ======================

export const handleVoice = async (req, res) => {
  try {
    const { text } = req.body;

    console.log("BODY:", req.body);

    // ======================
    // AI PROCESSING
    // ======================

    const result = await processVoiceText(text);

    // ======================
    // RESPONDERS
    // ======================

    const responders = await getNearbyResponders(
      result.location.lat,

      result.location.lng,

      result.type,
    );

    // SAVE RESPONDERS

    result.responders = responders;

    // ======================
    // SAVE DATABASE
    // ======================

    const saved = await Crisis.create(result);

    // ======================
    // SOCKET
    // ======================

    const io = req.app.get("io");

    io.emit("new_crisis", saved);

    // ======================
    // RESPONSE
    // ======================

    res.json(saved);
  } catch (err) {
    console.log("VOICE ERROR:", err.message);

    res.status(500).json({
      error: "Voice processing failed",
    });
  }
};
