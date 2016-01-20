var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/maps';

// data (optional)
var mongoAccess = function(options, accessMethod, callback){
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  accessMethod(db, options, function(data) {
	  	  
	      db.close();
	      // data is passed back from the accessMethod
	      callback(data);
	  });
	});
}

module.exports = mongoAccess;