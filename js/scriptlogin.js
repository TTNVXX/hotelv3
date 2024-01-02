document.addEventListener("DOMContentLoaded", function () {
  const forms = document.querySelector(".forms"),
    pwShowHide = document.querySelectorAll(".eye-icon"),
    links = document.querySelectorAll(".link");

  pwShowHide.forEach((eyeIcon) => {
    eyeIcon.addEventListener("click", () => {
      let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(
        ".password"
      );

      pwFields.forEach((password) => {
        if (password.type === "password") {
          password.type = "text";
          eyeIcon.classList.replace("bx-hide", "bx-show");
          return;
        }
        password.type = "password";
        eyeIcon.classList.replace("bx-show", "bx-hide");
      });
    });
  });

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // preventing form submit
      forms.classList.toggle("show-signup");
    });
  });

  function loginUser(usernameOrEmail, password) {
    // Make a request to the login API endpoint
    fetch("https://ephemera.cloud/hotel/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username_or_email: usernameOrEmail, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed");
        }
        return response.json();
      })
      .then((data) => {
        // Check if the response contains a token
        if (data && data.token) {
          // Store the token securely (e.g., in localStorage)
          localStorage.setItem("jwtToken", data.token);

          // Update HTML based on user status
          updateHTMLForUser(data);
        } else {
          throw new Error("Invalid response from server");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        // Log the specific error message from the server
        if (error.message) {
          console.error("Server error message:", error.message);
        }
        // Handle login error, e.g., display an error message to the user
      });
  }

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  // Event listener for login form
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const usernameOrEmail = document.getElementById("loginUsernameOrEmail").value;
    const password = document.getElementById("loginPassword").value;
    loginUser(usernameOrEmail, password);
  });

  // Event listener for signup form
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    signupUser(email, password);
  });

  function signupUser(email, password) {
    // Make a request to the signup API endpoint
    fetch("https://ephemera.cloud/hotel/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Signup failed");
        }
        // Handle successful signup, e.g., redirect or display a success message
      })
      .catch((error) => {
        console.error("Signup error:", error);
        // Handle signup error, e.g., display an error message to the user
      });
  }

  function updateHTMLForUser(userData) {
    const userStatusElement = document.getElementById("userStatus");
    if (userData && userData.token) {
      // User is logged in
      userStatusElement.innerHTML = `Welcome! <a href="#" onclick="logoutUser()">Logout</a>`;

      // Show success pop-up
      alert("Login successful! Redirecting to log.html...");

      // Redirect to log.html
      window.location.href = "log.html"; // Replace with the actual path to log.html
    } else {
      // User is logged out
      userStatusElement.innerHTML = `<a href="#" onclick="showLoginForm()">Login</a> | <a href="#" onclick="showSignupForm()">Signup</a>`;
    }
  }
});