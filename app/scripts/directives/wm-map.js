var d3WorldMap;
var wmMap = function(d3Service){
	return {
		restrict: 'EA',
		scope: {},
		link: function(scope, element, attrs){
			d3Service.d3().then(function(d3) {
				//dimensions of view port
				var width = 1000,
		    		height = 700;
		    	var map = worldMap();
		    	var zoom = d3.behavior.zoom()
					.scaleExtent([1,8])
					.on("zoom", map.zoomed);
		    	map.render();
		    	function worldMap(){
		    		var map = {};
		    		var projection = d3.geo.mercator()
				    	.translate([width/2, height/2])
				    	.scale((width - 1) / 2 / Math.PI);
						

					var path = d3.geo.path()
			    		.projection(projection);
			    	var tooltip;
			    	var svg;
			    	var g;

		    		map.render = function(){
		    			svg = d3.select(element[0]).append("svg")
				    		.attr("width", width)
				    		.attr("height", height)
							.append("g");
							
				    	g = svg.append("g");

				    	//add viewport rectangle as overlay
				    	svg.append("rect")
				    		.attr("class", "overlay")
				    		.attr("width", width)
				    		.attr("height", height);

				    	svg.call(zoom).call(zoom.event);

				    	map.getData();
				    	// map.setZoom();
						
		    		};

		    		map.getData = function(){
		    			//get data to display the map
						d3.json("world.json", function(error, world) {
				  			if (error) return console.error(error);
				  			var countries = topojson.feature(world, world.objects.countries).features;

							g.selectAll("path")
							.attr("d", path);
				  			
							g.selectAll(".country")
						      .data(countries)
							  .enter().append("path")
						      .attr("class", "country")
						      .attr("id", function(j){
						      	return j.id;
						      })
						      .attr("d", path)
							  .on("mouseover", function(d){
								d3.select(this).style("fill", "#3cc");
								tooltip.style("left", (d3.event.pageX + 5) + "px")
								    .style("top", (d3.event.pageY - 5) + "px")
								    .transition().duration(300)
								    .style("opacity", 1)
								    .style("display", "block")
								    .text(this.id);
							  })
							  //if moving out of a country and not into another
							  //don't want to see the tooltip
							  .on("mouseout", function(d){
								d3.select(this).style("fill", "#ccc");
								tooltip.style("display", "none");
							  });
				  				
						});
		    		}//getData

		    		return map;
				}
			});//d3service
		}//link
	}
}

module.exports = wmMap;