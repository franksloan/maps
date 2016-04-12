var countryIntroScraper = require('./../webscrapers/countryIntroScraper'),
	countryAccess = require('./../dbaccess/countryAccess'),
	mongoAccess = require('./../dbaccess/mongoAccess');

var countryIntroRoute = function(expressRouter){

	expressRouter.route('/country_intro/:country')
		.get(function(req, res, next){
			req.countryAccess = countryAccess();
			next();
		});

	// Does a recipe exist for this country, if so pass one back in the response and
	// add a new one to the database using 'scraper', if not use 'scraper' to populate the response
	// and to add one to the database.
	expressRouter.route('/country_intro/:country')
		.get(function(req, res, next){
			mongoAccess(req.options, req.countryAccess.selectCountryIntro,
				function(countryIntro){
					// does an intro exist (if array is not empty)
					if(countryIntro.length > 0){
						// send a film back in the response
						res.json(countryIntro);
					} else {
						// get a film using the scraper and then send it in the response
						countryIntroScraper(req.options.countryName.toLowerCase(), function(data){
							console.log(data);
							if(!data){
								console.log('Nothing returned from scraper' + data);
							}
							
							// even though there is only 1 intro populate array
							countryIntro.push(data);
							res.json(countryIntro);
							// add a film to the db
							req.options.data = data;
							mongoAccess(req.options, req.countryAccess.insertCountryIntro);
						});
					}
				})
			
		});

	return expressRouter;
	
}

module.exports = countryIntroRoute;