var filmController = angular.module('filmController', []);

module.exports = filmController.controller('FilmCtrl', ['$scope', '$routeParams', '$http',
		function($scope, $routeParams, $http) {

			$http.get('films.json').success(function(data){
				var l = data.length,
					i;
				for(i = 0; i < l; i++){
					if(data[i].id === $routeParams.filmId){
						$scope.film = data[i];
						return;
					}
				}
				$scope.films = data;
			});
		}
	]);