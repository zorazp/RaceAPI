//Simulator Namespace
var SimUtils = require('./simutils');

var Simulator = function() {

  //Public Methods
  this.simulateRace = function(params) {
    var race_results = {};
    race_results.drivers = params.drivers;
    race_results.track = params.track;
    race_results.race = getRace(params);
    return race_results;
  };

  //Private Methods

  //Race
  var getRace = function(params) {
    var race = {};
    race.history = getHistory(params);
    race.race_times = getRaceTimes(race.history, params);
    race.fastest_laps = getFastestLaps(race.history, params);
    return race;
  };
  //Race->History
  var getHistory = function(params) {
      var history = [];
      for (var lap=0; lap<params.track.laps; lap++) {
        history.push(getLapHistory(lap, params));
      }
      return history;
  };
  var getLapHistory = function(lap, params) {
    var lap_history = {};
    lap_history.sectors = getSectorsHistory(lap, params);
    lap_history.lap = getLapTimes(lap_history.sectors, params);
    return lap_history;
  };
  var getSectorsHistory = function(lap, params) {
    var sectors_history = [];
    for (var number=0; number<params.track.sectors.length; number++) {
      sectors_history.push(getSectorTimes(lap, number, params));
    }
    return sectors_history;
  };
  var getSectorTimes = function(lap, sector_number, params) {
    var sector_times = {};
    params.drivers.forEach(function(driver, grid) {
      sector_times[driver.id] = getSectorTime(lap, sector_number, grid, params);
    });
    return sector_times;
  };
  var getSectorTime = function(lap, sector_number, grid, params) {
    var track = params.track;
    var sector = track.sectors[sector_number];
    var driver = params.drivers[grid];
    var raw_time = sector.length/(track.average_speed*1000/3600);
    //Grid Start Penalization Time
    raw_time = lap == 0 && sector_number == 0 ? 
               raw_time + getGridTime(grid) :
               raw_time;
    var sector_type_coef = getSectorTypeCoef(sector);
    var driver_avg_coef = getDriverAvgCoef(driver, track);
    var team_avg_coef = getTeamAvgCoef(driver, track);
    var engine_avg_coef = getEngineAvgCoef(driver);
    return raw_time*sector_type_coef*driver_avg_coef*
      team_avg_coef*engine_avg_coef;
  }
  var getGridTime = function(grid) {
    return ((grid+1)*SimUtils.GRID_DIFFERENCE)+SimUtils.GRID_START_TIME;
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
  var getLapTimes = function(sectors_history, params) {
    var lap_times = {};
    params.drivers.forEach(function(driver) {
      lap_times[driver.id] = getLapTime(sectors_history, driver.id);
    });
    return lap_times;
  }
  var getLapTime = function(sectors_history, driver_id) {
    var lap_time = 0;
    sectors_history.forEach(function(sector_history) {
      lap_time += sector_history[driver_id];
    });
    return lap_time;
  }

  //Race->Race_Times
  var getRaceTimes = function(history, params) {
    var race_times = {};
    params.drivers.forEach(function(driver) {
      race_times[driver.id] = getRaceTime(history, driver.id, params);
    });
    return race_times;
  }
  var getRaceTime = function(history, driver_id, params) {
    var race_time = 0;
    history.forEach(function(lap_history) {
      race_time += lap_history.lap[driver_id];
    });
    return race_time;
  }

  //Race->Fastest_Laps
  var getFastestLaps = function(history, params) {
    var fastest_laps = {};
    params.drivers.forEach(function(driver) {
      fastest_laps[driver.id] = getFastestLap(history, driver.id, params);
    });
    return fastest_laps;
  }
  var getFastestLap = function(history, driver_id, params) {
    var fastest_lap;
    history.forEach(function(lap_history, lap) {
      var lap_time = lap_history.lap[driver_id];
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