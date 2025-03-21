async function studentLogin() {
  const rollNumber = document.getElementById("rollNumber").value.trim();

  if (!rollNumber) {
    alert("Please enter your Roll Number.");
    return;
  }

  try {
    const response = await fetch("/api/students/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rollNumber }),
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("JSON error:", jsonError);
      alert("Server error. Please try again.");
      return;
    }

    if (!response.ok) {
      alert("Login failed: " + (data.message || "Invalid Roll Number"));
      return;
    }

    localStorage.setItem("studentData", JSON.stringify(data));
    window.location.href = "/student-dashboard";
  } catch (err) {
    console.error("Login error:", err);
    alert("Network error or server not running.");
  }
}
