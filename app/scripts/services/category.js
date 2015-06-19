var categoryService = function($http){
	
	this.setCategory = function(category){
		this.urlParam = category + '.json';
		var self = this;
		$http.get(this.urlParam)
			.success(function(data){
				self.catData = data;
			});
	};
	this.getCategory = function(country){
		for(var i = 0; i < this.catData.length; i++){
			if(this.catData[i].country === country){
				return this.catData[i];
			}
		}
	};
};
module.exports = categoryService;