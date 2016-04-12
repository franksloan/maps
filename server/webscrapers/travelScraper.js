var request = require("request"),
	cheerio = require("cheerio"),
	lonelyPlanetUrl = "http://www.lonelyplanet.com";

var travelScraper = function(countryName, callback){

		if(countryName === 'united states of america'){
			countryName = 'usa';
		}
		countryName = countryName.replace(/ /g, "-");

		var url = lonelyPlanetUrl+"/"+countryName+"/sights";
		
		// Load the country page to scrape the 
		request(
			url, 
			function(error, response, html){
				
				var $ = cheerio.load(html, {
					normalizeWhitespace:true
				});

				var sights = $('#js-results', '.stack__content');
				
				var articles = $('article', sights);
				var randomArticleNumber = Math.floor(Math.random()*articles.length)
				
				var article = $('a', articles[randomArticleNumber]);

				var sightInfo = {};

				sightInfo.url = lonelyPlanetUrl + article.attr('href');
				console.log(sightInfo.url);
				sightInfo.img = $('img', article).attr('src');
				sightInfo.travelCategory = $('.card__content__context', article).text();
				sightInfo.sightName = $('.card__content__title', article).text();
				sightInfo.sightDescription = $('.card__content__desc', article).text();
				
				callback(sightInfo);
			}
		)
		
}

module.exports = travelScraper;