const Course = require("../models/courseModel");
const Student = require("../models/studentModel");
const Admin = require("../models/adminModels");

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful", admin });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { code, name, department, seats } = req.body;
    const newCourse = await Course.create({ code, name, department, seats });
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: "Error adding course", error });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { name, department, seats } = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { name, department, seats },
      { new: true }
    );
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
};

exports.registerStudent = async (req, res) => {
  try {
    const { rollNumber, courseCode } = req.body;
    const student = await Student.findOne({ rollNumber });
    const course = await Course.findOne({ code: courseCode });

    if (!student || !course) {
      return res.status(404).json({ message: "Student or Course not found" });
    }

    student.registeredCourses.push(course._id);
    await student.save();

    res.json({ message: "Student registered successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Error registering student", error });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("registeredCourses");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const reportType = req.params.type;

    if (reportType === "students") {
      const students = await Student.find().populate("registeredCourses");
      return res.json(students);
    } else if (reportType === "courses") {
      const courses = await Course.find({ seats: { $gt: 0 } });
      return res.json(courses);
    } else if (reportType === "prerequisites") {
      const students = await Student.find().populate("registeredCourses");
      const missingPrereqs = students.filter((student) =>
        student.registeredCourses.some(
          (course) => course.prerequisites.length > 0
        )
      );
      return res.json(missingPrereqs);
    } else {
      return res.status(400).json({ message: "Invalid report type" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error generating report", error });
  }
};
