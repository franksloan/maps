var mapController = angular.module('mapController', []);

//get directives
var wmMap = require('./../directives/wm-map');
//
//require services
var d3Service = require('./../services/d3Service');

module.exports = mapController
.factory('d3Service', ['$document', '$q', '$rootScope', d3Service])
.controller('MapCtrl', ['$scope', '$http', 'd3Service',
		function($scope, $http, d3Service) {
			
		}
	])
.directive('wmMap', ['d3Service', wmMap]);