const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const { verifyEmailConfig } = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Verify email service on startup
verifyEmailConfig();

// Middleware - CORS Configuration (Allow all origins in development)
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'AU Placements API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Student routes
app.use('/api/students', require('./routes/students'));

// Profile routes (New)
app.use('/api/profile', require('./routes/profile'));

// Application routes (Pipeline)
app.use('/api/applications', require('./routes/applications'));

// Resource routes
app.use('/api/resources', require('./routes/resources'));

// Discussion routes (Forum)
app.use('/api/discussions', require('./routes/discussions'));

// Event routes (Calendar)
app.use('/api/events', require('./routes/events'));

// Support routes
app.use('/api/support', require('./routes/support'));

 // Companies admin routes (Create/Update companies)
app.use('/api/companies', require('./routes/companies'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

