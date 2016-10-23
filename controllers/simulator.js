var SimUtils = require('../engine/simutils');

//GET - Return a race results in JSON
exports.simulateRace = function(req, res) {
	params = SimUtils.getRaceParams(req.query);
	console.log(JSON.stringify(params));
	res.status(200).jsonp({"hola": 1});
};

