describe('d3 directives', function(){
	var map;
	console.log('testing d3');

	describe('d3Service', function(){
		beforeEach(module('WorldMaps'));

		beforeEach(inject(function(_d3Service_){
			d3Service = _d3Service_;			
		}));

		it('created', function(){
			//check d3 service is running
			expect(d3Service).toBeDefined();
		});
	})
	describe('d3', function(){
		var data, $q, $rootScope, $compile, $window, $httpBackend, $controller, html, element, $scope, ctrl;		

		beforeEach(function(){
			mockd3Service = {};
			mockMapService = {};
			module('WorldMaps');

			// mockMapService.setButtons = function(){
			// 	console.log('bty');
			// }

			module(function($provide){
				$provide.value('d3Service', mockd3Service);
				$provide.value('WorldMap', mockMapService);
			});

			inject(function($injector,_$compile_, _$rootScope_, _$window_, _$q_, _$controller_, _$httpBackend_, _d3Service_){
				
				$window = _$window_;
				$compile = _$compile_;
				$rootScope = _$rootScope_;
				$controller = _$controller_;
				$q = _$q_;
				$httpBackend = _$httpBackend_;
				
				// load in some mock data for http request
				$httpBackend.expectGET('world.json')
				.respond({arcs: ['abc'],
							objects: {countries: {geometries: [{arcs:[], id: "Netherlands", type: "Polygon"}]}},
							transform: {scale: [], translate: []},
							type: "Topology"}
							);
				
				$scope = $rootScope.$new();
				ctrl = $controller('MapCtrl', {'$scope' : $scope});

			});

			mockd3Service.d3 = function(){
				var deferred = $q.defer();
				deferred.resolve($window.d3);
				
				return deferred.promise;
			}
		});

		it('created', inject(function($controller){
			console.log(ctrl);
			$httpBackend.flush();
			//check d3 service is running
			html = '<wm-map></wm-map>';
			element = angular.element(html);
			element = $compile(html)($rootScope);
			$rootScope.$digest();

			expect($scope.countries).toBeUndefined();
			
			

			console.log($scope);
			
		}));
		
	})		

	// });
	function getSvg(){
		return d3.select('svg');
	}
})