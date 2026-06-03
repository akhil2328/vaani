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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(cors());
app.use(express.json());

// api routes
app.use("/api/voice", voiceRoutes);
app.use("/api/crisis", crisisRoutes);

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

// fallback route
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

// server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// socket
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);
