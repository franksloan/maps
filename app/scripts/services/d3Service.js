var d3Service = function($document, $q, $rootScope, $window){
	var d = $q.defer();
	var d3Service = {
          d3: function() { return d.promise; }
        };
	function onScriptLoad(){
		$rootScope.$apply(function() {d.resolve($window.d3); });
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

	var s = $document[0].getElementsByTagName('body')[0];
	s.appendChild(scriptTag1);

	return d3Service;
};

module.exports = d3Service;