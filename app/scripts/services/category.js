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
		//find the clicked on country's data
		for(var i = 0; i < this.catData.length; i++){
			if(this.catData[i].country === country){
				return this.catData[i];
			}
		}
	};
};
module.exports = categoryService;