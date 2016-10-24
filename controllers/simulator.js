var SimUtils = require('../engine/simutils');
var Simulator = require('../engine/simulator');

//GET - Return a race results in JSON
exports.simulateRace = function(req, res) {
  race_params = SimUtils.getRaceParams(req.query);
  if (!race_params.drivers)
      return res.status(500).send("Driver Id unassigned.");
  var race_results = Simulator.simulateRace(race_params);
  res.status(200).jsonp(race_results);
};