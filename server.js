'use strict';
console.log("🔎 NODE_ENV:", process.env.NODE_ENV);

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const mongoose = require('mongoose');

let app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected..."))
  .catch(err => console.error("❌ DB connection error:", err));

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Front-end routes
app.route('/:project/').get((req, res) =>
  res.sendFile(process.cwd() + '/views/issue.html')
);
app.route('/').get((req, res) =>
  res.sendFile(process.cwd() + '/views/index.html')
);

// FCC & API routes
fccTestingRoutes(app);
apiRoutes(app);

// 404 handler
app.use((req, res) => {
  res.status(404).type('text').send('Not Found');
});

// Export app for testing
module.exports = app;

// 🚀 Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const listener = app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log('🚀 Your app is listening on port ' + listener.address().port);
  });
}

// 🧪 Run tests only in test mode
if (process.env.NODE_ENV === 'test') {
  console.log('🧪 Running Tests...');
  setTimeout(() => {
    try {
      runner.run();
    } catch (e) {
      console.log('Tests are not valid:');
      console.error(e);
    }
  }, 3500);
}
