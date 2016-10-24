var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require('mongoose');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// Import Models and controllers
var simulateCtrl = require('./controllers/simulator');

// Example Route
var router = express.Router();
router.get('/', function(req, res) {
  res.send("Welcome to Race Simulator API!");
});
app.use(router);

// API routes
var simulator = express.Router();

simulator.route('/simulator')
  .get(simulateCtrl.simulateRace);

app.use('/api', simulator);

// Start server
app.listen(process.env.PORT || 3000, function() {
  console.log("Node server running on http://localhost:3000");
});