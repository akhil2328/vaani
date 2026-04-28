import express from "express";
import { handleVoice } from "../controllers/voiceController.js";

const router = express.Router();

router.post("/", handleVoice);

export default router;