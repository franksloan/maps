var chai = require('chai');
var assert = chai.assert;
var mockery = require('mockery');
var sinon = require('sinon');
var countryIntroScraperTestModule = '../../../server/webscrapers/countryIntroScraper';
var callbackStub = function(){};
var lonelyPlanetUrl = "http://www.lonelyplanet.com";

describe('Country intro route', function() {
	var requestModuleStub, cheerioModuleStub;
	
	before(function(){
		callbackStub = sinon.stub();

		requestModuleStub = sinon.stub();

		mockery.registerAllowable(countryIntroScraperTestModule);
		
    	// set up mocks for the 'required' modules using mockery
		mockery.registerMock("request", requestModuleStub);
		mockery.registerMock("cheerio", cheerioModuleStub);
		mockery.enable({
	      useCleanCache: true,
	      warnOnUnregistered: false
	    });
	});

	it("should ...", function(){
		var countryIntroScraper = require(countryIntroScraperTestModule);

		countryIntroScraper("Dominican Republic", callbackStub);

		assert(requestModuleStub.calledWith(lonelyPlanetUrl+"/"+"Dominican-Republic"), "the correct url needs to be entered into request module");
	});

})