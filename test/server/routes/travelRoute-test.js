var chai = require('chai');
var assert = chai.assert;
var mockery = require('mockery');
var sinon = require('sinon');
var travelRouteTestModule = '../../../server/routes/travelRoute';

var route  = { get: function(){} }
var expressRouter = { route: function(routeParameter){} };
var response = { json: function(data){} };
var travelAccessRequestObj = { selectSights: function(){},
								insertSight: function(){} };
var sight1 = "Big Ben";
var sight2 = "The Shard";

describe('travel route', function() {
	var mongoAccessStub;
	var requestObj, responseObj, nextFunc;
	
	beforeEach(function(){
		
		travelScraperStub = sinon.stub();
		
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
		travelAccessStub = sinon.stub();
		travelAccessStub.returns(travelAccessRequestObj);

		mockery.registerAllowable(travelRouteTestModule);
		
    	// set up mocks for the 'required' modules using mockery
		mockery.registerMock('./../webscrapers/travelScraper', travelScraperStub);
		mockery.registerMock('./../dbaccess/travelAccess', travelAccessStub);
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
		travelAccessStub.reset();
	});

	
	it('should setup request object with access to country intro db', function() {
		// given
		var travelRoute = require(travelRouteTestModule);
		routeGetStub.yields(requestObj, responseObj, nextFunc);
		
		// when
  		travelRoute(expressRouter);

	  	// this is the api pattern that might be called with
	  	assert(expressRouterStub.calledWith('/travel/:country'), 'travel route param should be correct');
	  	assert(routeGetStub.called, "get should be called accepting route parameter");
	  	assert.equal(requestObj.travelAccess, travelAccessRequestObj, 'travel access methods should be on the request object');
	});


	it('should use mongo', function() {
		// given
		var travelRoute = require(travelRouteTestModule);
		routeGetStub.yields(requestObj, responseObj, nextFunc);
				
		// when
  		travelRoute(expressRouter);

	  	// mongo database access method is called
	  	assert(mongoAccessStub.called, "mongo should be called in get callback");
	});


	it('should send json response in access callback if travel array is populated in access callback', function(done) {
		// given
		var travelRoute = require(travelRouteTestModule);
		routeGetStub.yields(requestObj, response, nextFunc);

		// an array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(requestObj.options, travelAccessRequestObj.selectSights).callsArgWith(2, [sight1]);

		// when
  		travelRoute(expressRouter);

  		// then
  		assert(responseStub.calledWith([sight1]), "same data should be sent back in json response as received from travel db");
	  	done();
	});


	it('should use web scraper to add another recipe to db', function(done) {
		// given
		var travelRoute = require(travelRouteTestModule);
		routeGetStub.yields(requestObj, response, nextFunc);

		// an array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(requestObj.options, travelAccessRequestObj.selectSights).callsArgWith(2, [sight1]);
		// scraper gets a film back
		travelScraperStub.yields(sight2);

		// when
  		travelRoute(expressRouter);

	  	// 
	  	assert.equal(requestObj.options.data, sight2, 'data returned from scraper should be added to req options object');
	  	assert(mongoAccessStub.calledWith(requestObj.options, travelAccessRequestObj.insertSight), 'should use mongo to insert data into db');
	  	assert(travelScraperStub.calledAfter(responseStub), "should get another sight after sending any sight(s) found back in response");
	  	done();
	});


	it('should use web scraper to get a sight if travel db access returns nothing', function(done) {
		// given
		var travelRoute = require(travelRouteTestModule);
		routeGetStub.yields(requestObj, response, nextFunc);

		// an array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(requestObj.options, travelAccessRequestObj.selectSights).callsArgWith(2, []);
		// scraper gets a recipe back
		travelScraperStub.yields(sight2);

		// when
  		travelRoute(expressRouter);

	  	// 
	  	assert(responseStub.calledWith([sight2]), "same data should be sent back in json response as the web scraper found");
	  	assert.equal(requestObj.options.data, sight2, 'data returned from scraper should be added to req options object');
	  	assert(mongoAccessStub.calledWith(requestObj.options, travelAccessRequestObj.insertSight), 'should use mongo to insert data into db');
	  	assert(responseStub.calledAfter(travelScraperStub), "should get a sight from scraper before sending it back in response");
	  	done();
	});


	it('should send back number of recipes from travel db in total travel route', function() {
		// given
		var travelRoute = require(travelRouteTestModule);
		routeGetStub.yields(requestObj, response, nextFunc);
		var totaltravel = 78;
		// an array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(null, travelAccessRequestObj.totaltravel).callsArgWith(2, totaltravel);
		
		// when
  		travelRoute(expressRouter);

	  	// this is the api pattern that must be used
	  	assert(expressRouterStub.calledWith('/totalsights/'), 'total sights route param should be correct');
	  	
	  	assert.equal(requestObj.travelAccess, travelAccessRequestObj, 'travel access methods should be on the request object');
		// object with total travel has been sent back in json response
		var totaltravelObj = {'totalSights': totaltravel}
		assert(responseStub.calledWith(totaltravelObj), "total number of sights should be sent back in json response");
	});
})


