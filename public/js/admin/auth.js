document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("adminLoginBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", adminLogin);
  }
});

async function adminLogin() {
  const username = document.getElementById("adminUsername")?.value.trim();
  const password = document.getElementById("adminPassword")?.value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert("Login failed: " + (data.message || "Unknown error"));
      return;
    }

    localStorage.setItem("adminData", JSON.stringify(data));
    window.location.href = "/admin-dashboard";
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred during login.");
  }
}
