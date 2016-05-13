var request = require("request"),
	cheerio = require("cheerio"),
	pageNotFound = 'Page Not Found',
	whats4eatsUrl = 'http://www.whats4eats.com';

var foodScraper = function(countryName, callback){
	
	var regions = ['africa', 'caribbean', 'central-america', 'central-asia', 'east-asia', 
		'europe', 'middle-east', 'north-america', 'pacific', 'south-america'];
	var title = pageNotFound;
	var requests = 0;
	var recipeFound = false;

	for(var i = 0; title == pageNotFound && i < regions.length; i++){
		
		if(countryName === 'united states of america'){
			countryName = 'united states';
		} else if (countryName === 'united kingdom'){
			countryName = 'england';
		}

		countryName = countryName.replace(/ /g, "-");
		
		var url = whats4eatsUrl+'/'+regions[i]+'/'+countryName+'-cuisine';

		request(url, function(error, response, html){
			requests++;

			var $ = cheerio.load(html, {
					normalizeWhitespace:true
				});
			
			title = $('.title', '.region-content').html();
			
			if(title != pageNotFound){
				recipeFound = true;
				var howManyRecipes = $('.views-row','.region-content').length;
				var randomRecipeIndex = Math.floor(Math.random()*howManyRecipes);
				$('.views-row','.region-content').each(function(j, elem){
					if(j == randomRecipeIndex){
						var suffix = $('a', elem).attr('href');
						getFoodInfo(suffix, function(foodInfo){
							callback(foodInfo);
						});
					}
				});
			// if nothing is found a callback still needs to run else 
			// calling function will think that a recipe is still being searched for
			} else if (requests == regions.length && !recipeFound){
				var nothingFound = {};
				callback(nothingFound);
			}
		});
	}
}

var getFoodInfo = function(suffix, callback){
	var url = whats4eatsUrl+suffix;
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