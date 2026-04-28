import express from "express";
import {
  getAllCrisis,
  markCompleted,
  deleteCompleted,
} from "../controllers/crisisController.js";

const router = express.Router();

router.get("/", getAllCrisis);

// mark completed
router.put("/complete/:id", markCompleted);

// delete completed
router.delete("/completed", deleteCompleted);

export default router;