var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var insertCountryDocument = function(db, options, callback){
	db.collection('countryInfo').insertOne(
	{
		"countryName" : options.countryName,
		"films": [options.data]
	}, function(err, result){
		assert.equal(err, null);
		console.log("Inserted a document into countryInfo.");
	    callback();
	})
}

//
//
// callback - 
var findCountryDocument = function(db, options, callback){
	var cursor = db.collection('countryInfo').find( { "countryName": options.countryName } );
	var countryMatchFound = false;   
    cursor.each(function(err, doc) {
	    assert.equal(err, null);
	    
	    if (doc != null) {
	        countryMatchFound = true;
        } else {
	      	// this will always get run - after the last object
	      	// is reached there will be a null object
	        callback(countryMatchFound);
	    }
    });
}

var countryAccess = function(){

	return {
		findCountryDocument : findCountryDocument,
		insertCountryDocument : insertCountryDocument
	}
}

module.exports = countryAccess;