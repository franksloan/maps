var assert = require('assert');

var calculateTotals = function(db, options, callback){
	var cursor = db.collection('countryInfo').find();
	var numberOfFilms = 0;
    cursor.each(function(err, doc) {
	    assert.equal(err, null);
	    
	    if (doc && doc.films) {
	    	console.log(doc.countryName +': '+ doc.films.length);
	    	numberOfFilms += doc.films.length;
        } else if (doc == null) {
	      	callback(numberOfFilms);
	    }
    });
    
}

var categoryDetailsAccess = function(){

	return {
		calculateTotals : calculateTotals
	}
}

module.exports = categoryDetailsAccess;