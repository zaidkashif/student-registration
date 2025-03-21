document.addEventListener("DOMContentLoaded", async function () {
  const studentData = JSON.parse(localStorage.getItem("studentData"));
  if (!studentData) {
    alert("Not logged in!");
    window.location.href = "/login";
    return;
  }

  document.getElementById("studentName").innerText = studentData.name;
  document.getElementById("rollNumber").innerText = studentData.rollNumber;

  // Load Student Courses
  const response = await fetch(
    `/api/students/schedule?rollNumber=${studentData.rollNumber}`
  );
  const registeredCourses = await response.json();

  let courseList = registeredCourses.map((course) => course.name).join(", ");
  document.getElementById("registeredCourses").innerText =
    courseList || "No courses registered.";

  loadCalendar();
});

// Function to Load Weekly Schedule
async function loadCalendar() {
  const studentData = JSON.parse(localStorage.getItem("studentData"));
  if (!studentData) {
    alert("Not logged in!");
    window.location.href = "/login";
    return;
  }

  const response = await fetch(
    `/api/students/schedule?rollNumber=${studentData.rollNumber}`
  );
  const courses = await response.json();

  if (!Array.isArray(courses) || courses.length === 0) {
    document.getElementById("calendar").innerHTML =
      "<p>No courses registered.</p>";
    return;
  }

  let calendarHTML = `
        <table border="1">
            <tr>
                <th>Time</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th>
                <th>Thursday</th><th>Friday</th>
            </tr>`;

  let timeSlots = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"];
  let schedule = {};

  courses.forEach((course) => {
    if (course.schedule) {
      course.schedule.forEach((slot) => {
        if (!schedule[slot.day]) schedule[slot.day] = {};
        schedule[slot.day][slot.time] = course.name;
      });
    }
  });

  timeSlots.forEach((time) => {
    calendarHTML += `<tr><td>${time}</td>`;
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].forEach((day) => {
      let courseName = schedule[day]?.[time] || "Available";
      let style =
        courseName !== "Available"
          ? "style='background-color: red; color: white;'"
          : "";
      calendarHTML += `<td ${style}>${courseName}</td>`;
    });
    calendarHTML += "</tr>";
  });

  calendarHTML += "</table>";
  document.getElementById("calendar").innerHTML = calendarHTML;
}

// Function to Filter Courses
async function filterCourses() {
  const department = document.getElementById("departmentFilter").value;
  const response = await fetch(`/api/students/filter?department=${department}`);
  const courses = await response.json();

  let html = "";
  courses.forEach((course) => {
    html += `
            <div>
                ${course.name} - Seats: ${course.seats}
                <button onclick="registerCourse('${course._id}')">Register</button>
            </div>
        `;
  });

  document.getElementById("courseResults").innerHTML = html;
}

// Function to Register for a Course
async function registerCourse(courseId) {
  const studentData = JSON.parse(localStorage.getItem("studentData"));
  const response = await fetch("/api/students/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rollNumber: studentData.rollNumber, courseId }),
  });

  const data = await response.json();
  if (response.status === 200) {
    alert("Registered successfully!");
    location.reload();
  } else {
    alert("Error: " + data.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const checkButton = document.querySelector("#checkPrerequisitesButton");

  if (checkButton) {
    checkButton.addEventListener("click", checkPrerequisites);
  }
});

async function checkPrerequisites() {
  const inputField = document.getElementById("courseCodeInput");

  if (!inputField) {
    console.error("Error: Input field 'courseCodeInput' not found.");
    alert("Something went wrong. Please refresh and try again.");
    return;
  }

  const courseCode = inputField.value.trim().toUpperCase();

  if (!courseCode) {
    alert("Please enter a valid Course Code.");
    return;
  }

  try {
    const response = await fetch(`/api/students/prerequisites/${courseCode}`);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      document.getElementById(
        "prerequisitesResult"
      ).innerHTML = `<p>No prerequisites for ${courseCode}.</p>`;
      return;
    }

    let html = `<h3>Prerequisites for ${courseCode}:</h3><ul>`;
    data.forEach((course) => {
      html += `<li>${course.name} (${course.code})</li>`;
    });
    html += "</ul>";

    document.getElementById("prerequisitesResult").innerHTML = html;
  } catch (error) {
    console.error("Error loading prerequisites:", error);
    alert("Failed to fetch prerequisites. Please try again.");
  }
}
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("logoutBtn").addEventListener("click", logout);
});

function logout() {
  localStorage.removeItem("studentData");
  window.location.href = "/login";
}

window.onload = loadCalendar;
