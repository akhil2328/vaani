import mongoose from "mongoose";

const crisisSchema = new mongoose.Schema({
  text: String,
  type: String,
  severity: String,

  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },

  location: {
    name: String,
    lat: Number,
    lng: Number,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Crisis", crisisSchema);