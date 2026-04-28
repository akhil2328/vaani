import Volunteer from "../models/Volunteer.js";

export const getVolunteers = async (req, res) => {
  const data = await Volunteer.find();
  res.json(data);
};

export const assignTask = async (req, res) => {
  const { id, task } = req.body;

  const volunteer = await Volunteer.findByIdAndUpdate(
    id,
    { task, status: "busy" },
    { new: true }
  );

  res.json(volunteer);
};