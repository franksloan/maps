var CategoriesController = function($scope) {
	$scope.testVar = {
		exclamation: 'Woooop',
		warning: 'Please do not'
	};
	$scope.categories = categories;
};
var categories = [
	{title: 'Food'},
	{title: 'Film'},
	{title: 'Music'},
	{title: 'Language'}
];
module.exports = CategoriesController;