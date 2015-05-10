var wmCategoryItem = function(){
	return {
		require: '^nwCategorySelect',
		restrict: 'E',
		templateUrl: '/views/directives/wm-category-item.html',
		replace: false,
		scope: {
			category: '='
		}
		
	}
};
module.exports = wmCategoryItem;