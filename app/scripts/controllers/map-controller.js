var mapController = angular.module('mapController', ['ngDialog']);

//get directives
var wmMap = require('./../directives/wm-map');
//
//require services
var d3Service = require('./../services/d3Service');
var categoryService = require('./../services/category');
var worldMapService = require('./../services/worldMap');

module.exports = mapController
.factory('d3Service', ['$document', '$q', '$rootScope', '$window', d3Service])
.service('Category', ['$http', categoryService])
.service('WorldMap', ['d3Service', worldMapService])
.controller('MapCtrl', ['$scope', 'd3Service', 'Category', '$http',
	function($scope, d3Service, Category, $http) {
		//get the world data json file and set to controller's scope
		// d3Service.d3().then(function(d3){
			$http.get('world.json').success(function(world){
				$scope.countries = topojson.feature(world, world.objects.countries).features;
			});
			console.log($scope);
		// });
		
	}
])
.directive('wmMap', ['d3Service', 'Category', '$window', 'ngDialog', 'WorldMap', wmMap]);