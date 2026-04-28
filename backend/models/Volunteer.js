import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
  name: String,
  task: String,
  status: {
    type: String,
    default: "available"
  }
});

export default mongoose.model("Volunteer", volunteerSchema);