(function(){

'use strict';

var CatCtrl = require('./controllers/categories-controller');
var FilmCtrl = require('./controllers/film-detail-controller');
var FoodCtrl = require('./controllers/food-detail-controller');
// var InfoShowController = require('./controllers/info-show-controller');
// var wmCategorySelect = require('./directives/wm-category-select');
// var wmCategoryItem = require('./directives/wm-category-item');

var mapsApp = angular.module('WorldMaps', [
	'ngRoute',
	'categoryController',
	'filmController',
	'foodController']);
mapsApp.config(['$routeProvider',
	function($routeProvider){
		$routeProvider.
			when('/main', {
				templateUrl: 'views/maps-main.html',
				controller: 'CatCtrl'
			}).
			when('/main/films/:filmId', {
				templateUrl: 'views/film-detail.html',
				controller: 'FilmCtrl'
			}).
			when('/main/food/:foodId', {
				templateUrl: 'views/food-detail.html',
				controller: 'FoodCtrl'
			}).
			// when('/main/music/:musicId', {
			// 	templateUrl: 'views/music-detail.html',
			// 	controller: 'InfoCtrl'
			// }).
			// when('/main/general/:generalId', {
			// 	templateUrl: 'views/general-detail.html',
			// 	controller: 'InfoCtrl'
			// }).
			otherwise({
				redirectTo: '/main'
			});

	}
	]);
// mapsApp.controller('CatCtrl', ['$scope', '$http', CategoriesController]);
// mapsApp.controller('InfoCtrl', ['$scope', '$http', InfoShowController]);
// mapsApp.directive('wmCategorySelect', wmCategorySelect);
// mapsApp.directive('wmCategoryItem', wmCategoryItem);


})();