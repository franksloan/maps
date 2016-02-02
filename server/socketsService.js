var totalFilms = function(client){
	console.log(client);
	
}

var connect = function(io){
	console.log('attempt connection');
	io.on('connection', function(client){
		console.log('connecting');
		return client;
	});
}

var socketsService = function(){
	return {
		totalFilms : totalFilms,
		connect : connect
	}
}

module.exports = socketsService;