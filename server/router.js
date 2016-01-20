var scraper = require('./scraper'),
	countryAccess = require('./countryAccess'),
	mongoAccess = require('./mongoAccess'),
	filmsAccess = require('./filmsAccess');

var router = function(expressRouter){
	// reload
	expressRouter.use(function(req, res, next){
		
		console.log('it is working');
		req.options = {};
		next();
	});

	expressRouter.get('/', function(req, res){
		res.json({message: 'hey'});
	});

	expressRouter.route('/films/:country')
		.get(function(req, res, next){
			req.options.countryName = req.params.country;
			req.countryAccess = countryAccess();
			req.filmsAccess = filmsAccess();
			next();
		});

	// Does the country exist, if not create it.
	expressRouter.route('/films/:country')
		.get(function(req, res, next){
			// find the country in the database
			mongoAccess(req.options, req.countryAccess.findCountryDocument,
				// this is passed back from 
				function(countryMatchFound){
					console.log(countryMatchFound);
					if(countryMatchFound){
						// the country exists so move onto the next route to find film
						next('route');
					} else {
						// country doesn't exist so create it
						console.log('NO MATCH');
						next();
					}
				}
			);
		}, function(req, res, next){
			// Create the country
			mongoAccess(req.options, req.countryAccess.insertCountryDocument,
				function(){
					console.log('country inserted');
					next();
				});
		});

	// Does a film exist for this country, if so pass one back in the response and
	// add a new one to the database using 'scraper', if not use 'scraper' to populate the response
	// and to add one to the database.
	expressRouter.route('/films/:country')
		.get(function(req, res, next){
			mongoAccess(req.options, req.filmsAccess.selectFilm,
				function(film){
					// does a film exist (if it's not null)
					if(film){
						// send a film back in the response
						res.json(film);
						// get a film using the scraper
						scraper(req.options.countryName.toLowerCase(), function(data){
							if(data == null){
								console.log('Nothing returned from scraper' + data);
							}
							// req.options.data = data;
							// next();
						});
					} else {
						// get a film using the scraper and then send it in the response
						scraper(req.options.countryName.toLowerCase(), function(data){
							if(data == null){
								console.log('Nothing returned from scraper' + data);
							}
							res.json(data);
							req.options.data = data;
							// add a film to the db
							next();
						});
					}
				})
			
		});

	// Add a film to the database
	expressRouter.route('films/:country')
		.get(function(req, res, next){
			mongoAccess(req.options, req.countryInfoAccess.insertFilmForCountry,
				function(){
					
				})
		});

	return expressRouter;
}

module.exports = router;