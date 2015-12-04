var topojsonService = function($document, $q, $rootScope, $window){
	var d = $q.defer();
	var topojsonService = {
          topo: function() { return d.promise; }
        };
	function onScriptLoad(){
		console.log('bubububu');
		$rootScope.$apply(function() {d.resolve($window.topojson); });
	}

	var scriptTag2 = $document[0].createElement('script');
	scriptTag2.type = 'text/javascript';
	scriptTag2.async = true;
	scriptTag2.src = "http://d3js.org/topojson.v1.min.js";
	scriptTag2.onreadystatechange = function(){
		if (this.readyState == 'complete'){
			onScriptLoad();
		}
	}
	scriptTag2.onload = onScriptLoad;

	var s = $document[0].getElementsByTagName('body')[0];
	s.appendChild(scriptTag2);

	return topojsonService;
};

module.exports = topojsonService;