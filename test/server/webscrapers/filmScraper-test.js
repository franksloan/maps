var chai = require('chai');
var assert = chai.assert;
var mockery = require('mockery');
var sinon = require('sinon');
var filmScraperTestModule = '../../../server/webscrapers/filmScraper';
var callbackStub = function(){};
var imdbUrl = "http://www.imdb.com";
var cheerioModuleStub = { load: function(){ } };
var cheerioDollarStub;
var cheerioDomManipulatorStub = { text: function(){},
								  attr: function(){},
								  each: function(){},
								  children: function(){},
								  slice: function(){},
								  length: 1
								}

describe('Film scraper', function() {
	var requestModuleStub, externalInfoStub;
	
	beforeEach(function(){
		callbackStub = sinon.stub();

		cheerioDollarStub = sinon.stub();
		cheerioDollarStub.returns(cheerioDomManipulatorStub);

		// stub all of the methods which allow movement between html nodes
		cheerioEachMethodStub = sinon.stub(cheerioDomManipulatorStub, "each");
		cheerioTextMethodStub = sinon.stub(cheerioDomManipulatorStub, 'text');
		cheerioChildrenMethodStub = sinon.stub(cheerioDomManipulatorStub, "children");
		cheerioAttrMethodStub = sinon.stub(cheerioDomManipulatorStub, 'attr');
		cheerioSliceMethodStub = sinon.stub(cheerioDomManipulatorStub, "slice");

		requestModuleStub = sinon.stub();
		error = null;
		response = null;
		html = "<p></p>"
		requestModuleStub.withArgs(imdbUrl+"/country/").yields(error, response, html);
		
		// return the cheerio $ from load method
		cheerioLoadSpy = sinon.stub(cheerioModuleStub, "load");
		cheerioLoadSpy.returns(cheerioDollarStub);

		externalInfoStub = sinon.stub();
		mockery.registerAllowable(filmScraperTestModule);
		
    	// set up mocks for the 'required' modules using mockery
		mockery.registerMock("request", requestModuleStub);
		mockery.registerMock("cheerio", cheerioModuleStub);
		mockery.registerMock("./../externalInfo", externalInfoStub);
		mockery.enable({
	      useCleanCache: true,
	      warnOnUnregistered: false
	    });
	});

	afterEach(function(){
	    mockery.disable();
	    mockery.deregisterAll();
	    requestModuleStub.reset();
	    cheerioLoadSpy.restore();
	    cheerioTextMethodStub.restore();
	    cheerioEachMethodStub.restore();
	    cheerioChildrenMethodStub.restore();
	    cheerioAttrMethodStub.restore();
	    cheerioSliceMethodStub.restore();
	});

	after(function(){
	    mockery.disable();
	    mockery.deregisterAll();
	});


	it("should request the imdb country list page", function(){
		var filmScraper = require(filmScraperTestModule);

		// when
		filmScraper("Dominican Republic", callbackStub);

		// then
		assert(requestModuleStub.calledWith(imdbUrl+"/country/"), "the correct url needs to be entered into request module");
	});


	it("should setup cheerio", function(){
		var filmScraper = require(filmScraperTestModule);

		filmScraper("Dominican Republic", callbackStub);

		assert(cheerioLoadSpy.called, "load method must be called to setup cheerio");
	});


	it("should return empty object in callback if no matching country is found", function(){
		var filmScraper = require(filmScraperTestModule);
		
		// given
		cheerioEachMethodStub.yields(0, '');
		cheerioTextMethodStub.returns("France");
		cheerioChildrenMethodStub.returns(cheerioDomManipulatorStub);

		// when
		filmScraper("", callbackStub);
		
		// then
		assert(callbackStub.calledWith({}), "callback should be empty object");
	});


	it("should request imdb url with country appended if there is a country match", function(){
		var filmScraper = require(filmScraperTestModule);
		// given
		cheerioEachMethodStub.yields(0, '');
		cheerioChildrenMethodStub.returns(cheerioDomManipulatorStub);

		// on the first time href attribute is called return the country
		cheerioAttrMethodStub.withArgs('href').onCall(0).returns("/country/france");
		cheerioTextMethodStub.returns("France");

		// when
		filmScraper("france", callbackStub);
		
		// then
		assert(requestModuleStub.calledWith(imdbUrl+"/country/france"), "request function should be called with country appended to url");
	});


	it("should attempt to get info from api with film id appended to ombd url", function(){
		var filmScraper = require(filmScraperTestModule);
		var filmIdString = 'f4329092db';

		// given
		// request callback can be run both times
		requestModuleStub.yields(error, response, html);
		
		cheerioEachMethodStub.yields(0, '');
		
		cheerioChildrenMethodStub.returns(cheerioDomManipulatorStub);
		
		cheerioSliceMethodStub.returns(cheerioDomManipulatorStub);
		cheerioTextMethodStub.returns("France");
		
		// get the full suffix at the end of the url
		cheerioAttrMethodStub.withArgs('href').onCall(1).returns('/title/'+filmIdString);

		// when
		filmScraper("france", callbackStub);
		
		// then
		assert(externalInfoStub.calledWith("http://www.omdbapi.com/?i="+filmIdString), "must give correct omdb end point");
	});


	it("should return film in the callback", function(){
		var filmScraper = require(filmScraperTestModule);
		var filmIdString = 'f4329092db';
		var filmTitle = "The Shawshank Redemption";
		
		// given
		// request callback can be run both times
		requestModuleStub.yields(error, response, html);
		cheerioEachMethodStub.yields(0, '');
		
		cheerioChildrenMethodStub.returns(cheerioDomManipulatorStub);
		cheerioSliceMethodStub.returns(cheerioDomManipulatorStub);
		cheerioTextMethodStub.returns("France");
		// film returned from the api callback
		externalInfoStub.yields("The Shawshank Redemption");
		
		// get the full suffix at the end of the url
		cheerioAttrMethodStub.withArgs('href').onCall(1).returns('/title/'+filmIdString);

		// when
		filmScraper("france", callbackStub);
		
		// then
		assert(callbackStub.calledWith(filmTitle), "must return the film got from the api in the callback");
	});
})