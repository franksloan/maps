var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var insertFilm = function(db, options, callback){
	db.collection('countryInfo').insertOne(
	{
		"countryName" : options.countryName,
		"films": [options.data]
	}, function(err, result){
		assert.equal(err, null);
		console.log("Inserted a film into " + options.countryName);
	    callback();
	})
}

//
//
// callback - 
var selectFilm = function(db, options, callback){
	var cursor = db.collection('countryInfo').find( { "countryName": options.countryName } );
	var film = null;   
    cursor.each(function(err, doc) {
	    assert.equal(err, null);
	    
	    if (doc != null) {
	    	console.log(doc.films);
	        film = doc.films[0];
        } else {
	      	// this will always get run - after the last object
	      	// is reached there will be a null object
	        callback(film);
	    }
    });
}

var countryAccess = function(){

	return {
		selectFilm : selectFilm,
		insertFilm : insertFilm
	}
}

module.exports = countryAccess;