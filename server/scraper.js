var request = require("request"),
	cheerio = require("cheerio"),
	getExternalInfo = require("./externalInfo");

var scraper = function(countryName, call){
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
					call(filmData);
					
				});
				return false;
			} else if(countryName === 'united states of america') {
				console.log('Country not found');
				countryPage('/country/us', function(filmData){
					// only print one for now
					call(filmData);
					
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
				//grabs a film
				// $('.results .detailed').each(function(i, elem){
					
				// 	var urlFilmSuffix = $(elem).children().children().attr('href');
				// 	var id = urlFilmSuffix.replace('/title/', '').replace('/','');
					
				// 	var time1 = new Date().getTime();
				// 	// Use IMDB API to grab info for each of the top 10 films
				// 	getExternalInfo("http://www.omdbapi.com/?i="+id, function(data){						
				// 		// console.log(data);
				// 		// console.log('\n');
				// 		filmsArrayForChosenCountry.push(data);
				// 		console.log((new Date().getTime() - time1)/1000);
				// 		if(filmsArrayForChosenCountry.length == 1){
							
				// 			callback(filmsArrayForChosenCountry);
				// 		}
				// 	});
					
				// });
			}
		)
		
}

module.exports = scraper;