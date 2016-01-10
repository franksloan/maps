var scraper = require('./scraper');

var router = function(expressRouter){
	// reload
	expressRouter.use(function(req, res, next){
		
		console.log('it is working');
		next();
	});

	expressRouter.get('/', function(req, res){
		res.json({message: 'hey'});
	});

	expressRouter.route('/films/:country')
		.get(function(req, res){
			var countryName = req.params.country;
			var data;
			var time1 = new Date().getTime();
			scraper(countryName.toLowerCase(), function(r){
				if(r == null){
					console.log(r);
				}
				console.log(r);
				data = r;
				res.json(data);
				console.log('server: '+(new Date().getTime() - time1)/1000);
			});
			
			
		});

	return expressRouter;
}

module.exports = router;