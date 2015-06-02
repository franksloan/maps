var categoryController = angular.module('categoryController', []);

//get directives
var wmCategorySelect = require('./../directives/wm-category-select');
var wmCategoryItem = require('./../directives/wm-category-item');
//
//require services
var categoryService = require('./../services/category');

module.exports = categoryController
.service('Category', ['$http', categoryService])
.controller('CatCtrl', ['$scope', '$http', 'Category',
		function($scope, $http, Category) {
			$http.get('categories.json').success(function(data){
				$scope.categories = data;
			});
			$scope.setCategory = function(){
				console.log('hmmph');
				Category.setCategory('films.json');
			};
		}
	])
.directive('wmCategorySelect', wmCategorySelect)
.directive('wmCategoryItem', wmCategoryItem);