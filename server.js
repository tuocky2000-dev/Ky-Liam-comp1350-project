const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <html>
    <head>
      <title>Ky Thai - Portfolio</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #222; }
        h1 { margin-bottom: 0; }
        .subtitle { color: #555; margin-top: 4px; }
        h2 { border-bottom: 2px solid #ddd; padding-bottom: 4px; margin-top: 32px; }
        .project { margin-bottom: 18px; }
        .project h3 { margin-bottom: 4px; }
        .tech { color: #666; font-size: 0.9em; font-style: italic; }
        a { color: #0366d6; }
      </style>
    </head>
    <body>
      <h1>Tuoc Ky Thai</h1>
      <p class="subtitle">Full-stack Web Development Student, BCIT</p>
      <p>Burnaby, BC | tuocky2000@gmail.com</p>
      <p>
        <a href="https://github.com/tuocky2000-dev">GitHub</a> |
        <a href="https://linkedin.com/in/tuoc-ky-thai">LinkedIn</a> |
        <a href="https://devpost.com/tuocky2000">Devpost</a>
      </p>

      <h2>About</h2>
      <p>Diploma student in Full-stack Web Development at BCIT (Sept 2025 to May 2027). Strong foundation in JavaScript, Node.js, Express, and MySQL, with experience building responsive, accessible UIs and collaborating on Agile team projects.</p>

      <h2>Projects</h2>

      <div class="project">
        <h3>Jeddit</h3>
        <p class="tech">JavaScript, Node.js, Express.js, EJS</p>
        <p>Multi-page web app with full CRUD for subs, articles, and comments. Includes user login and registration with secure cookies and bcrypt-hashed passwords, and permission checks so users can only edit or delete their own content.</p>
      </div>

      <div class="project">
        <h3>Restaurant Reviews</h3>
        <p class="tech">JavaScript, Node.js, EJS, Express.js, MySQL</p>
        <p>Restaurant and review app with full CRUD features. Raw SQL queries written with proper escaping to prevent SQL injection, configured to run both locally and on a hosted database.</p>
      </div>

      <div class="project">
        <h3>FI Visualizer</h3>
        <p class="tech">HTML, CSS, JavaScript</p>
        <p>Hackathon project (nwPlus Hackcamp) built with a teammate. Calculates financial independence age using the 4% rule, with a responsive UI, dark/light mode, and editable economic assumptions.</p>
      </div>

      <div class="project">
        <h3>BCITstagram</h3>
        <p class="tech">JavaScript, Node.js</p>
        <p>Asynchronous Node.js backend that processes PNG images and extracts ZIP files, applying a grayscale filter with custom pixel manipulation logic.</p>
      </div>

      <h2>Skills</h2>
      <p><strong>Languages:</strong> HTML, CSS, JavaScript, TypeScript</p>
      <p><strong>Frameworks:</strong> Node.js, Express.js, EJS</p>
      <p><strong>Tools:</strong> Git, VS Code, Figma, Jira</p>

      <h2>Contact</h2>
      <p>Email: tuocky2000@gmail.com</p>
      <p>GitHub: <a href="https://github.com/tuocky2000-dev">tuocky2000-dev</a></p>
    </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

const PORT = 3000;
app.listen(PORT, '127.0.0.1', () => console.log('Listening on 127.0.0.1:' + PORT));
