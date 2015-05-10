//Run with 'karma start'
describe('CatCtrl', function(){

	beforeEach(module('WorldMaps'));
	
	it('should create "categories model with 3 categories', inject(function($controller){
		var scope = {},
			ctrl = $controller('CatCtrl', {$scope:scope} );
		expect(scope.categories.length).toBe(4);
	}));
});