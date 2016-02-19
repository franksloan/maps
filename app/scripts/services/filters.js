var filters = function(app){

	app.filter('htmlToPlaintext', function() {
	    return function(text) {
	      return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
	    };
	  }
	);
}

module.exports = filters;