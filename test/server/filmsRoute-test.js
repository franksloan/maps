var chai = require('chai');
var assert = chai.assert;
var mockery = require('mockery');
var sinon = require('sinon');
var filmsRouteTestModule = '../../server/routes/filmsRoute';

var route  = { get: function(){} }
var expressRouter = { route: function(routeParameter){} };
var response = { json: function(data){} };
var filmsAccessRequestObj = { selectFilm: function(){},
								insertFilm: function(){} };
var zorroFilmString = "The Mask of Zorro";
var batmanFilmString = "Batman";

describe('Films route', function() {
	var countryIntroScraperStub, countryAccessStub, mongoAccessStub;
	var requestObj, responseObj, nextFunc;
	
	before(function(){
		
		filmScraperStub = sinon.stub();
		
		mongoAccessStub = sinon.stub();
		
		expressRouterStub = sinon.stub(expressRouter, "route");
		// get back a route which 'get' can be called on
		expressRouterStub.returns(route);

		// stub out the route that is returned from express router
		routeGetStub = sinon.stub(route, "get");

		responseStub = sinon.stub(response, "json");

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


	it('should send json response in callback if films array is populated in callback', function(done) {
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

		// an empty array is passed back in the callback which is third parameter of mongo function
		mongoAccessStub.withArgs(requestObj.options, filmsAccessRequestObj.selectFilm).callsArgWith(2, [zorroFilmString]);
		filmScraperStub.yields(batmanFilmString);

		// when
  		filmsRoute(expressRouter);

	  	// 
	  	assert.equal(requestObj.options.data, batmanFilmString, 'data returned from scraper should be added to req options object');
	  	assert(mongoAccessStub.calledWith(requestObj.options, filmsAccessRequestObj.insertFilm), 'should use mongo to insert data into db');
	  	done();
	});


	// it('should populate the array with data from the scraper callback if no data is returned from db', function(done) {
	// 	// given
	// 	var countryIntroRoute = require(countryIntroRouteTestModule);
	// 	routeGetStub.yields(requestObj, response, nextFunc);
	// 	var countryIntroArray = [];
	// 	// an empty array is passed back in the callback which is third parameter of mongo function
	// 	mongoAccessStub.withArgs(requestObj.options, countryAccessRequestObj.selectCountryIntro).callsArgWith(2, countryIntroArray);

	// 	countryIntroScraperStub.yields('france intro')

	// 	// when
 //  		countryIntroRoute(expressRouter);

	//   	// 
	//   	assert.equal(countryIntroArray[0], 'france intro', "empty array returned from mongo should be populated with the data from scraper")
	//   	assert(responseStub.calledWith(['france intro']), "data from scraper should be sent back in json response as array");
	//   	done();
	// });


	// it('should use mongo to insert data from scraper if no data was found in db', function(done) {
	// 	// given
	// 	var countryIntroRoute = require(countryIntroRouteTestModule);
	// 	routeGetStub.yields(requestObj, response, nextFunc);
	// 	var countryIntroArray = [];
	// 	// an empty array is passed back in the callback which is third parameter of mongo function
	// 	mongoAccessStub.withArgs(requestObj.options, countryAccessRequestObj.selectCountryIntro).callsArgWith(2, countryIntroArray);

	// 	countryIntroScraperStub.yields('france intro')

	// 	// when
 //  		countryIntroRoute(expressRouter);

	//   	//
	//   	assert.equal(requestObj.options.data, 'france intro', 'data returned from scraper should be added to req options object');
	//   	assert(mongoAccessStub.calledWith(requestObj.options, countryAccessRequestObj.insertCountryIntro), 'should use mongo to insert data into db');
	//   	done();
	// });
})





