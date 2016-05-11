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
								  length: 1
								}

describe('Fim scraper', function() {
	var requestModuleStub, cheerioSpy;
	
	beforeEach(function(){
		callbackStub = sinon.stub();

		cheerioDollarStub = sinon.stub();
		cheerioDollarStub.returns(cheerioDomManipulatorStub);

		cheerioTextMethodSpy = sinon.stub(cheerioDomManipulatorStub, 'text');
		cheerioTextMethodSpy.returns("France is a ... Read More");
		cheerioAttrMethodSpy = sinon.stub(cheerioDomManipulatorStub, 'attr');
		
		requestModuleStub = sinon.stub();
		
		// return the cheerio $ from load method
		cheerioLoadSpy = sinon.stub(cheerioModuleStub, "load");
		cheerioLoadSpy.returns(cheerioDollarStub);

		
		mockery.registerAllowable(filmScraperTestModule);
		
    	// set up mocks for the 'required' modules using mockery
		mockery.registerMock("request", requestModuleStub);
		mockery.registerMock("cheerio", cheerioModuleStub);
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
	    cheerioTextMethodSpy.restore();
	    cheerioAttrMethodSpy.restore();
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
		var error = null;
		var response = null;
		var html = "<p></p>"
		requestModuleStub.yields(error, response, html);

		filmScraper("Dominican Republic", callbackStub);

		assert(cheerioLoadSpy.called, "the correct url needs to be entered into request module");
	});


	it("should return empty object in callback if no matching country is found", function(){
		var filmScraper = require(filmScraperTestModule);
		var error = null;
		var response = null;
		var html = "<p></p>"
		requestModuleStub.yields(error, response, html);
		cheerioEachMethodStub = sinon.stub(cheerioDomManipulatorStub, "each");
		cheerioEachMethodStub.yields(0, '');
		cheerioChildrenMethodStub = sinon.stub(cheerioDomManipulatorStub, "children");
		cheerioChildrenMethodStub.returns(cheerioDomManipulatorStub);

		filmScraper("", callbackStub);
		console.log(callbackStub.args);
		assert(callbackStub.calledWith({}), "callback should be empty object");
	});

})