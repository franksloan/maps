//get http dependency
var http = require('http');

//Get information from an external API
var getExternalInfo =function(url, callback){
	http.get(url, function(res){
		
		var parts = [];
		//as data comes through add it to array
		res.on('data', function(part){
			parts.push(part);
		}).on('end', function() {
			//put all the buffers together into a JS
    		var body = JSON.parse(Buffer.concat(parts));
    
    		callback(body);
    	});
	});
}
module.exports = getExternalInfo;
