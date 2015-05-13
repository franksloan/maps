var InfoShowController = function($scope, $http) {
	$http.get('films.json').success(function(data){
		$scope.films = data;
	});
	$http.get('food.json').success(function(data){
		$scope.food = data;
	});
	
};

module.exports = InfoShowController;