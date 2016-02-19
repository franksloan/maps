var scraper = require('./../webscrapers/filmScraper'),
	countryAccess = require('./../dbaccess/countryAccess'),
	mongoAccess = require('./../dbaccess/mongoAccess'),
	filmsAccess = require('./../dbaccess/filmsAccess');

var countryParamRoute = function(expressRouter){

	expressRouter.param('country', function(req, res, next, country){
		req.options.countryName = country;
		req.countryAccess = countryAccess();
		next();
	});

	// Does the country exist, if not create it.
	expressRouter.param('country', function(req, res, next, country){
			// find the country in the database
			mongoAccess(req.options, req.countryAccess.findCountryDocument,
				// this is passed back from 
				function(countryMatchFound){
					
					if(countryMatchFound){
						console.log('MATCH');
						// the country exists so move onto the next route to find film
						next();
					} else {
						// country doesn't exist so create it
						console.log('NO MATCH');
						// Create the country
						mongoAccess(req.options, req.countryAccess.insertCountryDocument,
							function(){
								next();
							}
						);
					}
				}
			);
		});

	return expressRouter;
	
}

module.exports = countryParamRoute;