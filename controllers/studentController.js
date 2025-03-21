const Student = require("../models/studentModel");
const Course = require("../models/courseModel");

exports.studentLogin = async (req, res) => {
  try {
    const { rollNumber } = req.body;
    const student = await Student.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error in student login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getStudentSchedule = async (req, res) => {
  try {
    const { rollNumber } = req.query;
    const student = await Student.findOne({ rollNumber }).populate(
      "registeredCourses"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student.registeredCourses);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ message: "Server error fetching schedule" });
  }
};
exports.registerCourse = async (req, res) => {
  const { rollNumber, courseId } = req.body;

  const student = await Student.findOne({ rollNumber });
  const course = await Course.findById(courseId);

  if (!student) return res.status(404).json({ message: "Student not found" });
  if (!course) return res.status(404).json({ message: "Course not found" });

  if (student.registeredCourses.includes(courseId)) {
    return res
      .status(400)
      .json({ message: "You are already registered for this course" });
  }

  if (course.seats <= 0) {
    return res.status(400).json({ message: "No seats available" });
  }

  student.registeredCourses.push(courseId);
  course.seats -= 1;

  await student.save();
  await course.save();

  res.json({ message: "Course registered successfully", course });
};

exports.getFilteredCourses = async (req, res) => {
  try {
    const { department } = req.query;
    let query = {};

    if (department) {
      query.department = department;
    }

    const courses = await Course.find(query);
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching filtered courses:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getPrerequisites = async (req, res) => {
  try {
    const { courseCode } = req.params;
    if (!courseCode) {
      return res.status(400).json({ message: "Course code is required." });
    }

    const course = await Course.findOne({ code: courseCode }).populate(
      "prerequisites"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course.prerequisites || []);
  } catch (error) {
    console.error("Error fetching prerequisites:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
exports.getAvailableSeats = async (req, res) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);

  if (!course) return res.status(404).json({ message: "Course not found" });

  res.json({ courseId, availableSeats: course.seats });
};
