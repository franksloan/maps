var filters = function(app){

	app.filter('htmlToPlaintext', function() {
	    return function(text) {
	      return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
	    };
	  }
	);

	app.filter('capitalize', function(){
		return function(input, all) {
		  var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
		  return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
		}
	})
}

module.exports = filters;