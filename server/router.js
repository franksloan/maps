var scraper = require('./webscrapers/filmScraper'),
	countryAccess = require('./dbaccess/countryAccess'),
	mongoAccess = require('./dbaccess/mongoAccess'),
	filmsAccess = require('./dbaccess/filmsAccess'),
	countryParamRoute = require('./routes/countryParamRoute'),
	filmsRoute = require('./routes/filmsRoute'),
	foodRoute = require('./routes/foodRoute'),
	travelRoute = require('./routes/travelRoute'),
	countryIntroRoute = require('./routes/countryIntroRoute');

var router = function(expressRouter, io){

	// obCli.friend = socketsService().connect(io);
	io.on('connection', function(client){
		console.log('coonnect');
	});
	// reload
	expressRouter.use(function(req, res, next){
		console.log('in route');
		req.options = {};
		req.options.io = io;
		
		next();
	});

	expressRouter.get('/', function(req, res){
		res.json({message: 'hey'});
	});

	expressRouter.param('country', function(req, res, next, country){
		console.log("no way");
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