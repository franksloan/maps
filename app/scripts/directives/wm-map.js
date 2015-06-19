var d3WorldMap = require('./../services/worldMap');
var wmMap = function(d3Service, Category, $window, ngDialog){
	return {
		restrict: 'EA',
		link: function(scope, ele, attrs){
			d3Service.d3().then(function(d3) {
		    	//dimensions of view port
				var width = 1,
		    		height = 350;
		    	
		    	var map = d3WorldMap();

		    	map.zoomed = function() {
					var tra = zoom.translate(),
						sca = zoom.scale();
					
					map.g.attr("transform", 
						"translate("+tra+") " +
						"scale("+sca+")"
					);			
				};
				map.setTooltips();
				map.setButtons(ele[0]);
				var zoom = d3.behavior.zoom()
						.scaleExtent([1,8])
						.on("zoom", map.zoomed);
				//when world data json is loaded call render to set map on page
				scope.$watch('countries', function(countries){
					
					if(countries !== undefined){
						map.render(ele[0], zoom, countries, Category, ngDialog);
					}
				});
				
				map.setZoom(zoom);	
			});
		}
	}
}

module.exports = wmMap;