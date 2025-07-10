const express = require('express');
const path = require('path');
const app = express();
const PORT = 5173;

// Serve static assets (CSS, JS, images, etc.)
app.use(express.static(__dirname));

// Route for /login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/login/login.html'));
});

// Route for /signup
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/signup/signup.html'));
});

// Route for /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// (Optional) 404 for all other routes
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
