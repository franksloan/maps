var dialogController = function($scope, $rootScope) {
        	// controller logic
        	var categoryName = $scope.ngDialogData.categoryName;
        	var countryData = $scope.ngDialogData.countryData;
			console.log(categoryName);
			var args = 'apple';
			$rootScope.$broadcast('updateNumber', args);
			$scope[categoryName] = countryData[0];
			$scope.index = 0;
			if(countryData.length > 1){
				$scope.more = true;
			}
			$scope.less = false;
			$scope.nextFilm = function(){
				if($scope.index < countryData.length - 1){
					$scope.index++;
					$scope[categoryName] = countryData[$scope.index];
					$scope.less = true;
				} 
				if($scope.index == countryData.length - 1) {
					$scope.more = false;
				}
			}
			$scope.previousFilm = function(){
				if($scope.index > 0){
					$scope.index--;
					$scope[categoryName] = countryData[$scope.index];
					$scope.more = true;
				} 
				if($scope.index == 0) {
					$scope.less = false;
				}
			}
		};



module.exports = dialogController;