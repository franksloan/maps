(function(){

'use strict';

var CategoriesController = require('./controllers/categories-controller');
var InfoShowController = require('./controllers/info-show-controller');
var wmCategorySelect = require('./directives/wm-category-select');
var wmCategoryItem = require('./directives/wm-category-item');

var app = angular.module('WorldMaps', [])
.controller('CatCtrl', ['$scope', CategoriesController])
.controller('InfoCtrl', ['$scope', InfoShowController])
.directive('wmCategorySelect', wmCategorySelect)
.directive('wmCategoryItem', wmCategoryItem);


})();