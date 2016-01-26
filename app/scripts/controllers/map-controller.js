var mapController = angular.module('mapController', ['ngDialog']);

//get directives
var wmMap = require('./../directives/wm-map');
//
//require services
var d3Service = require('./../services/d3Service');
var topojsonService = require('./../services/topojsonService');
var categoryService = require('./../services/category');
var worldMapService = require('./../services/worldMap');

var DialogCtrl = require('./dialog-controller');

module.exports = mapController
.factory('d3Service', ['$document', '$q', '$rootScope', '$window', d3Service])
.factory('topojsonService', ['$document', '$q', '$rootScope', '$window', topojsonService])
.service('Category', ['$http', categoryService])
.service('WorldMap', ['d3Service', worldMapService])
.controller('MapCtrl', ['$scope', 'd3Service', 'topojsonService', 'Category', '$http',
	function($scope, d3Service, topojsonService, Category, $http) {
		topojsonService.topo().then(function(topojson) {
			//get the world data json file and set to controller's scope
			$http.get('world.json').success(function(world){
				$scope.countries = topojson.feature(world, world.objects.countries).features;
			});
		})
		
	}
])

.directive('wmMap', ['d3Service', 'Category', '$window', 'ngDialog', 'WorldMap', wmMap])
.controller('DialogCtrl', ['$scope', '$rootScope', DialogCtrl]);