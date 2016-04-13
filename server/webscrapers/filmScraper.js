var request = require("request"),
	cheerio = require("cheerio"),
	getExternalInfo = require("./../externalInfo");

var scraper = function(countryName, callback){
	var filmInfo;
	request("http://www.imdb.com/country/", function(error, response, html){
		
		var $ = cheerio.load(html, {
				normalizeWhitespace:true
			});
		// count how far through we are
		var tds = 0;
		
		$('td').each(function(i, elem){
			tds++;
			
			if($(elem).children().text().toLowerCase().trim() == countryName){
				// Get the country code
				var countryCode = $(elem).children().attr('href');
				
				// Use the country code to get data for films from that country
				getCountryPage(countryCode, function(filmData){
					// only print one for now
					callback(filmData);
					
				});
				return false;
				
			} else if(countryName === 'united states of america') {
				
				getCountryPage('/country/us', function(filmData){
					
					callback(filmData);
					
				});
				return false;

			//if in here it means the country probably hasn't been found
			} else if ( tds == $('td').length) {
				var noFilmFound = {};
				callback(noFilmFound);
			}		
			
		})
	})
}

var getCountryPage = function(country, callback){
		
	var filmsArrayForChosenCountry = [];
	// Load the country page to scrape the top 10 films
	request(
		"http://www.imdb.com"+country, 
		function(error, response, html){
			
			var $ = cheerio.load(html, {
				normalizeWhitespace:true,
				decodeEntities: false
			});
			// Get a random film
			var suf = $('.results .detailed').slice(Math.floor(Math.random()*10));
			var urlFilmSuffix = suf.children().children().attr('href');
			var filmId = urlFilmSuffix.replace('/title/', '').replace('/','');
			getExternalInfo("http://www.omdbapi.com/?i="+filmId, function(filmForChosenCountry){				
					callback(filmForChosenCountry);
				});
		}
	)	
}

module.exports = scraper;