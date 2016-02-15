var scraper = require('./webscrapers/filmScraper'),
	countryAccess = require('./dbaccess/countryAccess'),
	mongoAccess = require('./dbaccess/mongoAccess'),
	filmsAccess = require('./dbaccess/filmsAccess'),
	filmsRoute = require('./routes/filmsRoute'),
	foodRoute = require('./routes/foodRoute');

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
		io.sockets.emit("happy", {dat: "ok"});
		next();
	});

	expressRouter.get('/', function(req, res){
		res.json({message: 'hey'});
	});

	filmsRoute(expressRouter);

	foodRoute(expressRouter);

	return expressRouter;
	
}

module.exports = router;