var chai = require('chai');
var assert = chai.assert;
var mockery = require('mockery');
var sinon = require('sinon');
var countryParamRouteTestModule = '../../../server/routes/countryParamRoute';
var country = "Italy";
var expressRouter = { param: function(routeParameter){} };
var response = { json: function(data){} };
var countryAccessRequestObj = { findCountryDocument: function(){},
								insertCountryDocument: function(){} };

describe('Country param route', function() {
	var countryAccessStub, mongoAccessStub;
	var requestObj, responseObj, nextFunc;
	
	beforeEach(function(){
		
		mongoAccessStub = sinon.stub();
		
		expressRouterStub = sinon.stub(expressRouter, "param");

		responseStub = sinon.stub(response, "json");

		nextFunc = sinon.stub();
		requestObj = { options : {} };

		// expose countryAccess's method(s) when it is called
		countryAccessStub = sinon.stub();
		countryAccessStub.returns(countryAccessRequestObj);

		mockery.registerAllowable(countryParamRouteTestModule);
		
    	// set up mocks for the 'required' modules using mockery
		mockery.registerMock('./../dbaccess/countryAccess', countryAccessStub);
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
		countryAccessStub.reset();
	});

	
	it('should setup request object with access to country intro db', function() {
		// given
		var countryParamRoute = require(countryParamRouteTestModule);
		expressRouterStub.yields(requestObj, responseObj, nextFunc, country);
		
		// when
  		countryParamRoute(expressRouter);

	  	// this is the api pattern that might be called with
	  	assert(expressRouterStub.calledWith('country'), 'country route param should be correct');
	  	assert.equal(requestObj.options.countryName, country, "country name should be set on the request options object");
	  	assert.equal(requestObj.countryAccess, countryAccessRequestObj, 'country access methods should be on the request object');
	});


	it('should use mongo', function() {
		// given
		var countryParamRoute = require(countryParamRouteTestModule);
		expressRouterStub.yields(requestObj, responseObj, nextFunc, country);
				
		// when
  		countryParamRoute(expressRouter);

	  	// mongo database access method is called
	  	assert(mongoAccessStub.called, "mongo should be called in get callback");
	});


	it('should only interact with the database once if the country has been found', function(done) {
		// given
		var countryParamRoute = require(countryParamRouteTestModule);
		expressRouterStub.yields(requestObj, response, nextFunc, country);

		var countryMatch = true;
		// an array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(requestObj.options, countryAccessRequestObj.findCountryDocument).callsArgWith(2, countryMatch);

		// when
  		countryParamRoute(expressRouter);

  		// then
  		assert(mongoAccessStub.calledOnce, "should only be one interaction with mongo if the country is found");
	  	done();
	});


	it('should interact with the database twice if the country has not been found', function(done) {
		// given
		var countryParamRoute = require(countryParamRouteTestModule);
		expressRouterStub.yields(requestObj, response, nextFunc, country);

		var countryMatch = false;
		// an array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(requestObj.options, countryAccessRequestObj.findCountryDocument).callsArgWith(2, countryMatch);

		// when
  		countryParamRoute(expressRouter);

  		// then
  		assert(mongoAccessStub.calledTwice, "should be a second interaction with mongo to insert a country");
	  	assert(mongoAccessStub.calledWith(requestObj.options, countryAccessRequestObj.insertCountryDocument), 'should use mongo to insert country into db');
	  	done();
	});



})


