import Crisis from "../models/Crisis.js";

// GET all
export const getAllCrisis = async (req, res) => {
  const data = await Crisis.find().sort({ createdAt: -1 });
  res.json(data);
};

// MARK AS COMPLETED
export const markCompleted = async (req, res) => {
  const { id } = req.params;

  const updated = await Crisis.findByIdAndUpdate(
    id,
    { status: "completed" },
    { new: true }
  );

  res.json(updated);
};

// DELETE COMPLETED
export const deleteCompleted = async (req, res) => {
  await Crisis.deleteMany({ status: "completed" });

  res.json({ message: "Completed tasks removed" });
};