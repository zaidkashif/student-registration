const express = require("express");
const router = express.Router();
const {
  adminLogin,
  addCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  registerStudent,
  getAllStudents,
  generateReport,
} = require("../controllers/adminController");

router.post("/login", adminLogin);

router.post("/courses/add", addCourse);
router.put("/courses/update/:id", updateCourse);
router.delete("/courses/delete/:id", deleteCourse);
router.get("/courses", getAllCourses);

router.post("/register-student", registerStudent);
router.get("/students", getAllStudents);

router.get("/reports/:type", generateReport);

module.exports = router;
