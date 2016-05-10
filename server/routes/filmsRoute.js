var filmScraper = require('./../webscrapers/filmScraper'),
	mongoAccess = require('./../dbaccess/mongoAccess'),
	filmsAccess = require('./../dbaccess/filmsAccess');

var filmsRoute = function(expressRouter){

	expressRouter.route('/films/:country')
		.get(function(req, res, next){
			req.filmsAccess = filmsAccess();
			next();
		});

	// Does a film exist for this country, if so pass one back in the response and
	// add a new one to the database using 'scraper', if not use 'scraper' to populate the response
	// and to add one to the database.
	expressRouter.route('/films/:country')
		.get(function(req, res, next){
			mongoAccess(req.options, req.filmsAccess.selectFilm,
				function(films){
					// does a film exist (if array empty)
					if(films.length > 0){
						// send a film back in the response
						res.json(films);
						// get a film using the scraper
						filmScraper(req.options.countryName.toLowerCase(), function(data){
							if(data == null){
								console.log('Nothing returned from scraper' + data);
							}
							req.options.data = data;
							mongoAccess(req.options, req.filmsAccess.insertFilm)
						});
					} else {
						// get a film using the scraper and then send it in the response
						filmScraper(req.options.countryName.toLowerCase(), function(data){
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
				res.json({'totalFilms': total});
			})
		})

	return expressRouter;
	
}

module.exports = filmsRoute;