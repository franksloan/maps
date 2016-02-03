var categoryService = function($http){
	
	this.setCategoryData = function(category){
		this.name = category;
	};
	this.getCountryData = function(country){
		// for(var i = 0; i < this.catData.length; i++){
		// 	if(this.catData[i].country === country){
		// 		console.log(this.catData[i]);
		// 		// return this.catData[i];
		// 	}
		// }
		//find the clicked on country's data
		return $http.get('/api/'+this.name+'/'+country).then(function(response){
			return response.data;
		});	
	};

	this.getTotalFilms = function(callback){
		$http.get('/api/totalfilms').then(function(response){
			callback(response.data.totalFilms);
		})
}

};
module.exports = categoryService;