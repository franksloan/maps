var travelScraper = require('./../webscrapers/travelScraper'),
	countryAccess = require('./../dbaccess/countryAccess'),
	mongoAccess = require('./../dbaccess/mongoAccess'),
	travelAccess = require('./../dbaccess/travelAccess');

var travelRoute = function(expressRouter){

	expressRouter.route('/travel/:country')
		.get(function(req, res, next){
			req.travelAccess = travelAccess();
			next();
		});

	// Does a recipe exist for this country, if so pass one back in the response and
	// add a new one to the database using 'scraper', if not use 'scraper' to populate the response
	// and to add one to the database.
	expressRouter.route('/travel/:country')
		.get(function(req, res, next){
			mongoAccess(req.options, req.travelAccess.selectSights,
				function(travelSights){
					// does a film exist (if it's not null)
					if(travelSights.length > 0){
						// send a film back in the response
						res.json(travelSights);
						// get a film using the scraper
						travelScraper(req.options.countryName.toLowerCase(), function(data){
							if(data == null){
								console.log('Nothing returned from scraper' + data);
							}
							req.options.data = data;
							mongoAccess(req.options, req.travelAccess.insertSight)
						});
					} else {
						// get a film using the scraper and then send it in the response
						travelScraper(req.options.countryName.toLowerCase(), function(data){
							console.log(data);
							if(!data){
								console.log('Nothing returned from scraper' + data);
							}
		
							travelSights.push(data);
							res.json(travelSights);
							// add a film to the db
							req.options.data = data;
							mongoAccess(req.options, req.travelAccess.insertSight)
						});
					}
				})
			
		});

	expressRouter.route('/totalsights/')
		.get(function(req, res){
			req.travelAccess = travelAccess();
			mongoAccess(null, req.travelAccess.totalSights, function(total){
				console.log('finished total: '+total);
				res.json({'totalSights': total});
			})
		})

	return expressRouter;
	
}

module.exports = travelRoute;