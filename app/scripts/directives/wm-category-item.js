var wmCategoryItem = function(){
	return {
		restrict: 'E',
		templateUrl: '/views/directives/wm-category-item.html',
		replace: false,
		scope: {
			category: '=',
			total: '='
		}
	}
};
module.exports = wmCategoryItem;