var foodController = angular.module('foodController', []);

//require services
var categoryService = require('./../services/categoryService');

module.exports = foodController
.service('Category', ['$http', categoryService])
.controller('FoodCtrl', ['$scope', '$routeParams', '$http', 'Category',
		function($scope, $routeParams, $http, Category) {
			Category.getCategory('food.json')
			.success(function(data){
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