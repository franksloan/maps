var request = require("request"),
	cheerio = require("cheerio"),
	getExternalInfo = require("./../externalInfo");

var scraper = function(countryName, callback){
	var filmInfo;
	request("http://www.imdb.com/country/", function(error, response, html){
		
		var $ = cheerio.load(html, {
				normalizeWhitespace:true
			});
		
		$('td').each(function(i, elem){
			
			if($(elem).children().text().toLowerCase().trim() == countryName){
				// Get the country code
				var countryCode = $(elem).children().attr('href');
				
				// Use the country code to get data for films from that country
				countryPage(countryCode, function(filmData){
					// only print one for now
					console.log('1');
					callback(filmData);
					
				});
				return false;
			} else if(countryName === 'united states of america') {
				console.log('Country not found');
				countryPage('/country/us', function(filmData){
					// only print one for now
					callback(filmData);
					
				});
				return false;
			}				
			
		})
	})
}

var countryPage = function(country, callback){
		
		var filmsArrayForChosenCountry = [];
		// Load the country page to scrape the 
		request(
			"http://www.imdb.com"+country, 
			function(error, response, html){
				
				var $ = cheerio.load(html, {
					normalizeWhitespace:true
				});
				// Get a random film for now
				// to do - look at number in db and get next one
				var suf = $('.results .detailed').slice(Math.floor(Math.random()*10));
				var urlFilmSuffix = suf.children().children().attr('href');
				var filmId = urlFilmSuffix.replace('/title/', '').replace('/','');
				getExternalInfo("http://www.omdbapi.com/?i="+filmId, function(filmForChosenCountry){						
						console.log('2');
						callback(filmForChosenCountry);
					});
			}
		)
		
}

module.exports = scraper;