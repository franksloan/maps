var chai = require('chai');
var assert = chai.assert;
var mockery = require('mockery');
var routerTestModule = '../../server/router';
var sinon = require('sinon');
var io = {on: function(string, fn){ }};

var expressRouter = {
	use: function(fn){},
	param: function(string, fn){}
};

/*  
 *  Test suite for main router to setup the different specific
 *  routes and also connect to io.
 */
describe('Main express router', function() {
	var countryIntroRouteStub, filmsRouteStub, foodRouteStub, travelRouteStub;
	var requestObj, responseObj, nextFunc, expressRouterUseStub, expressRouterParamStub;
	
	before(function(){

		countryParamRouteStub = sinon.stub();
		countryIntroRouteStub = sinon.stub();
		filmsRouteStub = sinon.stub();
		foodRouteStub = sinon.stub(); 
		travelRouteStub = sinon.stub();
		
		expressRouterUseStub = sinon.stub(expressRouter, "use");
  	expressRouterParamStub = sinon.stub(expressRouter, "param");

		mockery.registerAllowable(routerTestModule);
		
    // set up mocks for the 'required' modules using mockery
		mockery.registerMock('./routes/countryParamRoute', countryParamRouteStub);
		mockery.registerMock('./routes/countryIntroRoute', countryIntroRouteStub);
		mockery.registerMock('./routes/filmsRoute', filmsRouteStub);
		mockery.registerMock('./routes/foodRoute', foodRouteStub);
		mockery.registerMock('./routes/travelRoute', travelRouteStub);
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
		requestObj = {};
		responseObj = {};
	})

	afterEach(function(){
		nextFunc.reset();
	})
	
	it('should connect to io', function() {
		// given
		var router = require(routerTestModule);
		var ioSpy = sinon.spy(io, "on");

		// when
  	router(expressRouter, io);

  	// io is called with correct parameter
  	assert(ioSpy.calledWith('connection'), 'io should connect');
  	
	});


	it('should setup express route', function() {
		// given
		var router = require(routerTestModule);
		
		expressRouterUseStub.yields(requestObj, responseObj, nextFunc);
		
		// when
  	router(expressRouter, io);

  	// finish off with checking that param route is now called
  	assert(expressRouterUseStub.called, 'use method is called on express router');
  	assert.equal(requestObj.options.io, io, 'io should be attached to request object');
  	assert(nextFunc.called, 'should move to next route in get callback');
	});


	it('should call country parameter route', function() {
		// given
		var router = require(routerTestModule);

		expressRouterParamStub.withArgs('country').yields(requestObj, responseObj, nextFunc);

		// when
  	router(expressRouter, io);
  
  	assert(expressRouterParamStub.calledWith('country'), 'param method is called on express router');
  	assert(nextFunc.called, 'should move to next route in param callback');
	});


	it('should call use and then param', function() {
		// given
		var router = require(routerTestModule);

		expressRouterUseStub.yields(requestObj, responseObj, nextFunc);
		expressRouterParamStub.withArgs('country').yields(requestObj, responseObj, nextFunc);
		
		// when
  	router(expressRouter, io);

  	// finish off with checking that param route is now called
  	assert(expressRouterParamStub.calledAfter(expressRouterUseStub), "param should be called after use");
  	assert.equal(nextFunc.callCount, 2, 'next should be called in use and param');
	});


	it('should call specific routes', function() {
		// given
		var router = require(routerTestModule);

		// when
  	router(expressRouter, io);

  	// io is called with correct parameter
  	checkRoutesAreCalled();
  	
	});


	function checkRoutesAreCalled(){
		assert(countryParamRouteStub.calledWith(expressRouter), "Country param route should be called with express router");
  	assert(countryIntroRouteStub.calledWith(expressRouter), "Country intro route should be called with express router");
  	assert(filmsRouteStub.calledWith(expressRouter), "Films route should be called with express router");
  	assert(foodRouteStub.calledWith(expressRouter), "Food route should be called with express router");
  	assert(travelRouteStub.calledWith(expressRouter), "Travel route should be called with express router");
	}


});