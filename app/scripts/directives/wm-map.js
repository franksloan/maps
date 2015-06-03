var d3WorldMap = require('./../services/worldMap');
var wmMap = function(d3Service){
	return {
		restrict: 'EA',
		scope: {},
		link: function(scope, element, attrs){
			d3Service.d3().then(function(d3) {
				
		    	//dimensions of view port
				var width = 1000,
		    		height = 700;


		    	
		    	var map = d3WorldMap();

		    	map.zoomed = function() {
					
					var tra = zoom.translate(),
						sca = zoom.scale();
					
					map.g.attr("transform", 
						"translate("+tra+") " +
						"scale("+sca+")"
						);			
				}
				
				map.setTooltips();
				map.setButtons(element[0]);
				var zoom = d3.behavior.zoom()
						.scaleExtent([1,8])
						.on("zoom", map.zoomed);

				map.render(element[0], zoom);
				map.setZoom(zoom);
				
		    	
			});//d3service
		}//link
	}
}

module.exports = wmMap;