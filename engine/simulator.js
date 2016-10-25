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
      results.lap_times[i] = getLapTimes(params.drivers, params.track);
    }
    results.race_times = getRaceTimes(results.lap_times, params.drivers);
    results.fastest_laps = getFastestLaps(results.lap_times, params.drivers);
    return results;
  };

  //Laps And Sector Times
  var getLapTimes = function(drivers, track) {
    var lap_results = {};
    lap_results.sectors = {};
    track.sectors.forEach(function(sector, i) {
      lap_results.sectors[i] = getSectorResults(drivers, sector, track);
    });
    lap_results.lap_amount = getLapAmount(lap_results.sectors, drivers);
    return lap_results;
  };
  var getSectorResults = function(drivers, sector, track) {
    var sector_times = {};
    drivers.forEach(function(driver) {
      sector_times[driver.id] = getSectorTime(driver, sector, track);
    });
    return sector_times;
  };
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
      )/100;
    else if (sector.type == SimUtils.SLOW)
      return SimUtils.getRandomInt(
        SimUtils.SLOW_RANGE[0], SimUtils.SLOW_RANGE[1]
      )/100;
    else if (sector.type == SimUtils.FAST)
      return SimUtils.getRandomInt(
        SimUtils.FAST_RANGE[0], SimUtils.FAST_RANGE[1]
      )/100;
    else if (sector.type == SimUtils.VERY_FAST)
      return SimUtils.getRandomInt(
        SimUtils.VERY_FAST_RANGE[0], SimUtils.VERY_FAST_RANGE[1]
      )/100;
    else
      return SimUtils.getRandomInt(
        SimUtils.NORMAL_RANGE[0], SimUtils.NORMAL_RANGE[1]
      )/100;
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
  var getLapAmount = function(sectors_results, drivers) {
    var lap_amount = {};
    drivers.forEach(function(driver) {
      lap_amount[driver.id] = getDriverLapAmount(sectors_results, driver);
    });
    return lap_amount;
  }
  var getDriverLapAmount = function(sectors_results, driver) {
    var lap_amount = 0;
    Object.keys(sectors_results).forEach(function(sector) {
      lap_amount += sectors_results[sector][driver.id];
    });
    return lap_amount;
  }

  //Race Times
  var getRaceTimes = function(lap_times, drivers) {
    var race_times = {};
    drivers.forEach(function(driver) {
      race_times[driver.id] = getDriverRaceTime(lap_times, driver);
    });
    return race_times;
  }
  var getDriverRaceTime = function(lap_times, driver) {
    var race_time = 0;
    Object.keys(lap_times).forEach(function(lap) {
      race_time += lap_times[lap]["lap_amount"][driver.id];
    });
    return race_time;
  }

  //Fastest Laps
  var getFastestLaps = function(lap_times, drivers) {
    var fastest_laps = {};
    drivers.forEach(function(driver) {
      fastest_laps[driver.id] = getDriverFastestLap(lap_times, driver);
    });
    return fastest_laps;
  }
  var getDriverFastestLap = function(lap_times, driver) {
    var fastest_lap;
    Object.keys(lap_times).forEach(function(lap) {
      var lap_time = lap_times[lap]["lap_amount"][driver.id];
      fastest_lap = lap == 0 ? 
                    lap_time :
                    (lap_time < fastest_lap ? 
                     lap_time : 
                     fastest_lap);
    });
    return fastest_lap;
  }

};

module.exports = new Simulator();