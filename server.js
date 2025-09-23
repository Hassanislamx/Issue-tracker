'use strict';
console.log("NODE_ENV is:", process.env.NODE_ENV);

const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
require('dotenv').config();

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');

let app = express();

// Middleware
app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' })); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sample front-end
app.route('/:project/')
  .get((req, res) => res.sendFile(process.cwd() + '/views/issue.html'));

// Index page
app.route('/')
  .get((req, res) => res.sendFile(process.cwd() + '/views/index.html'));

// FCC testing routes
fccTestingRoutes(app);

// API routes
apiRoutes(app);

// 404 handler
app.use((req, res) => res.status(404).type('text').send('Not Found'));

// 🚨 Only start listening if NOT in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
} else {
  console.log('⚡ Test mode active (server not listening)');
}

module.exports = app; // for Mocha
