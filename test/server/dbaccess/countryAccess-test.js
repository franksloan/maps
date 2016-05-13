var chai = require('chai');
var assert = chai.assert;
var mockery = require('mockery');
var sinon = require('sinon');
var countryAccessTestModule = '../../../server/dbaccess/countryAccess';
var assertModuleStub = { equal: function(){} };
var db = { collection: function(){} }
var collection = { find: function(){} };
var cursor = { each: function(){} }

describe('Country access', function() {
	
	beforeEach(function(){
		callbackStub = sinon.stub();

		dbStub = sinon.stub(db, "collection");
		dbStub.returns(collection);
		collectionFindStub = sinon.stub(collection, "find")
		collectionFindStub.returns(cursor);
		cursorStub = sinon.stub(cursor, "each")

		mockery.registerAllowable(countryAccessTestModule);
		
    	// set up mocks for the 'required' modules using mockery
		mockery.registerMock("assert", assertModuleStub);
		mockery.enable({
	      useCleanCache: true,
	      warnOnUnregistered: false
	    });
	});

	afterEach(function(){
	    mockery.disable();
	    mockery.deregisterAll();
	    assertModuleStub.reset();
	    dbStub.restore();
	    collectionFindStub.restore();
	});

	after(function(){
	    mockery.disable();
	    mockery.deregisterAll();
	});


	it("should request the sights page for the country", function(){
		var countryAccess = require(countryAccessTestModule)();
		var countryDocument = "spain";
		cursorStub.yields(null, countryDocument);
		// when
		countryAccess.findCountryDocument(db, {countryName: "australia"}, callbackStub);

		// then
		assert(callbackStub.calledWith(true), "the correct url should be used in request");
	});






})