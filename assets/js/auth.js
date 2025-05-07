document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");

  // === Apply Saved Theme ===
  if (localStorage.getItem("dark-mode") === "enabled") {
    document.documentElement.setAttribute("data-theme", "dark");
    if (themeToggle) themeToggle.checked = true;
  }

  if (themeToggle) {
    themeToggle.addEventListener("change", function () {
      if (themeToggle.checked) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("dark-mode", "enabled");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("dark-mode", "disabled");
      }
    });
  }

  // Apply saved theme on page load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    const themeSwitch = document.querySelector(".theme-switch input");
    const toggleText = document.querySelector(".toggle-text");
    const toggleIcon = document.getElementById("toggle-icon");

    if (savedTheme === "dark") {
      themeSwitch.checked = true;
      document.body.classList.add("dark-mode");
      toggleText.textContent = "Dark Mode";
      toggleIcon.children[1].classList.replace("fa-sun", "fa-moon");
    } else {
      themeSwitch.checked = false;
      document.body.classList.remove("dark-mode");
      toggleText.textContent = "Light Mode";
      toggleIcon.children[1].classList.replace("fa-moon", "fa-sun");
    }
  }

  // === Register Form Logic ===
  const registerForm = document.getElementById("userForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("username");
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      const confirmPassword = document.getElementById("confirm-password");
      //get user type from the select element
      const userTypeSelect = document.getElementById("user-type");

      let isValid = true;

      // Username
      if (!/^[a-zA-Z0-9]{3,}$/.test(username.value.trim())) {
        setError(
          "username",
          "Name must be at least 3 alphanumeric characters."
        );
        isValid = false;
      } else {
        clearError("username");
      }

      // Email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setError("email", "Invalid email format.");
        isValid = false;
      } else {
        clearError("email");
      }

      // Password
      if (
        !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
          password.value.trim()
        )
      ) {
        setError(
          "password",
          "Password must be at least 6 characters, include a letter, a number, and a special character."
        );
        isValid = false;
      } else {
        clearError("password");
      }

      // Confirm Password
      if (password.value !== confirmPassword.value) {
        setError("confirm-password", "Passwords do not match.");
        isValid = false;
      } else {
        clearError("confirm-password");
      }

      if (isValid) {
        //alert("Registered successfully!");
        //print login credentials to console for debugging
        console.log("Username: ", username.value);
        console.log("Email: ", email.value);
        console.log("Password: ", password.value);
        //userType
        console.log(
          "User Type: ",
          userTypeSelect.options[userTypeSelect.selectedIndex].value
        );
        // Save to db.json
        let userData = {
          username: username.value,
          email: email.value,
          password: password.value,
          userType: userTypeSelect.options[userTypeSelect.selectedIndex].value,
        };

        fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("User registered:", data);
            // Redirect to login page or show success message
            window.location.href = "login.html"; // Uncomment to redirect
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Registration failed. Please try again.");
          });

        // Clear form fields
        username.value = "";
        email.value = "";
        password.value = "";
        confirmPassword.value = "";
        userTypeSelect.selectedIndex = 0; // Reset to first option
      }
    });

    document
      .getElementById("toggle-password")
      .addEventListener("click", function () {
        const passwordField = document.getElementById("password");
        const icon = this;
        if (passwordField.type === "password") {
          passwordField.type = "text";
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        } else {
          passwordField.type = "password";
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        }
      });

    document
      .getElementById("toggle-confirm-password")
      .addEventListener("click", function () {
        const confirmPasswordField =
          document.getElementById("confirm-password");
        const icon = this;
        if (confirmPasswordField.type === "password") {
          confirmPasswordField.type = "text";
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        } else {
          confirmPasswordField.type = "password";
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        }
      });
  }

  // === Login Form Logic ===
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("login-email");
      const password = document.getElementById("login-password");

      let isValid = true;

      // Email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setError("login-email", "Enter a valid email.");
        isValid = false;
      } else {
        clearError("login-email");
      }

      // Password
      if (password.value.trim().length < 6) {
        setError("login-password", "Password must be at least 6 characters.");
        isValid = false;
      } else {
        clearError("login-password");
      }

      if (isValid) {
        fetch("http://localhost:3000/users")
          .then((response) => response.json())
          .then((users) => {
            const user = users.find(
              (u) =>
                u.email === email.value.trim() &&
                u.password === password.value.trim()
            );
            if (user) {
              window.location.href = "index.html"; // Redirect to index.html
            } else {
              setError("login-email", "Invalid email or password.");
              setError("login-password", "Invalid email or password.");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Login failed. Please try again.");
          });
      }
    });
  }

  // === Error Handling Helpers ===
  function setError(id, message) {
    const el = document.getElementById(`${id}-error`);
    if (el) {
      el.textContent = message;
      el.style.display = "block";
    }
  }

  function clearError(id) {
    const el = document.getElementById(`${id}-error`);
    if (el) {
      el.textContent = "";
      el.style.display = "none";
    }
  }
});
