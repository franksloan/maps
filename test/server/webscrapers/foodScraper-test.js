var chai = require('chai');
var assert = chai.assert;
var mockery = require('mockery');
var sinon = require('sinon');
var foodScraperTestModule = '../../../server/webscrapers/foodScraper';
var whats4eatsUrl = 'http://www.whats4eats.com';
var cheerioModuleStub = { load: function(){ } };
var cheerioDollarStub;
var cheerioDomManipulatorStub = { text: function(){},
								  attr: function(){},
								  each: function(){},
								  html: function(){},
								  length: 1
								}

describe('Food scraper', function() {
	var requestModuleStub;
	
	beforeEach(function(){
		callbackStub = sinon.stub();

		cheerioDollarStub = sinon.stub();
		cheerioDollarStub.returns(cheerioDomManipulatorStub);

		// stub all of the methods which allow movement between html nodes
		cheerioEachMethodStub = sinon.stub(cheerioDomManipulatorStub, "each");
		cheerioTextMethodStub = sinon.stub(cheerioDomManipulatorStub, 'text');
		cheerioAttrMethodStub = sinon.stub(cheerioDomManipulatorStub, 'attr');
		cheerioHtmlMethodStub = sinon.stub(cheerioDomManipulatorStub, "html");

		requestModuleStub = sinon.stub();
		error = null;
		response = null;
		html = "<p></p>"
		// requestModuleStub.withArgs(imdbUrl+"/country/").yields(error, response, html);
		
		// return the cheerio $ from load method
		cheerioLoadSpy = sinon.stub(cheerioModuleStub, "load");
		cheerioLoadSpy.returns(cheerioDollarStub);

		mockery.registerAllowable(foodScraperTestModule);
		
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
	    cheerioEachMethodStub.restore();
	    cheerioAttrMethodStub.restore();
	    cheerioHtmlMethodStub.restore();
	});

	after(function(){
	    mockery.disable();
	    mockery.deregisterAll();
	});


	it("should request the imdb country list page", function(){
		var foodScraper = require(foodScraperTestModule);
		var regions = ['africa', 'caribbean', 'central-america', 'central-asia', 'east-asia', 
		'europe', 'middle-east', 'north-america', 'pacific', 'south-america'];
		var dR = "dominican republic";
		var dRNoSpace = "dominican-republic";
		// when
		foodScraper(dR, callbackStub);

		// then
		for(var i = 0; i < regions.length; i++){
			assert(requestModuleStub.getCall(i).calledWith(whats4eatsUrl+'/'+regions[i]+"/"+dRNoSpace+"-cuisine"), "the correct region, " + regions[i] + ", needs to be used in request");
		}
	});


	it("should setup cheerio", function(){
		var foodScraper = require(foodScraperTestModule);
		requestModuleStub.onCall(0).yields(error, response, html);

		foodScraper("dominican republic", callbackStub);

		assert(cheerioLoadSpy.called, "load method must be called to setup cheerio");
	});


	it("should use recipe suffix to get the recipe page from request", function(){
		var foodScraper = require(foodScraperTestModule);
		requestModuleStub.onCall(0).yields(error, response, html);
		var recipeSuffix = '/tasty-recipe';
		
		// given
		cheerioEachMethodStub.yields(0, '');
		cheerioHtmlMethodStub.returns("some html");
		cheerioAttrMethodStub.withArgs('href').returns(recipeSuffix)

		// when
		foodScraper("", callbackStub);
		
		// then
		assert(requestModuleStub.calledWith(whats4eatsUrl+recipeSuffix), "should append recipe onto url");
	});


	it("should send empty object back if that country cannot be found in any of the regions", function(){
		var foodScraper = require(foodScraperTestModule);
		// many 'requests' so always allow callback to be run
		requestModuleStub.yields(error, response, html);
		var pageNotFound = 'Page Not Found';
		
		// given
		cheerioEachMethodStub.yields(0, '');
		cheerioHtmlMethodStub.returns(pageNotFound);

		// when
		foodScraper("", callbackStub);
		
		// then
		assert(callbackStub.calledWith({}), "should send empty object back");
	});


	it("should populate the callback object with the correct values", function(){
		var foodScraper = require(foodScraperTestModule);
		// callback of second request should be entered
		requestModuleStub.yields(error, response, html);
		var recipeSuffix = '/tasty-recipe';
		
		// given
		cheerioEachMethodStub.yields(0, '');
		cheerioHtmlMethodStub.onCall(0).returns("some html");
		cheerioAttrMethodStub.withArgs('href').returns(recipeSuffix);

		var title = 'Tasty Recipe';
		cheerioHtmlMethodStub.onCall(1).returns(title);
		var imgUrl = "www.food-image.com/recipe.jpg";
		cheerioAttrMethodStub.withArgs('src').returns(imgUrl);
		var teaser = "this tastes very nice";
		cheerioTextMethodStub.onCall(0).returns(teaser);
		var rating = 4.6;
		cheerioTextMethodStub.onCall(1).returns(rating);

		// when
		foodScraper("", callbackStub);
		
		// then callback should return object 
		assert(callbackStub.calledWithMatch({url: whats4eatsUrl+recipeSuffix}), "should append recipe onto url");
		assert(callbackStub.calledWithMatch({title: title}), "should have correct title");
		assert(callbackStub.calledWithMatch({img: imgUrl}), "should have correct image link");
		assert(callbackStub.calledWithMatch({teaser: teaser}), "should have correct teaser text");
		assert(callbackStub.calledWithMatch({averageRating: rating}), "should have correct rating");
	});
})