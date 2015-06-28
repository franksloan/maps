// //Run with 'karma start'
// describe('Maps controllers', function(){
// 	//test the categories controller that the correct json is received
// 	describe('CatCtrl', function(){
// 		var scope, ctrl, $httpBackend;

// 		//load the module definition before each test
// 		beforeEach(module('WorldMaps'));
		

// 		beforeEach(inject(function(_$httpBackend_, $rootScope, $controller){
// 			$httpBackend = _$httpBackend_;
// 			$httpBackend.expectGET('categories.json')
// 				.respond([{title: "Food"},
// 						{title: "Film"},
// 						{title: "Music"},
// 						{title: "Language"}]);
// 			scope = $rootScope.$new();
// 			ctrl = $controller('CatCtrl', {$scope:scope} );
// 		}));

// 		it('should create "categories" model with 4 categories', inject(function($controller){				
// 			expect(scope.categories).toBeUndefined();
// 			$httpBackend.flush();

// 			expect(scope.categories).toEqual([{title: "Food"},
// 						{title: "Film"},
// 						{title: "Music"},
// 						{title: "Language"}]);
// 		}));
// 	});
// 	//film controller test
// 	describe('FilmCtrl', function(){
// 		var scope, ctrl, $httpBackend;

// 		//load the module definition before each test
// 		beforeEach(module('WorldMaps'));
		
// 		//mock json load before assertion
// 		beforeEach(inject(function(_$httpBackend_, $rootScope, $controller){
// 			$httpBackend = _$httpBackend_;
// 			$httpBackend.expectGET('films.json')
// 				.respond([{"id": "the-beach",
// 						"title": "The Beach",
// 						"actors": ["Leonardo di Caprio"]
// 						},
// 						{
// 						"id": "shawshank-redemption",
// 						"title": "Shawshank redemption",
// 						"actors": ["Morgan Freeman", "Tim Robbins"]
// 						}
// 					]);
// 			scope = $rootScope.$new();
// 			ctrl = $controller('FilmCtrl', {$scope:scope} );
// 		}));

// 		it('should create film model with 2 films', function(){				
// 			expect(scope.films).toBeUndefined();
// 			$httpBackend.flush();

// 			expect(scope.films).toEqual([{"id": "the-beach",
// 						"title": "The Beach",
// 						"actors": ["Leonardo di Caprio"]
// 						},
// 						{
// 						"id": "shawshank-redemption",
// 						"title": "Shawshank redemption",
// 						"actors": ["Morgan Freeman", "Tim Robbins"]
// 						}
// 					]);
// 		});

// 		//test on the same controller that for the detail page the correct
// 		//object is passed in from json array
// 		it('should only load film detail from parameter', inject(function($routeParams){
// 			expect(scope.film).toBeUndefined();
// 			$routeParams.filmId = 'the-beach';
// 			$httpBackend.flush();

// 			expect(scope.film).toEqual({"id": "the-beach",
// 							"title": "The Beach",
// 							"actors": ["Leonardo di Caprio"]});
// 		}));
// 	});

// 	//food controller pages
// 	describe('FoodCtrl', function(){
// 		var scope, ctrl, $httpBackend;

// 		//load the module definition before each test
// 		beforeEach(module('WorldMaps'));
		
// 		//mock json load before assertion
// 		beforeEach(inject(function(_$httpBackend_, $rootScope, $controller){
// 			$httpBackend = _$httpBackend_;
// 			$httpBackend.expectGET('food.json')
// 				.respond([{
// 						"id": "chilli-con-carne",
// 						"name": "Chilli con Carne",
// 						"ingredients": ["Minced beef", "tomato", "kidney beans"]
// 						},
// 						{
// 						"id": "chicken-korma",
// 						"name": "Chicken korma",
// 						"ingredients": ["Chicken", "Curry sauce"]
// 						}
// 					]);
// 			scope = $rootScope.$new();
// 			ctrl = $controller('FoodCtrl', {$scope:scope} );
// 		}));

// 		it('should get food detail', function(){				
// 			expect(scope.food).toBeUndefined();
// 			$httpBackend.flush();

// 			expect(scope.food).toEqual([{
// 						"id": "chilli-con-carne",
// 						"name": "Chilli con Carne",
// 						"ingredients": ["Minced beef", "tomato", "kidney beans"]
// 						},
// 						{
// 						"id": "chicken-korma",
// 						"name": "Chicken korma",
// 						"ingredients": ["Chicken", "Curry sauce"]
// 						}
// 					]);
// 		});

// 		//test on the same controller that for the detail page the correct
// 		//object is passed in from json array
// 		it('should only load food detail from parameter', inject(function($routeParams){
// 			expect(scope.food).toBeUndefined();
// 			$routeParams.foodId = 'chicken-korma';
// 			$httpBackend.flush();

// 			expect(scope.food).toEqual({
// 							"id": "chicken-korma",
// 							"name": "Chicken korma",
// 							"ingredients": ["Chicken", "Curry sauce"]
// 							});
// 		}));
// 	});
// });
