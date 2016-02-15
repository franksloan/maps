var categoryService = function($http){
	
	this.setCategoryData = function(category){
		this.name = category;
	}
	
	this.getCountryData = function(country){
		//find the clicked on country's data
		return $http.get('/api/'+this.name+'/'+country).then(function(response){
			return response.data;
		});	
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