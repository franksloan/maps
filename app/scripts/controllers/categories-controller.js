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
				$scope.chosenCategory = 'country_intro';
				Category.setCategoryData('country_intro');
			});
			
			$scope.setCategory = function(category){
				$scope.chosenCategory = category;
				Category.setCategoryData(category);
			};
			
			var socket = io.connect();
			socket.on("updateFilmsTotal", function(data){
				var totalInCategory = data.total;
				$scope.categories['films'].total = totalInCategory;
			});
			socket.on("updateFoodTotal", function(data){
				var totalInCategory = data.total;
				$scope.categories['food'].total = totalInCategory;
			});
			socket.on("updateTravelTotal", function(data){
				var totalInCategory = data.total;
				$scope.categories['travel'].total = totalInCategory;
			});


			
			// On initialisation set the total number of films
			Category.getTotalFilms(function(totalFilms){
				$scope.categories.films.total = totalFilms;
			});
			// On initialisation set the total number of recipes
			Category.getTotalFood(function(totalFood){
				$scope.categories.food.total = totalFood;
			});
			// On initialisation set the total number of recipes
			Category.getTotalSights(function(totalSights){
				$scope.categories.travel.total = totalSights
			});
		}
	])
.directive('wmCategorySelect', wmCategorySelect)
.directive('wmCategoryItem', wmCategoryItem);