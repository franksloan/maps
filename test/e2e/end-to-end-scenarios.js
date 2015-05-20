'use strict';

describe('World Maps', function() {

  it('redirects to main page', function() {
    browser.get('index.html');
    browser.getLocationAbsUrl().then(function(url){
        expect(url).toBe('/main');
    });
  });

  describe('Categories view', function() {

    beforeEach(function() {
      browser.get('index.html');
    });
    var query = element(by.model('query'));

    it('should filter the categories as a user types into the search box', function() {
      
      var categoryList = element.all(by.repeater('category in categories'));
      //test for 4 categories when not filtered
      expect(categoryList.count()).toBe(4);

      query.sendKeys('Food');
      expect(categoryList.count()).toBe(1);

      query.clear();
      query.sendKeys('Film');
      expect(categoryList.count()).toBe(1);
    });

    it('should display the current filter in the title', function(){
      query.clear();
      expect(browser.getTitle()).toMatch(/Interactive maps -$/);

      // query.sendKeys('Music');
      // expect(browser.getTitle()).toMatch(/Interactive maps - Music$/);
    });

    it('should render links', function(){
      element.all(by.css('.info li a')).first().click();
      browser.getLocationAbsUrl().then(function(url){
        expect(url).toBe('/main/films/the-beach');
      });
    });
  });

  describe('Film detail view', function() {
    beforeEach(function() {
      browser.get('#/main/films/the-beach');
    });

    it('should display placeholder with filmId', function(){
      expect(element(by.binding('film.title')).getText()).toBe('The Beach');
    });
  });
  describe('Food detail view', function() {
    beforeEach(function() {
      browser.get('#/main/food/chicken-korma');
    });

    it('should display placeholder with filmId', function(){
      expect(element(by.binding('food.name')).getText()).toBe('Chicken korma');
    });
  });
});