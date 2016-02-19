var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
//

var insertRecipe = function(db, options){
	var recipe = options.data;
	db.collection('countryInfo').updateOne(
	{
		"countryName" : options.countryName
	},
	{
		"$addToSet": {"food": recipe}
	}, function(err, result){
		assert.equal(err, null);
		// If a film was added (i.e. the film didn't already exist)
		if(result.result.nModified == 1){
			totalRecipes(db, null, function(totalNumberOfRecipes){
				options.io.sockets.emit("updateFoodTotal", {total: totalNumberOfRecipes});
			})
			// socketsService().totalFilms(options.client);
			console.log("Inserted " + recipe.title + " into " + options.countryName);
		}
	})
}

var totalRecipes = function(db, options, callback){
	var cursor = db.collection('countryInfo').find();
	var numberOfRecipes = 0;
    cursor.each(function(err, doc) {
	    assert.equal(err, null);
	    
	    if (doc && doc.food) {
	    	
	    	numberOfRecipes += doc.food.length;
        } else if (doc == null) {
	      	callback(numberOfRecipes);
	    }
    }); 
}

//
var selectRecipe = function(db, options, callback){
	var cursor = db.collection('countryInfo').find( { "countryName": options.countryName } );
	
    cursor.each(function(err, doc) {
	    assert.equal(err, null);

	    if (doc && doc.food && doc.food.length > 0) {
	    	var l = doc.food.length;
	        // film = doc.films[Math.floor(Math.random()*l)];
	        callback(doc.food);
        } else if (doc != null) {
	      	// this will always get run - after the last object
	      	// is reached there will be a null object
	      	var food = [];
	      	callback(food);
	    }
    });
    
}

var foodAccess = function(){

	return {
		selectRecipe : selectRecipe,
		insertRecipe : insertRecipe,
		totalRecipes : totalRecipes
	}
}

module.exports = foodAccess;