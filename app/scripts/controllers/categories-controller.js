var categoryController = angular.module('categoryController', []);
var InfoShowController = require('./info-show-controller');
var FoodCtrl = require('./food-detail-controller');
var FilmCtrl = require('./film-detail-controller');

//get directives
var wmCategorySelect = require('./../directives/wm-category-select');
var wmCategoryItem = require('./../directives/wm-category-item');
//

module.exports = categoryController.controller('CatCtrl', ['$scope', '$http',
		function($scope, $http) {
			$scope.testVar = {
				exclamation: 'Woooop',
				warning: 'Please do not'
			};
			$http.get('categories.json').success(function(data){
				$scope.categories = data;
			});
		}
	])
// .controller('InfoCtrl', ['$scope', '$http', InfoShowController])
.controller('FoodCtrl', ['$scope', '$http', FoodCtrl])
.controller('FilmCtrl', ['$scope', '$http', FoodCtrl])
.directive('wmCategorySelect', wmCategorySelect)
.directive('wmCategoryItem', wmCategoryItem);
// module.exports = CategoriesController;