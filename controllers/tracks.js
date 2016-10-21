//File: controllers/tracks.js
var mongoose = require('mongoose');
var Track = mongoose.model('Track');

//GET - Return all tracks in the DB
exports.findAllTracks = function(req, res) {
	Track.find(function(err, tracks) {
    if(err) res.send(500, err.message);

    console.log('GET /tracks')
		res.status(200).jsonp(tracks);
	});
};

//GET - Return a Track with specified ID
exports.findTrackById = function(req, res) {
	Track.findById(req.params.id, function(err, track) {
    if(err) return res.send(500, err.message);

    console.log('GET /track/' + req.params.id);
		res.status(200).jsonp(track);
	});
};

//POST - Insert a new Track in the DB
exports.addTrack = function(req, res) {
	console.log('POST');
	console.log(req.body);

	var track = new Track({
		name: req.body.name,
		country: req.body.country,
		sectors: req.body.sectors
	});

	track.save(function(err, track) {
		if(err) return res.send(500, err.message);
    res.status(200).jsonp(track);
	});
};

//PUT - Update a register already exists
exports.updateTrack = function(req, res) {
	Track.findById(req.params.id, function(err, track) {
		track.name = req.body.name;
		track.country = req.body.country;
		track.sectors = req.body.sectors;

		track.save(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200).jsonp(track);
		});
	});
};

//DELETE - Delete a Track with specified ID
exports.deleteTrack = function(req, res) {
	Track.findById(req.params.id, function(err, track) {
		track.remove(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200).jsonp(track);
		})
	});
};