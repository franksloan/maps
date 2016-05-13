var chai = require('chai');
var assert = chai.assert;
var mockery = require('mockery');
var sinon = require('sinon');
var travelScraperTestModule = '../../../server/webscrapers/travelScraper';
var lonelyPlanetUrl = "http://www.lonelyplanet.com";
var cheerioModuleStub = { load: function(){ } };
var cheerioDollarStub;
var cheerioDomManipulatorStub = { text: function(){},
								  attr: function(){}
								}

describe('travel scraper', function() {
	
	beforeEach(function(){
		callbackStub = sinon.stub();

		cheerioDollarStub = sinon.stub();
		cheerioDollarStub.returns(cheerioDomManipulatorStub);

		// stub all of the methods which allow movement between html nodes
		cheerioTextMethodStub = sinon.stub(cheerioDomManipulatorStub, 'text');
		cheerioAttrMethodStub = sinon.stub(cheerioDomManipulatorStub, 'attr');

		requestModuleStub = sinon.stub();
		error = null;
		response = null;
		html = "<p></p>"
		// requestModuleStub.withArgs(imdbUrl+"/country/").yields(error, response, html);
		
		// return the cheerio $ from load method
		cheerioLoadSpy = sinon.stub(cheerioModuleStub, "load");
		cheerioLoadSpy.returns(cheerioDollarStub);

		mockery.registerAllowable(travelScraperTestModule);
		
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
	    cheerioTextMethodStub.restore();
	    cheerioAttrMethodStub.restore();
	});

	after(function(){
	    mockery.disable();
	    mockery.deregisterAll();
	});


	it("should request the sights page for the country", function(){
		var travelScraper = require(travelScraperTestModule);
		var dR = "dominican republic";
		var dRNoSpace = "dominican-republic";
		// when
		travelScraper(dR, callbackStub);

		// then
		assert(requestModuleStub.calledWith(lonelyPlanetUrl+'/'+dRNoSpace+"/sights"), "the correct url should be used in request");
	});


	it("should setup cheerio", function(){
		var travelScraper = require(travelScraperTestModule);
		requestModuleStub.yields(error, response, html);

		travelScraper("dominican republic", callbackStub);

		assert(cheerioLoadSpy.called, "load method must be called to setup cheerio");
	});


	it("should populate the callback object with the correct values", function(){
		var travelScraper = require(travelScraperTestModule);
		requestModuleStub.yields(error, response, html);
	
		// given
		cheerioDollarStub.withArgs('article', cheerioDomManipulatorStub).returns(['1st article']);
		var articleId = '123fg';
		cheerioAttrMethodStub.withArgs('href').returns(articleId);
		var imgUrl = "www.travel-image.com/sight.jpg";
		cheerioAttrMethodStub.withArgs('src').returns(imgUrl);
		var category = "Art";
		cheerioTextMethodStub.onCall(0).returns(category);
		var sightName = "Tate Modern";
		cheerioTextMethodStub.onCall(1).returns(sightName);
		var sightDescription = "Modern art gallery";
		cheerioTextMethodStub.onCall(2).returns(sightDescription);

		// when
		travelScraper("", callbackStub);
		
		// then callback should return object 
		assert(callbackStub.calledWithMatch({url: lonelyPlanetUrl+articleId}), "should append recipe onto url");
		assert(callbackStub.calledWithMatch({img: imgUrl}), "should have correct image link");
		assert(callbackStub.calledWithMatch({travelCategory: category}), "should have correct category");
		assert(callbackStub.calledWithMatch({sightName: sightName}), "sight should have correct name");
		assert(callbackStub.calledWithMatch({sightDescription: sightDescription}), "sight should have correct description");
	});
})