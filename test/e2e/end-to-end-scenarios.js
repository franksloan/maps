'use strict';

describe('World Maps', function() {

  describe('Categories view', function() {

    beforeEach(function() {
      browser.get('index.html');
    });
    var query = element(by.model('query'));

    it('should filter the categories as a user types into the search box', function() {
      
      var categoryList = element.all(by.repeater('category in categories'));
      
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

      query.sendKeys('Music');
      expect(browser.getTitle()).toMatch(/Interactive maps - Music$/);
    });
  });
});