var InfoShowController = function($scope, $http) {
	$scope.Info = {
		title: 'The Beach',
		text: 'Leonardo smokes in paradise'
	};
	$http.get('films.json').success(function(data){
		$scope.films = data;
	});
	
};

module.exports = InfoShowController;