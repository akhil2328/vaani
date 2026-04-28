import express from "express";
import Volunteer from "../models/Volunteer.js";
import {
  getVolunteers,
  assignTask
} from "../controllers/volunteerController.js";

const router = express.Router();

// ✅ Get all volunteers
router.get("/", getVolunteers);

// ✅ Assign task to volunteer
router.post("/assign", assignTask);

// ✅ Add new volunteer (NEW ROUTE)
router.post("/add", async (req, res) => {
  try {
    const { name } = req.body;

    const v = await Volunteer.create({ name });

    res.json(v);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;