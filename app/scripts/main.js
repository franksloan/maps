(function(){

'use strict';

var CatCtrl = require('./controllers/categories-controller');
var FilmCtrl = require('./controllers/film-detail-controller');
var FoodCtrl = require('./controllers/food-detail-controller');
var MapCtrl = require('./controllers/map-controller');
var DialogCtrl = require('./controllers/dialog-controller');

var mapsApp = angular.module('WorldMaps', [
	'ngRoute',
	'categoryController',
	'filmController',
	'foodController',
	'mapController'
	]);
mapsApp.config(['$routeProvider',
	function($routeProvider){
		$routeProvider.
			when('/', {
				templateUrl: 'views/film.html',
				controller: 'FilmCtrl'
			}).
			when('/films/', {
				templateUrl: 'views/film.html',
				controller: 'FilmCtrl'
			}).
			when('/food/', {
				templateUrl: 'views/food.html',
				controller: 'FoodCtrl'
			}).
			when('/films/:filmId', {
				templateUrl: 'views/film-detail.html',
				controller: 'FilmCtrl'
			}).
			when('/food/:foodId', {
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
				redirectTo: '/'
			});

	}
	]);
})();