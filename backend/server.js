import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import voiceRoutes from "./routes/voiceRoutes.js";
import crisisRoutes from "./routes/crisisRoutes.js";

const app = express();

// 🔥 Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());

// ======================
// API ROUTES
// ======================
app.use("/api/voice", voiceRoutes);
app.use("/api/crisis", crisisRoutes);

// ======================
// SERVE FRONTEND (IMPORTANT)
// ======================
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ======================
// DATABASE
// ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

// ======================
// SERVER + SOCKET
// ======================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
  transports: ["websocket"], // 🔥 important fix
});

app.set("io", io);