document.getElementById("togglePassword").addEventListener("click", () => {
  const password = document.getElementById("password");
  password.type = password.type === "password" ? "text" : "password";
});

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("signup-message");

  // Basic validation
  if (!name || !email || !password) {
    message.textContent = "All fields are required.";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      message.style.color = "green";
      message.textContent = "Signup successful! Redirecting...";
      setTimeout(() => window.location.href = "login.html", 2000);
    } else {
      message.style.color = "red";
      message.textContent = data.message || "Signup failed.";
    }
  } catch (err) {
    message.textContent = "Network error. Try again.";
  }
});
