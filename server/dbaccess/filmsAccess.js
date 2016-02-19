var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
//

var insertFilm = function(db, options){
	var film = options.data;
	db.collection('countryInfo').updateOne(
	{
		"countryName" : options.countryName
	},
	{
		"$addToSet": {"films": film }
	}, function(err, result){
		assert.equal(err, null);
		// If a film was added (i.e. the film didn't already exist)
		if(result.result.nModified == 1){
			totalFilms(db, null, function(totalNumberOfFilms){
				options.io.sockets.emit("updateFilmsTotal", {total: totalNumberOfFilms});
			})
			// socketsService().totalFilms(options.client);
			console.log("Inserted " + film.Title + " into " + options.countryName);
		}
	})
}

var totalFilms = function(db, options, callback){
	var cursor = db.collection('countryInfo').find();
	var numberOfFilms = 0;
    cursor.each(function(err, doc) {
	    assert.equal(err, null);
	    
	    if (doc && doc.films) {
	    	
	    	numberOfFilms += doc.films.length;
        } else if (doc == null) {
	      	callback(numberOfFilms);
	    }
    }); 
}

//
var selectFilm = function(db, options, callback){
	var cursor = db.collection('countryInfo').find( { "countryName": options.countryName } );
	  
    cursor.each(function(err, doc) {
	    assert.equal(err, null);

	    if (doc && doc.films && doc.films.length > 0) {
	    	var l = doc.films.length;
	        // film = doc.films[Math.floor(Math.random()*l)];
	        callback(doc.films);
        } else if (doc != null) {
	      	// this will always get run - after the last object
	      	// is reached there will be a null object
	      	var films = [];
	      	callback(films);
	    }
    });
    
}

var filmsAccess = function(){

	return {
		selectFilm : selectFilm,
		insertFilm : insertFilm,
		totalFilms : totalFilms
	}
}

module.exports = filmsAccess;