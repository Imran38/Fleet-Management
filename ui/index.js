document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("loginButton");
    const loginForm = document.getElementById("loginForm");
  
    // Show login form when login button is clicked
    loginButton.addEventListener("click", () => {
      loginForm.classList.toggle("d-none"); // Toggle visibility
    });
  
    // Handle form submission
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
  
      try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
  
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.token); // Save token to localStorage
          alert("Login successful!");
          window.location.href = "vehicles.html"; // Redirect to vehicles page
        } else {
          alert("Login failed. Please check your username and password.");
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    });
  });
  