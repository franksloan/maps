var chai = require('chai');
var assert = chai.assert;
var mockery = require('mockery');
var sinon = require('sinon');
var filmsRouteTestModule = '../../../server/routes/filmsRoute';

var route  = { get: function(){} }
var expressRouter = { route: function(routeParameter){} };
var response = { json: function(data){} };
var filmsAccessRequestObj = { selectFilm: function(){},
								insertFilm: function(){} };
var zorroFilmString = "The Mask of Zorro";
var batmanFilmString = "Batman";

describe('Films route', function() {
	var mongoAccessStub;
	var requestObj, responseObj, nextFunc;
	
	beforeEach(function(){
		
		filmScraperStub = sinon.stub();
		
		mongoAccessStub = sinon.stub();
		
		expressRouterStub = sinon.stub(expressRouter, "route");
		// get back a route which 'get' can be called on
		expressRouterStub.returns(route);

		// stub out the route that is returned from express router
		routeGetStub = sinon.stub(route, "get");

		responseStub = sinon.stub(response, "json");

		nextFunc = sinon.stub();
		requestObj = { options: { countryName : "France"} };

		// expose countryAccess's method(s) when it is called
		filmsAccessStub = sinon.stub();
		filmsAccessStub.returns(filmsAccessRequestObj);

		mockery.registerAllowable(filmsRouteTestModule);
		
    	// set up mocks for the 'required' modules using mockery
		mockery.registerMock('./../webscrapers/filmScraper', filmScraperStub);
		mockery.registerMock('./../dbaccess/filmsAccess', filmsAccessStub);
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
		filmsAccessStub.reset();
	});

	
	it('should setup request object with access to country intro db', function() {
		// given
		var filmsRoute = require(filmsRouteTestModule);
		routeGetStub.yields(requestObj, responseObj, nextFunc);
		
		// when
  		filmsRoute(expressRouter);

	  	// this is the api pattern that might be called with
	  	assert(expressRouterStub.calledWith('/films/:country'), 'film route param should be correct');
	  	assert(routeGetStub.called, "get should be called accepting route parameter");
	  	assert.equal(requestObj.filmsAccess, filmsAccessRequestObj, 'films access methods should be on the request object');
	});


	it('should use mongo', function() {
		// given
		var filmsRoute = require(filmsRouteTestModule);
		routeGetStub.yields(requestObj, responseObj, nextFunc);
				
		// when
  		filmsRoute(expressRouter);

	  	// mongo database access method is called
	  	assert(mongoAccessStub.called, "mongo should be called in get callback");
	});


	it('should send json response in access callback if films array is populated in access callback', function(done) {
		// given
		var filmsRoute = require(filmsRouteTestModule);
		routeGetStub.yields(requestObj, response, nextFunc);

		// an array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(requestObj.options, filmsAccessRequestObj.selectFilm).callsArgWith(2, [zorroFilmString]);

		// when
  		filmsRoute(expressRouter);

  		// then
  		assert(responseStub.calledWith([zorroFilmString]), "same data should be sent back in json response as received from country intro db");
	  	done();
	});


	it('should use web scraper to add another film to db', function(done) {
		// given
		var filmsRoute = require(filmsRouteTestModule);
		routeGetStub.yields(requestObj, response, nextFunc);

		// an array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(requestObj.options, filmsAccessRequestObj.selectFilm).callsArgWith(2, [zorroFilmString]);
		// scraper gets a film back
		filmScraperStub.yields(batmanFilmString);

		// when
  		filmsRoute(expressRouter);

	  	// 
	  	assert.equal(requestObj.options.data, batmanFilmString, 'data returned from scraper should be added to req options object');
	  	assert(mongoAccessStub.calledWith(requestObj.options, filmsAccessRequestObj.insertFilm), 'should use mongo to insert data into db');
	  	assert(filmScraperStub.calledAfter(responseStub), "should get another film after sending any films found back in response");
	  	done();
	});


	it('should use web scraper to get a film if access array returns nothing', function(done) {
		// given
		var filmsRoute = require(filmsRouteTestModule);
		routeGetStub.yields(requestObj, response, nextFunc);

		// an array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(requestObj.options, filmsAccessRequestObj.selectFilm).callsArgWith(2, []);
		// scraper gets a film back
		filmScraperStub.yields(batmanFilmString);

		// when
  		filmsRoute(expressRouter);

	  	// 
	  	assert(responseStub.calledWith([batmanFilmString]), "same data should be sent back in json response as the web scraper found");
	  	assert.equal(requestObj.options.data, batmanFilmString, 'data returned from scraper should be added to req options object');
	  	assert(mongoAccessStub.calledWith(requestObj.options, filmsAccessRequestObj.insertFilm), 'should use mongo to insert data into db');
	  	assert(responseStub.calledAfter(filmScraperStub), "should get another film after sending any films found back in response");
	  	done();
	});


	it('should send back number of films from films db in total films route', function() {
		// given
		var filmsRoute = require(filmsRouteTestModule);
		routeGetStub.yields(requestObj, response, nextFunc);
		var totalFilms = 101;
		// an array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(null, filmsAccessRequestObj.totalfilms).callsArgWith(2, totalFilms);
		
		// when
  		filmsRoute(expressRouter);

	  	// this is the api pattern that must be used
	  	assert(expressRouterStub.calledWith('/totalfilms/'), 'total films route param should be correct');
	  	
	  	assert.equal(requestObj.filmsAccess, filmsAccessRequestObj, 'films access methods should be on the request object');
		// object with total films has been sent back in json response
		var totalFilmsObj = {'totalFilms': totalFilms}
		assert(responseStub.calledWith(totalFilmsObj), "total number of films should be sent back in json response");
	});
})





