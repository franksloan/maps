var countryJS = require('countryjs');
var request = require("request"),
	cheerio = require("cheerio");

var foodScraper = function(countryName, callback){
	var filmInfo;
	var demonym = countryJS.demonym(countryName, 'name');
	console.log(countryName);
	console.log(demonym);
	var regions = ['africa', 'caribbean', 'central-america', 'central-asia', 'east-asia', 
		'europe', 'middle-east', 'north-america', 'pacific', 'south-america'];
	
	for(var i = 0; i < regions.length; i++){

		var url = 'http://www.whats4eats.com/'+regions[i]+'/'+countryName+'-cuisine';

		request(url, function(error, response, html){
			
			var $ = cheerio.load(html, {
					normalizeWhitespace:true
				});

			var title = $('.title', '.region-content').html();
			console.log(title);
			if(title != 'Page Not Found'){
				$('.views-row','.region-content').each(function(i, elem){
					var suffix = $('a', elem).attr('href');
					console.log(suffix);
					if(i == 0){			
						getFoodInfo(suffix, function(foodInfo){
							callback(foodInfo);
						});
					}
				});
			}
			
			
		})
	}
}

var getFoodInfo = function(suffix, callback){
	var url = 'http://www.whats4eats.com'+suffix;
	request(url, function(error, response, html){
		var $ = cheerio.load(html, {
				normalizeWhitespace:true
			});
		var foodInfo = {};
		foodInfo.url = url;
		var article = $('article', '.region-content');

		var title = $('.title', article).html();
		foodInfo.title = title;

		var img = $('img', article).attr('src');
		foodInfo.img = img;

		var teaser = $('#teaser', article).text();
		foodInfo.teaser = teaser;

		var averageRating = $('.average-rating', article);
		averageRating = $('span', averageRating).text();
		foodInfo.averageRating = averageRating;

		callback(foodInfo);
	});
}

module.exports = foodScraper;