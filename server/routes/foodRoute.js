var foodScraper = require('./../webscrapers/foodScraper'),
	countryAccess = require('./../dbaccess/countryAccess'),
	mongoAccess = require('./../dbaccess/mongoAccess'),
	foodAccess = require('./../dbaccess/foodAccess');

var foodRoute = function(expressRouter){

	expressRouter.route('/food/:country')
		.get(function(req, res, next){
			req.foodAccess = foodAccess();
			next();
		});

	// Does a recipe exist for this country, if so pass one back in the response and
	// add a new one to the database using 'scraper', if not use 'scraper' to populate the response
	// and to add one to the database.
	expressRouter.route('/food/:country')
		.get(function(req, res, next){
			mongoAccess(req.options, req.foodAccess.selectRecipe,
				function(recipes){
					// does a film exist (if it's not null)
					if(recipes.length > 0){
						// send a film back in the response
						res.json(recipes);
						// get a film using the scraper
						foodScraper(req.options.countryName.toLowerCase(), function(data){
							if(data == null){
								console.log('Nothing returned from scraper' + data);
							}
							req.options.data = data;
							mongoAccess(req.options, req.foodAccess.insertRecipe)
						});
					} else {
						// get a film using the scraper and then send it in the response
						foodScraper(req.options.countryName.toLowerCase(), function(data){
							console.log(data);
							if(!data){
								console.log('Nothing returned from scraper' + data);
							}
		
							recipes.push(data);
							res.json(recipes);
							// add a film to the db
							req.options.data = data;
							mongoAccess(req.options, req.foodAccess.insertRecipe)
						});
					}
				})
			
		});

	expressRouter.route('/totalfood/')
		.get(function(req, res){
			req.filmsAccess = foodAccess();
			mongoAccess(null, req.filmsAccess.totalRecipes, function(total){
				res.json({'totalFood': total});
			})
		})

	return expressRouter;
	
}

module.exports = foodRoute;