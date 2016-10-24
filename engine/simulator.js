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
    driver_time.sectors = [];
    params.track.sectors.forEach(function(sector, index) {
      driver_time.sectors.push(getSectorTime(driver, sector, params));
    });
    return driver_time;
  }
  var getSectorTime = function(driver, sector, params) {
    var sector_data = {};
    var raw_time = sector.length/(params.track.average_speed*1000/3600);
    var sector_type_time = getSectorTypeTime(raw_time, sector);
    sector_data.time = sector_type_time;
    return sector_data;
  }
  var getSectorTypeTime = function(raw_time, sector) {
    var sector_type_time;
    var sector_coef;
    if (sector.type == SimUtils.VERY_SLOW)
      sector_coef = SimUtils.getRandomInt(
        SimUtils.VERY_SLOW_RANGE[0], SimUtils.VERY_SLOW_RANGE[1]
      );
    else if (sector.type == SimUtils.SLOW)
      sector_coef = SimUtils.getRandomInt(
        SimUtils.SLOW_RANGE[0], SimUtils.SLOW_RANGE[1]
      );
    else if (sector.type == SimUtils.FAST)
      sector_coef = SimUtils.getRandomInt(
        SimUtils.FAST_RANGE[0], SimUtils.FAST_RANGE[1]
      );
    else if (sector.type == SimUtils.VERY_FAST)
      sector_coef = SimUtils.getRandomInt(
        SimUtils.VERY_FAST_RANGE[0], SimUtils.VERY_FAST_RANGE[1]
      );
    else
      sector_coef = SimUtils.getRandomInt(
        SimUtils.NORMAL_RANGE[0], SimUtils.NORMAL_RANGE[1]
      );
    sector_type_time = raw_time*sector_coef;
    return sector_type_time;
  };
  var getDriverAvgTime = function(raw_time, driver) {
    return null;
  }
  var getTeamAvgTime = function(raw_time, driver) {
    return null;
  }

};

module.exports = new Simulator();