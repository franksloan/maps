var categoryService = function($http){
	
	this.setCategory = function(category){
		console.log('does it reach this far?');
		this.urlParam = category;
	};
	this.getCategory = function(urlParam){
			return $http({method: "GET", url: urlParam});
	};
};
module.exports = categoryService;