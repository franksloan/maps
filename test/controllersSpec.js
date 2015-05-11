//Run with 'karma start'
describe('Maps controllers', function(){
	describe('CatCtrl', function(){
		var scope, ctrl, $httpBackend;

		//load the module definition before each test
		beforeEach(module('WorldMaps'));
		

		beforeEach(inject(function(_$httpBackend_, $rootScope, $controller){
			$httpBackend = _$httpBackend_;
			$httpBackend.expectGET('categories.json')
				.respond([{title: "Food"},
						{title: "Film"},
						{title: "Music"},
						{title: "Language"}]);
			scope = $rootScope.$new();
			ctrl = $controller('CatCtrl', {$scope:scope} );
		}));

		it('should create "categories" model with 4 categories', inject(function($controller){				
			expect(scope.categories).toBeUndefined();
			$httpBackend.flush();

			expect(scope.categories).toEqual([{title: "Food"},
						{title: "Film"},
						{title: "Music"},
						{title: "Language"}]);
		}));
	});
})
