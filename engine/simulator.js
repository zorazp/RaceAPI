//Simulator Namespace
var SimUtils = require('./simutils');

var Simulator = function() {

	//Public Methods
	this.simulateRace = function(params) {
		var race_results = {};
		race_results.drivers = params.drivers;
		race_results.track = params.track;
		race_results.results = getResults(params);
		return race_results;
	};

	//Private Methods
	var getResults = function(params) {
		var results = {};
		results.lap_times = {};
		for (var i=0; i<params.track.laps; i++) {
			results.lap_times[i] = getLapTimes(i, params);
		}
		return results;
	};
	var getLapTimes = function(lap, params) {
		var lap_times = {};
		params.drivers.forEach(function(driver) {
			lap_times[driver.id] = getDriverTime(driver, params);
		});
		return lap_times;
	};
	var getDriverTime = function(driver, params) {
		var driver_time = {};
		params.track.sectors.forEach(function(sector, index) {
			driver_time["sector-"+(index+1)] = getSectorTime(
				driver, sector, params
			);
		});
		return driver_time;
	}
	var getSectorTime = function(driver, sector, params) {
		return 1;
	};
};

module.exports = new Simulator();