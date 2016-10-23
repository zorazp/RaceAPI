var SimUtils = require('../engine/simutils');

//GET - Return a race results in JSON
exports.simulateRace = function(req, res) {
  params = SimUtils.getRaceParams(req.query);
  if (!params.drivers)
      return res.status(500).send("Driver Id unassigned.");
  res.status(200).jsonp(params);
};

