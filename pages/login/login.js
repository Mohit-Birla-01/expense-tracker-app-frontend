document.getElementById("togglePassword").addEventListener("click", () => {
  const password = document.getElementById("password");
  password.type = password.type === "password" ? "text" : "password";
});

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("login-message");
  if (!email || !password) {
    message.textContent = "All fields are required.";
    return;
  }
  try {
    const res = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Store user data without token requirement
      localStorage.setItem('userName', data.user?.name || email.split('@')[0]);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isLoggedIn', 'true');

      message.style.color = "green";
      message.textContent = "Login successful! Redirecting...";
      setTimeout(() => window.location.href = "/home", 2000);
    } else {
      message.style.color = "red";
      message.textContent = data.message || "Login failed.";
    }
  } catch (err) {
    message.style.color = "red";
    message.textContent = "Network error. Try again.";
  }
});
