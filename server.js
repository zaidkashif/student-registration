const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const database = require("./database/db");
const StudentRoutes = require("./routes/student.route");
const AdminRoutes = require("./routes/adminRoutes");
require("dotenv").config();

const app = express();
database();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/students", StudentRoutes);
app.use("/api/admin", AdminRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.get("/login", (req, res) => {
  res.render("auth/login");
});

app.get("/student-dashboard", (req, res) => {
  res.render("student/dashboard");
});

app.get("/admin-dashboard", (req, res) => {
  res.render("admin/dashboard");
});
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
