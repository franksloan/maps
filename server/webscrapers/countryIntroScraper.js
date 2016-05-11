var request = require("request"),
	cheerio = require("cheerio"),
	lonelyPlanetUrl = "http://www.lonelyplanet.com";

var countryIntroScraper = function(countryName, callback){

		if(countryName === 'united states of america'){
			countryName = 'usa';
		}
		countryName = countryName.replace(/ /g, "-");
		var url = lonelyPlanetUrl+"/"+countryName;
		// Load the country page to scrape the 
		request(
			url, 
			function(error, response, html){
				
				var $ = cheerio.load(html, {
					normalizeWhitespace:true
				});

				// get lonely planet country introduction
				var countryIntroText = $('p', '#introduction').text();

				var countryIntro = {};
				countryIntro.url = lonelyPlanetUrl+'/'+countryName;
				countryName = countryName.replace(/-/g, " ");
				countryIntro.countryName = countryName;
				countryIntro.countryIntroText = countryIntroText.replace(/Read More/g, "");;
				var img = $('.slideshow__slide','.slideshow__images').attr('style');
				
				countryIntro.img = extractPartInBrackets(img);
				
				callback(countryIntro);
			}
		)
		
}

var extractPartInBrackets = function(string){
	if(string == null) return;
	var regExp = /\(([^)]+)\)/;
	var matches = regExp.exec(string);
	return matches[1];
}

module.exports = countryIntroScraper;