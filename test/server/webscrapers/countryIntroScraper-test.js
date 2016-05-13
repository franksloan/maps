var chai = require('chai');
var assert = chai.assert;
var mockery = require('mockery');
var sinon = require('sinon');
var countryIntroScraperTestModule = '../../../server/webscrapers/countryIntroScraper';
var lonelyPlanetUrl = "http://www.lonelyplanet.com";
var cheerioModuleStub = { load: function(){ } };
var cheerioDollarStub;
var cheerioDomManipulatorStub = { text: function(){},
								  attr: function(){}
								}

describe('Country intro route', function() {
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

		
		mockery.registerAllowable(countryIntroScraperTestModule);
		
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


	it("should append country with dashes instead of spaces onto lonely planet url", function(){
		var countryIntroScraper = require(countryIntroScraperTestModule);

		countryIntroScraper("Dominican Republic", callbackStub);

		assert(requestModuleStub.calledWith(lonelyPlanetUrl+"/"+"Dominican-Republic"), "the correct url needs to be entered into request module");
	});


	it("should setup cheerio", function(){
		var countryIntroScraper = require(countryIntroScraperTestModule);
		var error = null;
		var response = null;
		var html = "<p></p>"
		requestModuleStub.yields(error, response, html);

		countryIntroScraper("Dominican Republic", callbackStub);

		assert(cheerioLoadSpy.called, "the correct url needs to be entered into request module");
	});


	it("should call text on html and 'Read More' should be removed from the intro", function(){
		var countryIntroScraper = require(countryIntroScraperTestModule);
		var error = null;
		var response = null;
		var html = "<p></p>"
		requestModuleStub.yields(error, response, html);

		countryIntroScraper("", callbackStub);

		assert(cheerioDollarStub.calledWith('p', '#introduction'), "looks in html which has id of 'introduction' inside p tag")
		assert(cheerioTextMethodSpy.called, "need to get text back from the cheerio html");
		assert(callbackStub.calledWithMatch({countryIntroText: "France is a ... "}), 'callback should have intro text correctly populated');
	});


	it("should get style attribute from slideshow in html", function(){
		var countryIntroScraper = require(countryIntroScraperTestModule);
		var error = null;
		var response = null;
		var html = "<p></p>"
		requestModuleStub.yields(error, response, html);
		cheerioAttrMethodSpy.returns("this is a string with img embedded (www.image.com)");

		countryIntroScraper("", callbackStub);

		assert(cheerioAttrMethodSpy.calledWith('style'), "need to get style attribute back from the cheerio html");
		assert(callbackStub.calledWithMatch({img: "www.image.com"}), 'callback should have image url correctly populated');
	});

})