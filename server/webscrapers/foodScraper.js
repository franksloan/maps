var request = require("request"),
	cheerio = require("cheerio"),
	pageNotFound = 'Page Not Found';

var foodScraper = function(countryName, callback){
	
	var regions = ['africa', 'caribbean', 'central-america', 'central-asia', 'east-asia', 
		'europe', 'middle-east', 'north-america', 'pacific', 'south-america'];
	var title = pageNotFound;

	for(var i = 0; title == pageNotFound && i < regions.length; i++){
		
		if(countryName === 'united states of america'){
			countryName = 'united states';
		} else if (countryName === 'united kingdom'){
			countryName = 'england';
		}

		countryName = countryName.replace(/ /g, "-");
		
		var url = 'http://www.whats4eats.com/'+regions[i]+'/'+countryName+'-cuisine';

		request(url, function(error, response, html){
			
			var $ = cheerio.load(html, {
					normalizeWhitespace:true
				});

			title = $('.title', '.region-content').html();
			
			if(title != pageNotFound){
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
				normalizeWhitespace:true,
				decodeEntities: false
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