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
    //Track Params
    params.average_speed = getAverageSpeed(query);
    params.sector_length = getSectorLength(query);
    params.sector_type = getSectorType(query, params.sector_length.length);
    params.laps = getLaps(query);
    //Drivers Params

    return params;
  };

  //Private Methods
  var getAverageSpeed = function(query) {
    return query.average_speed || DEFAULT_AVERAGE_SPEED;
  };
  var getSectorLength = function(query) {
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
  }
  var getSectorType = function(query, sectors_number) {
    var sector_type = [];
    for (var i=0; i<sectors_number; i++) {
      var type = (!(query.sector_type instanceof Array)) ?
                 query.sector_type :
                 query.sector_type[i];
      console.log(SECTOR_TYPES_ARRAY);
      sector_type.push(
        type && SECTOR_TYPES_ARRAY.indexOf(type) > -1 ?
        type :
        DEFAULT_SECTOR_TYPE
      );
    }
    return sector_type;
  }
  var getLaps = function(query) {
    return query.laps || DEFAULT_LAPS;
  }

};

module.exports = new SimUtils();