var CategoriesController = function($scope, $http) {
	$scope.testVar = {
		exclamation: 'Woooop',
		warning: 'Please do not'
	};
	$http.get('categories.json').success(function(data){
		$scope.categories = data;
	});
};
module.exports = CategoriesController;