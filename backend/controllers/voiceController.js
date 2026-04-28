import Crisis from "../models/Crisis.js";
import { processVoiceText } from "../services/aiService.js";

export const handleVoice = async (req, res) => {
  try {
    const text = req.body?.text;

    console.log("BODY:", req.body);

    if (!text) {
      return res.status(400).json({ error: "Text required" });
    }

    const aiResult = await processVoiceText(text);

    const crisis = await Crisis.create({
      text,
      type: aiResult.type,
      severity: aiResult.severity,
      location: aiResult.location,
      status: "pending",
    });

    const io = req.app.get("io");
    io.emit("new_crisis", crisis);

    res.json(crisis);

  } catch (err) {
    console.error("VOICE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};