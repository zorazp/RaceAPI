var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require('mongoose');

// Connection to DB
//mongoose.connect('mongodb://localhost/racesimulator', function(err, res) {
//  if(err) throw err;
//  console.log('Connected to Database');
//});

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// Import Models and controllers
//var models = require('./models/track')(app, mongoose);
//var trackCtrl = require('./controllers/tracks');
var simulateCtrl = require('./controllers/simulator');

// Example Route
var router = express.Router();
router.get('/', function(req, res) {
  res.send("Welcome to Race Simulator API!");
});
app.use(router);

// API routes
//var tracks = express.Router();

//tracks.route('/tracks')
//  .get(trackCtrl.findAllTracks);

//tracks.route('/track')
//  .post(trackCtrl.addTrack);

//tracks.route('/track/:id')
//  .get(trackCtrl.findTrackById)
//  .put(trackCtrl.updateTrack)
//  .delete(trackCtrl.deleteTrack);

// API routes
var simulator = express.Router();

simulator.route('/simulator')
  .get(simulateCtrl.simulateRace);

app.use('/api', simulator);

// Start server
app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});