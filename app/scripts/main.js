(function(){

	'use strict';

	var CatCtrl = require('./controllers/categories-controller');
	var MapCtrl = require('./controllers/map-controller');
	var DialogCtrl = require('./controllers/dialog-controller');
	var filters = require('./services/filters');

	var mapsApp = angular.module('WorldMaps', [
		'ngRoute',
		'categoryController',
		'mapController'
		]);
	mapsApp.config(['$routeProvider',
		function($routeProvider){
			$routeProvider.
				otherwise({
					redirectTo: '/'
				});
		}]
	);
	filters(mapsApp);
})();