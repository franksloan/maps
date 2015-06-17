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
	describe('link', function(){
		var data, $q, $rootScope, $compile, $window, html, element;		

		beforeEach(function(){
			mockd3Service = {};
			module('WorldMaps');

			module(function($provide){
				$provide.value('d3Service', mockd3Service)
			});

			inject(function($injector,_$compile_, _$rootScope_, _$window_, _$q_){
				// scope = $rootScope.$new();
				// d3ServiceMock = _d3ServiceMock_;
				// console.log(d3ServiceMock);
				// elem = angular.element(html);
				// isolated = elem.isolateScope();
				// compiled = $compile(elem);
				// compiled(scope);
				// scope.$digest();
				
				
				$window = _$window_;
				$compile = _$compile_;
				$rootScope = _$rootScope_;
				$q = _$q_;
			});
			mockd3Service.d3 = function(){
				var deferred = $q.defer();
				deferred.resolve($window.d3);
				// console.log(deferred.promise);
				return deferred.promise;
			}

		});

		it('created', function(){
			//check d3 service is running
			html = '<wm-map data="testData"></wm-map>';
			element = angular.element(html);
			element = $compile(html)($rootScope);
			$rootScope.testData = 'caaca';
			$rootScope.$digest();

			// console.log(element.isolateScope().$$listeners);
			// console.log(mockd3Service.d3());
			
			console.log(element);
			expect(element).toBeDefined();
		});
		
	})		

	// });
	function getSvg(){
		return d3.select('svg');
	}
})