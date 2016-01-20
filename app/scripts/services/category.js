var categoryService = function($http){
	
	this.setCategoryData = function(category){
		this.name = category;
		this.urlParam = category + '.json';
		var self = this;
		//load the json file for the chosen category
		$http.get(this.urlParam)
			.success(function(data){
				self.catData = data;
			});
	};
	this.getCountryData = function(country){
		for(var i = 0; i < this.catData.length; i++){
			if(this.catData[i].country === country){
				console.log(this.catData[i]);
				// return this.catData[i];
			}
		}
		//find the clicked on country's data
		console.log(this.name);
		return $http.get('/api/'+this.name+'/'+country).then(function(response){
			console.log(response.data);
			return response.data;
		});	
	};
};
module.exports = categoryService;