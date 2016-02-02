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
				Category.setCategoryData('food');
			});
			$scope.count = 0;
			$scope.setCategory = function(category){
				$scope.chosenCategory = category;
				Category.setCategoryData(category);
			};
			$scope.getCategory = function(){
				console.log(Category.catData);
			};
			var socket = io.connect();
			socket.on("happy", function(data){
				console.log(data);
			})
			// Category.getTotalFilms().then(function(total){

			// });
			$http.get('/api/totalnumbers').then(function(response){
						console.log(response.data.totalFilms);
						$scope.total = response.data.totalFilms;
						console.log($scope.categories[1]);
						for(var i = 0; i < $scope.categories.length; i++){
							
							if($scope.categories[i].title == 'films'){
								$scope.categories[i].total = response.data.totalFilms;
							}
						}
					});
			$scope.$on('updateNumber', function(event, args){
				console.log('updating Numbers')
				$scope.categories[1].total++;
			});
		}
	])
.directive('wmCategorySelect', wmCategorySelect)
.directive('wmCategoryItem', wmCategoryItem);