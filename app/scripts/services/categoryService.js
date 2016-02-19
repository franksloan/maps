var categoryService = function($http, $q){
	
	this.setCategoryData = function(category){
		this.name = category;
	}

	this.getCountryData = function(country){

		if(this.name == 'events'){
			var oArgs = {

			      app_key: "qw8jN8Ld4564FZBm",

			      q: "music",

			      where: country,
			      image_size: "thumb",

			      page_size: 5

			   };

			var p = $q.defer();
			EVDB.API.call("/events/search", oArgs, function(oData) {
				p.resolve(oData.events.event);
			})
				
				console.log(p);
				return p.promise;

			// return EVDB.API.call("/events/search", oArgs, function(oData) {
			// 	console.log(oData.events);
			// 	var p = $q.defer();
			// 	p.resolve(oData.events);
			// 	console.log(p);
			// 	return p.promise;
		 //    // Note: this relies on the custom toString() methods below
		 //  	});	
		} else {
			//find the clicked on country's data
			return $http.get('/api/'+this.name+'/'+country).then(function(response){
				return response.data;
			});	
		}
	}

	this.getTotalFilms = function(callback){
		$http.get('/api/totalfilms').then(function(response){
			callback(response.data.totalFilms);
		});
	}

	this.getTotalFood = function(callback){
		$http.get('/api/totalfood').then(function(response){
			callback(response.data.totalFood);
		});
	}

};
module.exports = categoryService;