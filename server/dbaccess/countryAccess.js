var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var insertCountryDocument = function(db, options, callback){
	db.collection('countryInfo').insertOne(
	{
		"countryName" : options.countryName
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
	    console.log(doc)
	    if (doc != null) {
	        countryMatchFound = true;
        } else {
	      	// this will always get run - after the last object
	      	// is reached there will be a null object
	        callback(countryMatchFound);
	    }
    });
}

var selectCountryIntro = function(db, options, callback){
	var cursor = db.collection('countryInfo').find( { "countryName": options.countryName } );
	
    cursor.each(function(err, doc) {
	    assert.equal(err, null);

	    if (doc && doc.countryIntro && doc.countryIntro.length > 0) {
	    	
	        callback(doc.countryIntro);
        } else if (doc != null) {
	      	// this will always get run - after the last object
	      	// is reached there will be a null object
	      	var countryIntro = [];
	      	callback(countryIntro);
	    }
    });
    
}

var insertCountryIntro = function(db, options){
	var countryIntro = options.data;
	db.collection('countryInfo').updateOne(
	{
		"countryName" : options.countryName
	},
	{
		"$addToSet": {"countryIntro": countryIntro }
	}, function(err, result){
		assert.equal(err, null);
		// If a film was added (i.e. the film didn't already exist)
		if(result.result.nModified == 1){
			console.log("Inserted " + countryIntro + " into " + options.countryName);
		}
	})
}

var countryAccess = function(){

	return {
		findCountryDocument : findCountryDocument,
		insertCountryDocument : insertCountryDocument,
		selectCountryIntro : selectCountryIntro,
		insertCountryIntro : insertCountryIntro
	}
}

module.exports = countryAccess;