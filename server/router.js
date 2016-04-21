var	countryParamRoute = require('./routes/countryParamRoute'),
	filmsRoute = require('./routes/filmsRoute'),
	foodRoute = require('./routes/foodRoute'),
	travelRoute = require('./routes/travelRoute'),
	countryIntroRoute = require('./routes/countryIntroRoute');

var router = function(expressRouter, io){

	// no need to do anything on connection
	io.on('connection', function(){});

	// reload
	expressRouter.use(function(req, res, next){
		// setup options object on the request
		req.options = {};
		req.options.io = io;
		
		next();
	});

	// check country exists and if not initialise it
	expressRouter.param('country', function(req, res, next){
		next();
	});

	countryParamRoute(expressRouter);
	countryIntroRoute(expressRouter);
	filmsRoute(expressRouter);
	foodRoute(expressRouter);
	travelRoute(expressRouter);

	return expressRouter;
	
}

module.exports = router;