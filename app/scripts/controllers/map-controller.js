var mapController = angular.module('mapController', []);

//get directives
var wmMap = require('./../directives/wm-map');
//
//require services
var d3Service = require('./../services/d3Service');

module.exports = mapController
.factory('d3Service', ['$document', '$q', '$rootScope', '$window', d3Service])
.controller('MapCtrl', ['$scope', 'd3Service',
	function($scope, d3Service) {
		//get the world data json file and set to controller's scope
		d3.json("world.json", function(error, world) {
			if (error) return console.error(error);
			$scope.$apply(function(){
				$scope.countries = topojson.feature(world, world.objects.countries).features;
			})
		})
	}
])
.directive('wmMap', ['d3Service', '$window', wmMap]);