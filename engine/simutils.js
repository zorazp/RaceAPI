//SimUtils Namespace
var SimUtils = function() {

  //Public Values

  //Sector Type
  this.VERY_SLOW = "very_slow";
  this.SLOW = "slow";
  this.NORMAL = "normal";
  this.FAST = "fast";
  this.VERY_FAST = "very_fast";

  //Sector Type Coeficients Range
  this.VERY_SLOW_RANGE = [136, 140];
  this.SLOW_RANGE = [112, 116];
  this.NORMAL_RANGE = [98, 102];
  this.FAST_RANGE = [84, 88];
  this.VERY_FAST_RANGE = [60, 64];

  //Private Values

  //Default Values

  //Driver Values
  const DEFAULT_AVG = 16,
        MIN_AVG = 0,
        MAX_AVG = 20,
        DEFAULT_COUNTRY = "gb";

  //Track Values
  const DEFAULT_AVERAGE_SPEED = 190,
        DEFAULT_SECTOR_LENGTH = 1800,
        DEFAULT_SECTOR_TYPE = this.NORMAL,
        DEFAULT_LAPS = 55,
        SECTOR_TYPES_ARRAY = [
          this.VERY_SLOW, this.SLOW, this.NORMAL, this.FAST, this.VERY_FAST
        ];

  //Public Methods
  this.getRaceParams = function(query) {
    var params = {};

    if (!query.driver_id)
      return params;

    //Drivers Params
    params.drivers = getDriversParams(query);

    //Track Params
    params.track = getTrackParams(query);

    return params;
  };
  this.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //Private Methods

  //Driver Methods
  var getDriversIds = function(query) {
    if (!(query.driver_id instanceof Array))
      return [query.driver_id];
    else
      return query.driver_id.filter(function(id, i, self) {
          return i == self.indexOf(id);
      })
  };
  var getDriversAvgs = function(query, drivers_number) {
    var drivers_avgs = [];
    for (var i=0; i<drivers_number; i++) {
      var driver_avg = (!(query.driver_avg instanceof Array)) ?
                       query.driver_avg :
                       query.driver_avg[i];
      driver_avg = parseInt(driver_avg);
      drivers_avgs.push(
        !isNaN(driver_avg) && driver_avg >= MIN_AVG && driver_avg <= MAX_AVG ?
        driver_avg :
        DEFAULT_AVG
      );
    }
    return drivers_avgs;
  };
  var getDriversCountries = function(query, drivers_number) {
    var drivers_countries = [];
    for (var i=0; i<drivers_number; i++) {
      var driver_country = (!(query.driver_country instanceof Array)) ?
                           query.driver_country :
                           query.driver_country[i];
      drivers_countries.push(driver_country ? driver_country : DEFAULT_COUNTRY);
    }
    return drivers_countries;
  };
  var getTeamsAvgs = function(query, drivers_number) {
    var teams_avgs = [];
    for (var i=0; i<drivers_number; i++) {
      var team_avg = (!(query.team_avg instanceof Array)) ?
                       query.team_avg :
                       query.team_avg[i];
      team_avg = parseInt(team_avg);
      teams_avgs.push(
        !isNaN(team_avg) && team_avg >= MIN_AVG && team_avg <= MAX_AVG ?
        team_avg :
        DEFAULT_AVG
      );
    }
    return teams_avgs;
  };
  var getTeamsCountries = function(query, drivers_number) {
    var teams_countries = [];
    for (var i=0; i<drivers_number; i++) {
      var team_country = (!(query.team_country instanceof Array)) ?
                           query.team_country :
                           query.team_country[i];
      teams_countries.push(team_country ? team_country : DEFAULT_COUNTRY);
    }
    return teams_countries;
  };
  var getEnginesAvgs = function(query, drivers_number) {
    var engines_avgs = [];
    for (var i=0; i<drivers_number; i++) {
      var engine_avg = (!(query.engine_avg instanceof Array)) ?
                       query.engine_avg :
                       query.engine_avg[i];
      engine_avg = parseInt(engine_avg);
      engines_avgs.push(
        !isNaN(engine_avg) && engine_avg >= MIN_AVG && engine_avg <= MAX_AVG ?
        engine_avg :
        DEFAULT_AVG
      );
    }
    return engines_avgs;
  };
  var getDrivers = function(drivers_ids, drivers_avgs, drivers_countries, 
    				        teams_avgs, teams_countries, engines_avgs) {
    var drivers = [];
    drivers_ids.forEach(function(id, i) {
      var driver = {};
      driver.id = id;
      driver.avg = drivers_avgs[i];
      driver.country = drivers_countries[i];
      driver.team_avg = teams_avgs[i];
      driver.team_country = teams_countries[i];
      driver.engine_avg = engines_avgs[i];
      drivers.push(driver);
    });
    return drivers;
  };
  var getDriversParams = function(query) {
    var drivers_ids = getDriversIds(query);
    var drivers_avgs = getDriversAvgs(query, drivers_ids.length);
    var drivers_countries = getDriversCountries(query, drivers_ids.length);
    var teams_avgs = getTeamsAvgs(query, drivers_ids.length);
    var teams_countries = getTeamsCountries(query, drivers_ids.length);
    var engines_avgs = getEnginesAvgs(query, drivers_ids.length);
    return getDrivers(drivers_ids, drivers_avgs, drivers_countries, 
    				  teams_avgs, teams_countries, engines_avgs);
  };

  //Track Methods
  var getSectorsLengths = function(query) {
    if (!query.sector_length || !(query.sector_length instanceof Array))
      return [(query.sector_length && !isNaN(parseInt(query.sector_length))) ?
              parseInt(query.sector_length) :
              DEFAULT_SECTOR_LENGTH
             ];
    else
      return query.sector_length.map(function(length) {
        return !isNaN(parseInt(length)) ?
               parseInt(length) :
               DEFAULT_SECTOR_LENGTH;
      });
  };
  var getSectorsTypes = function(query, sectors_number) {
    var sectors_types = [];
    for (var i=0; i<sectors_number; i++) {
      var type = (!(query.sector_type instanceof Array)) ?
                 query.sector_type :
                 query.sector_type[i];
      sectors_types.push(
        type && SECTOR_TYPES_ARRAY.indexOf(type) > -1 ?
        type :
        DEFAULT_SECTOR_TYPE
      );
    }
    return sectors_types;
  };
  var getSectors = function (sectors_length, sectors_type) {
    var sectors = [];
    sectors_length.forEach(function(sector_length, i) {
      var sector = {};
      sector.length = sector_length;
      sector.type = sectors_type[i];
      sectors.push(sector);
    });
    return sectors;
  };
  var getAverageSpeed = function(query) {
    return query.average_speed || DEFAULT_AVERAGE_SPEED;
  };
  var getLaps = function(query) {
    return query.laps || DEFAULT_LAPS;
  };
  var getTrackCountry = function(query) {
  	return query.track_country || DEFAULT_COUNTRY;
  }
  var getTrackParams = function(query) {
    var params = {};
    var sectors_lengths = getSectorsLengths(query);
    var sectors_types = getSectorsTypes(query, sectors_lengths.length);
    params.average_speed = getAverageSpeed(query);
    params.sectors = getSectors(sectors_lengths, sectors_types);
    params.laps = getLaps(query);
    params.country = getTrackCountry(query);
    return params;
  };

};

module.exports = new SimUtils();