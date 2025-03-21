document.addEventListener("DOMContentLoaded", async function () {
  loadCourses();
  loadStudents();
});

// Logout Functionality
document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem("adminData");
  window.location.href = "/login";
});

// Function to Load Courses
async function loadCourses() {
  const response = await fetch("/api/admin/courses");
  const courses = await response.json();

  let html = "<h3>Available Courses</h3><ul>";
  courses.forEach((course) => {
    html += `<li><b>${course.code} - ${course.name}</b> (${course.department}) - Seats: ${course.seats}
               <button onclick="deleteCourse('${course._id}')">Delete</button>
               <button onclick="editCourse('${course._id}', '${course.code}', '${course.name}', '${course.department}', ${course.seats})">Edit</button>
               </li>`;
  });
  html += "</ul>";

  document.getElementById("courseList").innerHTML = html;
}

// Function to Add Course
async function addCourse() {
  const courseCode = document.getElementById("courseCode").value;
  const courseName = document.getElementById("courseName").value;
  const department = document.getElementById("department").value;
  const seats = document.getElementById("seats").value;

  const response = await fetch("/api/admin/courses/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: courseCode,
      name: courseName,
      department,
      seats,
    }),
  });

  if (response.ok) {
    alert("Course added successfully!");
    loadCourses();
  } else {
    alert("Error adding course.");
  }
}

// Function to Edit Course
function editCourse(id, code, name, department, seats) {
  document.getElementById("courseCode").value = code;
  document.getElementById("courseName").value = name;
  document.getElementById("department").value = department;
  document.getElementById("seats").value = seats;

  document.getElementById("courseCode").setAttribute("disabled", true);

  // Show update button if not already present
  if (!document.getElementById("editCourseBtn")) {
    const updateBtn = document.createElement("button");
    updateBtn.id = "editCourseBtn";
    updateBtn.innerText = "Update Course";
    updateBtn.style.marginTop = "10px";
    updateBtn.onclick = () => updateCourse(id);
    document.querySelector(".course-section").appendChild(updateBtn);
  } else {
    // Update existing button's onclick handler
    document
      .getElementById("editCourseBtn")
      .setAttribute("onclick", `updateCourse('${id}')`);
  }
}

// Function to Update Course
async function updateCourse(id) {
  const courseName = document.getElementById("courseName").value;
  const department = document.getElementById("department").value;
  const seats = document.getElementById("seats").value;

  const response = await fetch(`/api/admin/courses/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: courseName, department, seats }),
  });

  if (response.ok) {
    alert("Course updated successfully!");
    location.reload();
  } else {
    alert("Error updating course.");
  }
}

// Function to Delete Course
async function deleteCourse(courseId) {
  if (!confirm("Are you sure you want to delete this course?")) return;

  const response = await fetch(`/api/admin/courses/delete/${courseId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    alert("Course deleted successfully!");
    loadCourses();
  } else {
    alert("Error deleting course.");
  }
}

// Function to Register Student
async function registerStudent() {
  const rollNumber = document.getElementById("studentRollNumber").value;
  const courseCode = document.getElementById("studentCourseCode").value;

  const response = await fetch("/api/admin/register-student", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rollNumber, courseCode }),
  });

  if (response.ok) {
    alert("Student registered successfully!");
    loadStudents();
  } else {
    alert("Error registering student.");
  }
}

// Function to Load Registered Students
async function loadStudents() {
  const response = await fetch("/api/admin/students");
  const students = await response.json();

  let html = "<h3>Registered Students</h3><ul>";
  students.forEach((student) => {
    html += `<li><b>${student.rollNumber}</b> - ${student.name} (Courses: ${student.registeredCourses.length})</li>`;
  });
  html += "</ul>";

  document.getElementById("studentList").innerHTML = html;
}

async function getReport(type) {
  const response = await fetch(`/api/admin/reports/${type}`);
  const data = await response.json();

  let html = "<h3>Report:</h3><ul>";

  if (type === "students") {
    data.forEach((student) => {
      const courseNames = student.registeredCourses
        .map((c) => c.name)
        .join(", ");
      html += `<li><strong>${student.name}</strong> (${student.rollNumber}) - Courses: ${courseNames}</li>`;
    });
  } else if (type === "courses") {
    data.forEach((course) => {
      html += `<li><strong>${course.code}</strong> - ${course.name} (${course.department}) - Seats Available: ${course.seats}</li>`;
    });
  } else if (type === "prerequisites") {
    data.forEach((student) => {
      const courseNames = student.registeredCourses
        .map((c) => `${c.name} (${c.code})`)
        .join(", ");
      html += `<li><strong>${student.name}</strong> (${student.rollNumber}) - Courses with prerequisites: ${courseNames}</li>`;
    });
  } else {
    html += "<li>Invalid report type.</li>";
  }

  html += "</ul>";

  document.getElementById("reportResults").innerHTML = html;
}
