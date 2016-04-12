var categoryService = function($http, $q){
	
	this.setCategoryData = function(category){
		this.name = category;
	}

	this.getCountryData = function(country){

		if(this.name == 'events'){
			if(country == "United States of America"){
				country = "USA";
			}
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

			return p.promise;

		} else {
			//find the clicked on country's data
			return $http.get('/api/'+this.name.toLowerCase()+'/'+country).then(function(response){
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

	this.getTotalEvents = function(callback){
		$http.get('/api/totalevents').then(function(response){
			callback(response.data.totalEvents);
		});
	}

	this.getTotalSights = function(callback){
		$http.get('/api/totalsights').then(function(response){
			callback(response.data.totalSights);
		});
	}

};
module.exports = categoryService;