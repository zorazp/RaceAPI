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
      lap_times[driver.id] = getDriverTime(driver, params.track);
    });
    return lap_times;
  };
  var getDriverTime = function(driver, track) {
    var driver_time = {};
    driver_time.sectors = [];
    track.sectors.forEach(function(sector, index) {
      driver_time.sectors.push(getSectorTime(driver, sector, track));
    });
    return driver_time;
  }
  var getSectorTime = function(driver, sector, track) {
    var raw_time = sector.length/(track.average_speed*1000/3600);
    var sector_type_coef = getSectorTypeCoef(sector);
    var driver_avg_coef = getDriverAvgCoef(driver, track);
    var team_avg_coef = getTeamAvgCoef(driver, track);
    var engine_avg_coef = getEngineAvgCoef(driver);
    return raw_time*sector_type_coef*driver_avg_coef*
      team_avg_coef*engine_avg_coef;
  }
  var getSectorTypeCoef = function(sector) {
    if (sector.type == SimUtils.VERY_SLOW)
      return SimUtils.getRandomInt(
        SimUtils.VERY_SLOW_RANGE[0], SimUtils.VERY_SLOW_RANGE[1]
      );
    else if (sector.type == SimUtils.SLOW)
      return SimUtils.getRandomInt(
        SimUtils.SLOW_RANGE[0], SimUtils.SLOW_RANGE[1]
      );
    else if (sector.type == SimUtils.FAST)
      return SimUtils.getRandomInt(
        SimUtils.FAST_RANGE[0], SimUtils.FAST_RANGE[1]
      );
    else if (sector.type == SimUtils.VERY_FAST)
      return SimUtils.getRandomInt(
        SimUtils.VERY_FAST_RANGE[0], SimUtils.VERY_FAST_RANGE[1]
      );
    else
      return SimUtils.getRandomInt(
        SimUtils.NORMAL_RANGE[0], SimUtils.NORMAL_RANGE[1]
      );
  };
  var getDriverAvgCoef = function(driver, track) {
    var driver_avg = driver.country == track.country ? 
                     driver.avg+2 :
                     driver.avg;
    return (98-SimUtils.getRandomInt(driver_avg-10, driver_avg+10)/10)/100;
  }
  var getTeamAvgCoef = function(driver, track) {
    var team_avg = driver.team_country == track.country ? 
                   driver.team_avg+1 :
                   driver.team_avg;
    return (98-SimUtils.getRandomInt(team_avg-12, team_avg+12)/10)/100;
  }
  var getEngineAvgCoef = function(driver) {
    var engine_avg = driver.engine_avg;
    return (98-SimUtils.getRandomInt(engine_avg-15, engine_avg+15)/10)/100;
  }

};

module.exports = new Simulator();