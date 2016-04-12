var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
//

var insertSight = function(db, options){
	var travelSight = options.data;
	db.collection('countryInfo').updateOne(
	{
		"countryName" : options.countryName
	},
	{
		"$addToSet": {"travel": travelSight}
	}, function(err, result){
		assert.equal(err, null);
		// If a film was added (i.e. the film didn't already exist)
		if(result.result.nModified == 1){
			totalSights(db, null, function(totalNumberOfSights){
				options.io.sockets.emit("updateTravelTotal", {total: totalNumberOfSights});
			})
			// socketsService().totalFilms(options.client);
			console.log("Inserted " + travelSight.sightName + " into " + options.countryName);
		}
	})
}

var totalSights = function(db, options, callback){
	var cursor = db.collection('countryInfo').find();
	var numberOfSights = 0;
    cursor.each(function(err, doc) {
	    assert.equal(err, null);
	    
	    if (doc && doc.travel) {
	    	
	    	numberOfSights += doc.travel.length;
        } else if (doc == null) {
	      	callback(numberOfSights);
	    }
    }); 
}

//
var selectSights = function(db, options, callback){
	var cursor = db.collection('countryInfo').find( { "countryName": options.countryName } );
	
    cursor.each(function(err, doc) {
	    assert.equal(err, null);

	    if (doc && doc.travel && doc.travel.length > 0) {
	    	var l = doc.travel.length;
	        // film = doc.films[Math.floor(Math.random()*l)];
	        callback(doc.travel);
        } else if (doc != null) {
	      	// this will always get run - after the last object
	      	// is reached there will be a null object
	      	var travel = [];
	      	callback(travel);
	    }
    });
    
}

var travelAccess = function(){

	return {
		selectSights : selectSights,
		insertSight : insertSight,
		totalSights : totalSights
	}
}

module.exports = travelAccess;