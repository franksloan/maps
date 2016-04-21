var chai = require('chai');
var assert = chai.assert;
var mockery = require('mockery');
var sinon = require('sinon');
var countryIntroRouteTestModule = '../../server/routes/countryIntroRoute';

var route  = { get: function(){} }
var expressRouter = { route: function(routeParameter){} };
var response = { json: function(data){} };
var countryAccessRequestObj = { selectCountryIntro: function(){},
								insertCountryIntro: function(){} };

describe('Country intro route', function() {
	var countryIntroScraperStub, countryAccessStub, mongoAccessStub;
	var requestObj, responseObj, nextFunc;
	
	before(function(){
		
		countryIntroScraperStub = sinon.stub();
		
		mongoAccessStub = sinon.stub();
		
		expressRouterStub = sinon.stub(expressRouter, "route");
		// get back a route which 'get' can be called on
		expressRouterStub.returns(route);

		// stub out the route that is returned from express router
		routeGetStub = sinon.stub(route, "get");

		responseStub = sinon.stub(response, "json");

		// expose countryAccess's method(s) when it is called
		countryAccessStub = sinon.stub();
		countryAccessStub.returns(countryAccessRequestObj);

		mockery.registerAllowable(countryIntroRouteTestModule);
		
    	// set up mocks for the 'required' modules using mockery
		mockery.registerMock('./../webscrapers/countryIntroScraper', countryIntroScraperStub);
		mockery.registerMock('./../dbaccess/countryAccess', countryAccessStub);
		mockery.registerMock('./../dbaccess/mongoAccess', mongoAccessStub);
		mockery.enable({
	      useCleanCache: true,
	      warnOnUnregistered: false
	    });
	})

	after(function(){
	    mockery.disable();
	    mockery.deregisterAll();
	});

  	// initialise before each test
	beforeEach(function(){
		nextFunc = sinon.stub();
		requestObj = { options: { countryName : "France"} };
	})

	afterEach(function(){
		nextFunc.reset();
		responseStub.reset();
	})
	
	it('should setup request object with access to country intro db', function() {
		// given
		var countryIntroRoute = require(countryIntroRouteTestModule);
		routeGetStub.yields(requestObj, responseObj, nextFunc);
		expressRouterStub.returns(route);
		
		// when
  		countryIntroRoute(expressRouter);

	  	// this is the api pattern that might be called with
	  	assert(expressRouterStub.calledWith('/country_intro/:country'), 'country route param should be correct');
	  	assert(routeGetStub.called, "get should be called accepting route parameter");
	  	assert.equal(requestObj.countryAccess, countryAccessRequestObj, 'country access methods should be on the request object');
	});


	it('should use mongo', function() {
		// given
		var countryIntroRoute = require(countryIntroRouteTestModule);
		routeGetStub.yields(requestObj, responseObj, nextFunc);
				
		// when
  		countryIntroRoute(expressRouter);

	  	// mongo database access method is called
	  	assert(mongoAccessStub.called, "mongo should be called in get callback");
	});


	it('should send json response in callback if intro array is populated in callback', function(done) {
		// given
		var countryIntroRoute = require(countryIntroRouteTestModule);
		routeGetStub.yields(requestObj, response, nextFunc);

		// an array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(requestObj.options, countryAccessRequestObj.selectCountryIntro).callsArgWith(2, ['intro']);

		// when
  		countryIntroRoute(expressRouter);

  		// then
  		assert(responseStub.calledWith(['intro']), "same data should be sent back in json response as received from country intro db");
	  	// if json response happens before mongo call something has gone badly wrong
	  	assert(responseStub.calledAfter(mongoAccessStub), "json response should happen after we receive anything from db");

	  	done();
	});


	it('should use web scraper in mongo callback if array is not populated by db', function(done) {
		// given
		var countryIntroRoute = require(countryIntroRouteTestModule);
		routeGetStub.yields(requestObj, response, nextFunc);

		// an empty array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(requestObj.options, countryAccessRequestObj.selectCountryIntro).callsArgWith(2, []);

		// when
  		countryIntroRoute(expressRouter);

	  	// 
	  	assert(countryIntroScraperStub.calledWith("france"), "lower case country name should be sent into the scraper");

	  	done();
	});


	it('should populate the array with data from the scraper callback if no data is returned from db', function(done) {
		// given
		var countryIntroRoute = require(countryIntroRouteTestModule);
		routeGetStub.yields(requestObj, response, nextFunc);
		var countryIntroArray = [];
		// an empty array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(requestObj.options, countryAccessRequestObj.selectCountryIntro).callsArgWith(2, countryIntroArray);

		countryIntroScraperStub.yields('france intro')

		// when
  		countryIntroRoute(expressRouter);

	  	// 
	  	assert.equal(countryIntroArray[0], 'france intro', "empty array returned from mongo should be populated with the data from scraper")
	  	assert(responseStub.calledWith(['france intro']), "data from scraper should be sent back in json response as array");
	  	done();
	});


	it('should use mongo to insert data from scraper if no data was found in db', function(done) {
		// given
		var countryIntroRoute = require(countryIntroRouteTestModule);
		routeGetStub.yields(requestObj, response, nextFunc);
		var countryIntroArray = [];
		// an empty array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(requestObj.options, countryAccessRequestObj.selectCountryIntro).callsArgWith(2, countryIntroArray);

		countryIntroScraperStub.yields('france intro')

		// when
  		countryIntroRoute(expressRouter);

	  	//
	  	assert.equal(requestObj.options.data, 'france intro', 'data returned from scraper should be added to req options object');
	  	assert(mongoAccessStub.calledWith(requestObj.options, countryAccessRequestObj.insertCountryIntro), 'should use mongo to insert data into db');
	  	done();
	});
})





