
var wmMap = function(d3Service, Category, $window, ngDialog, WorldMap){
	return {
		restrict: 'EA',
		link: function(scope, ele, attrs){
			d3Service.d3().then(function(d3) {		    	
				
				WorldMap.zoomed = function() {
					var tra = zoom.translate(),
						sca = zoom.scale();
					
					WorldMap.g.attr("transform", 
						"translate("+tra+") " +
						"scale("+sca+")"
					);			
				};
				
				var zoom = d3.behavior.zoom()
						.scaleExtent([1,8])
						.on("zoom", WorldMap.zoomed);
				//when world data json is loaded call render to set map on page
				scope.$watch('countries', function(countries){
		
					if(countries !== undefined){
						WorldMap.render(ele[0], zoom, countries, Category, ngDialog);
						WorldMap.setTooltips();
						WorldMap.setButtons(ele[0]);
						WorldMap.setZoom(zoom);
					}
				});
			});
		}
	}
}

module.exports = wmMap;