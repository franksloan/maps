//define the module
var filmController = angular.module('filmController', []);
//require services
var categoryService = require('./../services/category');

module.exports = filmController
.service('Category', ['$http', categoryService])
.controller('FilmCtrl', ['$scope', '$routeParams', '$http', 'Category',
		function($scope, $routeParams, $http, Category) {
			Category.getCategory('films.json')
			.success(function(data){
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