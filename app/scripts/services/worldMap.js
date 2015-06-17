var worldMap = function(zoom){
	//dimensions of view port
	var margin = {top:25, right: 30, bottom: 30, left: 25},
		width = parseInt(d3.select('.holder').style('width'), 10),
		width = width - margin.left - margin.right,
		height = width * 0.5;

	var map = {};
	map.projection = d3.geo.mercator()
    	.translate([width/2, height/1.5])
    	.scale((width - 1) / 2 / Math.PI);		

	map.path = d3.geo.path()
		.projection(map.projection);

	map.render = function(element, zoom, countries){
		map.svg = d3.select(element).append("svg")
    		.attr("width", width)
    		.attr("height", height)
    		.attr("id", "map")
			.append("g");
			
    	map.g = map.svg.append("g");

    	//add viewport rectangle as overlay
    	map.svg.append("rect")
    		.attr("class", "overlay")
    		.attr("width", width)
    		.attr("height", height);

    	map.svg.call(zoom).call(zoom.event);
    	
    	map.setData(countries);		
	};

	map.setData = function(countries){
		//get data to display the map
		map.g.selectAll("path")
		.attr("d", map.path);
			
		map.g.selectAll(".country")
	      .data(countries)
		  .enter().append("path")
	      .attr("class", "country")
	      .attr("id", function(j){
	      	return j.id;
	      })
	      .attr("d", map.path)
		  .on("mouseover", function(d){
			d3.select(this).style("fill", "#66D166");
			map.tooltip.style("left", (d3.event.pageX + 5) + "px")
			    .style("top", (d3.event.pageY - 5) + "px")
			    .transition().duration(300)
			    .style("opacity", 1)
			    .style("display", "block")
			    .text(this.id);
		  })
		  //if moving out of a country and not into another
		  //don't want to see the tooltip
		  .on("mouseout", function(d){
			d3.select(this).style("fill", "#eee");
			map.tooltip.style("display", "none");
		  });
  				
	}

	map.setTooltips = function(){
		//create tooltip which can be seen when hovering over country
		map.tooltip = d3.select("body").append("div")
		  	  .attr("class", "tooltip")
		  	  .style("opacity", 1e-6)
		  	  .style("background", "rgba(250,250,250,.7)");

		map.tooltip.append("span").attr("id", "countryName");
	}

	map.setButtons = function(element){
		//create tooltip which can be seen when hovering over country
		d3.select(element).append("div")
			.attr("class", "zoom-buttons");

		zoominButton = d3.select(".zoom-buttons").append("button")
		  	  .attr("id", "zoomin")
		  	  // .attr("class", "zoom-buttons")
		  	  .style("display", "inline-block")
		  	  .text('+');

		zoomoutButton = d3.select(".zoom-buttons").append("button")
		  	  .attr("id", "zoomout")
		  	  // .attr("class", "zoom-buttons")
		  	  .style("display", "inline-block")
		  	  .text('-');	
	}

	map.setZoom = function(zoom){
		//allow zoom by clicking buttons
		d3.selectAll("button").on('click', function(){
			map.zoomClick(zoom);
		});
	}	    	

	map.makeZoom = function(translate, scale, zoom){
		var self = this;
			return d3.transition().tween("zoom", function () {
			        var iTranslate = d3.interpolate(zoom.translate(), translate),
			            iScale = d3.interpolate(zoom.scale(), scale);
			        return function (t) {
			            zoom.scale(iScale(t))
			                .translate(iTranslate(t));
			            map.zoomed();
			        };
			    });
	}

	map.zoomClick = function(zoom){
		
		var dir = 1,
			factor = 0.25,
			extent = zoom.scaleExtent(),
			translate = zoom.translate(),
			translate0 = [],
			target_zoom = 1,
			center = [width / 2, height /2],
			l = [],
			//object to hold positions
			view = {x: translate[0], y: translate[1], k: zoom.scale()};

		d3.event.preventDefault();

		//zoom in or out
		dir = (d3.event.target.id === 'zoomin') ? 1 : -1;
		
		//new zoom
		target_zoom = zoom.scale() * (1 + factor * dir);

		//only allow zooming in so far
		if (target_zoom < extent[0] || target_zoom > extent[1]){
			return false;
		}

		translate0 = [(center[0] - view.x)/ view.k, (center[1] - view.y)/ view.k];
		view.k = target_zoom;
		l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

	    view.x += center[0] - l[0];
	    view.y += center[1] - l[1];
	    //send in the current pan and zoom
	    map.makeZoom([view.x, view.y], view.k, zoom);
	}
	
	return map;
}
module.exports = worldMap;