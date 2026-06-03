import mongoose from "mongoose";

// ======================
// CRISIS SCHEMA
// ======================

const crisisSchema = new mongoose.Schema(
  {
    // ======================
    // BASIC INFO
    // ======================

    text: {
      type: String,

      required: true,
    },

    type: {
      type: String,

      default: "General Emergency",
    },

    severity: {
      type: String,

      default: "medium",
    },

    summary: {
      type: String,

      default: "",
    },

    // ======================
    // AI METRICS
    // ======================

    confidence: {
      type: Number,

      default: 80,
    },

    threatScore: {
      type: String,

      default: "4.0",
    },

    // ======================
    // STATUS
    // ======================

    status: {
      type: String,

      default: "pending",
    },

    // ======================
    // LOCATION
    // ======================

    location: {
      name: {
        type: String,

        default: "Unknown",
      },

      lat: {
        type: Number,

        default: 0,
      },

      lng: {
        type: Number,

        default: 0,
      },
    },

    // ======================
    // RESPONDERS
    // ======================

    responders: [
      {
        name: String,

        lat: Number,

        lng: Number,

        distance: Number,
      },
    ],
  },

  {
    timestamps: true,
  },
);

// ======================
// EXPORT
// ======================

export default mongoose.model(
  "Crisis",

  crisisSchema,
);
