var d3Service = function($document, $q, $rootScope, $window){
	var d = $q.defer();
	function onScriptLoad(){
		$rootScope.$apply(function() {d.resolve(window.d3); });
	}
	var scriptTag1 = $document[0].createElement('script');
	scriptTag1.type = 'text/javascript';
	scriptTag1.async = true;
	scriptTag1.src = "http://d3js.org/d3.v3.min.js";
	scriptTag1.onreadystatechange = function(){
		if (this.readyState == 'complete'){
			onScriptLoad();
		}
	}
	scriptTag1.onload = onScriptLoad;

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
	s.appendChild(scriptTag1);
	s.appendChild(scriptTag2);

	return {
		d3: function() {return d.promise; }
	};
};

module.exports = d3Service;