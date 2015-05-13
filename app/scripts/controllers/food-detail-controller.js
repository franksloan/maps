var foodController = angular.module('foodController', []);

module.exports = foodController.controller('FoodCtrl', ['$scope', '$routeParams', '$http',
		function($scope, $routeParams, $http) {

			$http.get('food.json').success(function(data){
				var l = data.length,
					i;
				for(i = 0; i < l; i++){
					if(data[i].id === $routeParams.foodId){
						$scope.food = data[i];
						return;
					}
				}
				$scope.food = data;
			});
		}
	]);