var chai = require('chai');
var assert = chai.assert;
var mockery = require('mockery');
var sinon = require('sinon');
var foodRouteTestModule = '../../../server/routes/foodRoute';

var route  = { get: function(){} }
var expressRouter = { route: function(routeParameter){} };
var response = { json: function(data){} };
var foodAccessRequestObj = { selectRecipe: function(){},
								insertRecipe: function(){} };
var recipe1 = "Pizza";
var recipe2 = "Spaghetti";

describe('Food route', function() {
	var mongoAccessStub;
	var requestObj, responseObj, nextFunc;
	
	beforeEach(function(){
		
		foodScraperStub = sinon.stub();
		
		mongoAccessStub = sinon.stub();
		
		expressRouterStub = sinon.stub(expressRouter, "route");
		// get back a route which 'get' can be called on
		expressRouterStub.returns(route);

		// stub out the route that is returned from express router
		routeGetStub = sinon.stub(route, "get");

		responseStub = sinon.stub(response, "json");

		nextFunc = sinon.stub();
		requestObj = { options: { countryName : "Italy"} };

		// expose countryAccess's method(s) when it is called
		foodAccessStub = sinon.stub();
		foodAccessStub.returns(foodAccessRequestObj);

		mockery.registerAllowable(foodRouteTestModule);
		
    	// set up mocks for the 'required' modules using mockery
		mockery.registerMock('./../webscrapers/foodScraper', foodScraperStub);
		mockery.registerMock('./../dbaccess/foodAccess', foodAccessStub);
		mockery.registerMock('./../dbaccess/mongoAccess', mongoAccessStub);
		mockery.enable({
	      useCleanCache: true,
	      warnOnUnregistered: false
	    });
	})

	afterEach(function(){
	    mockery.disable();
	    mockery.deregisterAll();
	    nextFunc.reset();
		responseStub.restore();
		mongoAccessStub.reset();
		expressRouterStub.restore();
		routeGetStub.restore();
		foodAccessStub.reset();
	});

	
	it('should setup request object with access to country intro db', function() {
		// given
		var foodRoute = require(foodRouteTestModule);
		routeGetStub.yields(requestObj, responseObj, nextFunc);
		
		// when
  		foodRoute(expressRouter);

	  	// this is the api pattern that might be called with
	  	assert(expressRouterStub.calledWith('/food/:country'), 'food route param should be correct');
	  	assert(routeGetStub.called, "get should be called accepting route parameter");
	  	assert.equal(requestObj.foodAccess, foodAccessRequestObj, 'food access methods should be on the request object');
	});


	it('should use mongo', function() {
		// given
		var foodRoute = require(foodRouteTestModule);
		routeGetStub.yields(requestObj, responseObj, nextFunc);
				
		// when
  		foodRoute(expressRouter);

	  	// mongo database access method is called
	  	assert(mongoAccessStub.called, "mongo should be called in get callback");
	});


	it('should send json response in access callback if food array is populated in access callback', function(done) {
		// given
		var foodRoute = require(foodRouteTestModule);
		routeGetStub.yields(requestObj, response, nextFunc);

		// an array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(requestObj.options, foodAccessRequestObj.selectRecipe).callsArgWith(2, [recipe1]);

		// when
  		foodRoute(expressRouter);

  		// then
  		assert(responseStub.calledWith([recipe1]), "same data should be sent back in json response as received from food/recipes db");
	  	done();
	});


	it('should use web scraper to add another recipe to db', function(done) {
		// given
		var foodRoute = require(foodRouteTestModule);
		routeGetStub.yields(requestObj, response, nextFunc);

		// an array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(requestObj.options, foodAccessRequestObj.selectRecipe).callsArgWith(2, [recipe1]);
		// scraper gets a film back
		foodScraperStub.yields(recipe2);

		// when
  		foodRoute(expressRouter);

	  	// 
	  	assert.equal(requestObj.options.data, recipe2, 'data returned from scraper should be added to req options object');
	  	assert(mongoAccessStub.calledWith(requestObj.options, foodAccessRequestObj.insertRecipe), 'should use mongo to insert data into db');
	  	assert(foodScraperStub.calledAfter(responseStub), "should get another recipe after sending any recipe(s) found back in response");
	  	done();
	});


	it('should use web scraper to get a recipe if food db access returns nothing', function(done) {
		// given
		var foodRoute = require(foodRouteTestModule);
		routeGetStub.yields(requestObj, response, nextFunc);

		// an array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(requestObj.options, foodAccessRequestObj.selectRecipe).callsArgWith(2, []);
		// scraper gets a recipe back
		foodScraperStub.yields(recipe2);

		// when
  		foodRoute(expressRouter);

	  	// 
	  	assert(responseStub.calledWith([recipe2]), "same data should be sent back in json response as the web scraper found");
	  	assert.equal(requestObj.options.data, recipe2, 'data returned from scraper should be added to req options object');
	  	assert(mongoAccessStub.calledWith(requestObj.options, foodAccessRequestObj.insertRecipe), 'should use mongo to insert data into db');
	  	assert(responseStub.calledAfter(foodScraperStub), "should get a recipe from scraper before sending it back in response");
	  	done();
	});


	it('should send back number of recipes from food db in total food route', function() {
		// given
		var foodRoute = require(foodRouteTestModule);
		routeGetStub.yields(requestObj, response, nextFunc);
		var totalfood = 44;
		// an array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(null, foodAccessRequestObj.totalfood).callsArgWith(2, totalfood);
		
		// when
  		foodRoute(expressRouter);

	  	// this is the api pattern that must be used
	  	assert(expressRouterStub.calledWith('/totalfood/'), 'total food route param should be correct');
	  	
	  	assert.equal(requestObj.foodAccess, foodAccessRequestObj, 'food access methods should be on the request object');
		// object with total food has been sent back in json response
		var totalfoodObj = {'totalFood': totalfood}
		assert(responseStub.calledWith(totalfoodObj), "total number of recipes should be sent back in json response");
	});
})


