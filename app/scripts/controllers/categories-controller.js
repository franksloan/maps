var categoryController = angular.module('categoryController', []);

//get directives
var wmCategorySelect = require('./../directives/wm-category-select');
var wmCategoryItem = require('./../directives/wm-category-item');
//
//require services
var categoryService = require('./../services/categoryService');

module.exports = categoryController
.service('Category', ['$http', categoryService])
.controller('CatCtrl', ['$scope', '$http', 'Category',
		function($scope, $http, Category) {

			$http.get('categories.json').success(function(data){
				$scope.categories = data;
				$scope.chosenCategory = 'food';
				// Category.setCategoryData('food');
			});
			$scope.count = 0;
			$scope.setCategory = function(category){
				$scope.chosenCategory = category;
				Category.setCategoryData(category);
			};
			// $scope.getCategory = function(){
			// 	console.log(Category.catData);
			// };
			var socket = io.connect();
			socket.on("updateFilmsTotal", function(data){
				var totalFilms = data.total;
				$scope.categories.films.total = totalFilms;
			})
			// On initialisation set the total number of films
			Category.getTotalFilms(function(totalFilms){
				$scope.categories.films.total = totalFilms;
			});
		}
	])
.directive('wmCategorySelect', wmCategorySelect)
.directive('wmCategoryItem', wmCategoryItem);