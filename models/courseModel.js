const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  seats: { type: Number, required: true },
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

  schedule: [
    {
      day: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        required: true,
      },
      time: {
        type: String,
        enum: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);
