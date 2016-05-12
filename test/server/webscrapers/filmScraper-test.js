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

		cheerioEachMethodStub = sinon.stub(cheerioDomManipulatorStub, "each");
		cheerioTextMethodStub = sinon.stub(cheerioDomManipulatorStub, 'text');
		cheerioChildrenMethodStub = sinon.stub(cheerioDomManipulatorStub, "children");
		cheerioAttrMethodStub = sinon.stub(cheerioDomManipulatorStub, 'attr');

		requestModuleStub = sinon.stub();
		var error = null;
		var response = null;
		var html = "<p></p>"
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
	});

	after(function(){
	    mockery.disable();
	    mockery.deregisterAll();
	});


	it("should request the imdb country list page", function(){
		var filmScraper = require(filmScraperTestModule);

		filmScraper("Dominican Republic", callbackStub);

		assert(requestModuleStub.calledWith(imdbUrl+"/country/"), "the correct url needs to be entered into request module");
	});


	it("should setup cheerio", function(){
		var filmScraper = require(filmScraperTestModule);
		

		filmScraper("Dominican Republic", callbackStub);

		assert(cheerioLoadSpy.called, "the correct url needs to be entered into request module");
	});


	it("should return empty object in callback if no matching country is found", function(){
		var filmScraper = require(filmScraperTestModule);
		var error = null;
		var response = null;
		var html = "<p></p>"
		requestModuleStub.yields(error, response, html);
		
		cheerioEachMethodStub.yields(0, '');
		cheerioTextMethodStub.returns("France");
		cheerioChildrenMethodStub.returns(cheerioDomManipulatorStub);

		filmScraper("", callbackStub);
		
		assert(callbackStub.calledWith({}), "callback should be empty object");
	});


	it("should request imdb url with country appended if there is a country match", function(){
		var filmScraper = require(filmScraperTestModule);
		var filmIdString = 'f4329092db';
		
		cheerioEachMethodStub.yields(0, '');
		
		cheerioChildrenMethodStub.returns(cheerioDomManipulatorStub);

		// on the first time href attribute is got return the country
		cheerioAttrMethodStub.withArgs('href').onCall(0).returns("/country/france");
		
		cheerioTextMethodStub.returns("France");

		filmScraper("france", callbackStub);
		
		assert(requestModuleStub.calledWith(imdbUrl+"/country/france"), "request function should be called with country appended to url");
	});


	it("should call function to get info from api with film id appended to ombd url", function(){
		var filmScraper = require(filmScraperTestModule);
		var error = null;
		var response = null;
		var html = "<p></p>";
		var filmIdString = 'f4329092db';
		
		requestModuleStub.yields(error, response, html);
		
		cheerioEachMethodStub.yields(0, '');
		
		cheerioChildrenMethodStub.returns(cheerioDomManipulatorStub);
		// overwrite return of dom manipulator
		// cheerioDollarStub.withArgs('.results .detailed').returns(filmArray);
		cheerioSliceMethodStub = sinon.stub(cheerioDomManipulatorStub, "slice");
		cheerioSliceMethodStub.returns(cheerioDomManipulatorStub);
		cheerioTextMethodStub.returns("France");
		
		// get the full suffix at the end of the url
		cheerioAttrMethodStub.withArgs('href').onCall(1).returns('/title/'+filmIdString);

		filmScraper("france", callbackStub);
		
		assert(externalInfoStub.calledWith("http://www.omdbapi.com/?i="+filmIdString), "must give correct omdb end point");
	});




})