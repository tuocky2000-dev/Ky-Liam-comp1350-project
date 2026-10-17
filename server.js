require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { clerkMiddleware } = require('@clerk/express');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(clerkMiddleware());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);

const htmlTemplate = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8')
  .replace('__CLERK_PUBLISHABLE_KEY__', process.env.CLERK_PUBLISHABLE_KEY || '');

app.get('/', (req, res) => {
  res.send(htmlTemplate);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});