var scraper = require('./../webscrapers/filmScraper'),
	countryAccess = require('./../dbaccess/countryAccess'),
	mongoAccess = require('./../dbaccess/mongoAccess'),
	filmsAccess = require('./../dbaccess/filmsAccess');

var filmsRoute = function(expressRouter){

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
					
					if(countryMatchFound){
						console.log('MATCH');
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
					next();
				});
		});

	// Does a film exist for this country, if so pass one back in the response and
	// add a new one to the database using 'scraper', if not use 'scraper' to populate the response
	// and to add one to the database.
	expressRouter.route('/films/:country')
		.get(function(req, res, next){
			mongoAccess(req.options, req.filmsAccess.selectFilm,
				function(films){
					// does a film exist (if it's not null)
					if(films.length > 0){
						// send a film back in the response
						res.json(films);
						// get a film using the scraper
						scraper(req.options.countryName.toLowerCase(), function(data){
							if(data == null){
								console.log('Nothing returned from scraper' + data);
							}
							req.options.data = data;
							mongoAccess(req.options, req.filmsAccess.insertFilm)
						});
					} else {
						// get a film using the scraper and then send it in the response
						scraper(req.options.countryName.toLowerCase(), function(data){
							if(!data){
								console.log('Nothing returned from scraper' + data);
							}
		
							films.push(data);
							res.json(films);
							// add a film to the db
							req.options.data = data;
							mongoAccess(req.options, req.filmsAccess.insertFilm)
						});
					}
				})
			
		});

	expressRouter.route('/totalfilms/')
		.get(function(req, res){
			req.filmsAccess = filmsAccess();
			mongoAccess(null, req.filmsAccess.totalFilms, function(total){
				console.log('finished total: '+total);
				res.json({'totalFilms': total});
			})
		})

	return expressRouter;
	
}

module.exports = filmsRoute;