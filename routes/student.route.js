const express = require("express");
const {
  studentLogin,
  getStudentSchedule,
  registerCourse,
  getFilteredCourses,
  getPrerequisites,
  getAvailableSeats,
} = require("../controllers/studentController");

const router = express.Router();
router.post("/login", studentLogin);
router.get("/schedule", getStudentSchedule);
router.post("/register", registerCourse);
router.get("/filter", getFilteredCourses);
router.get("/prerequisites/:courseCode", getPrerequisites);
router.get("/seats/:courseId", getAvailableSeats);

module.exports = router;
