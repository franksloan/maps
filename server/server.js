var express = require('express'),
	lrserver = require('tiny-lr')(),
	livereload = require('connect-livereload'),
	router = require('./router'),
	countryInfoAccess = require('./countryAccess');

var server = express();
var httpServer = require('http').Server(server);
var io = require('socket.io')(httpServer);
var socketsService = require('./socketsService')

var startServer = function(){

	server.use(express.static(__dirname + './../public'));

	server.use(livereload({port: 35729}));

	var expressRouter = express.Router();

	
	// 
	// socketsService().connect(io, function(){
		
	// });

	var APIrouter = router(expressRouter, io);
	server.use('/api', APIrouter);

	lrserver.listen(35729);

	server.all('/*', function(req, res){
		res.sendFile('index.html', { root: 'public' });
	});

	httpServer.listen(5000);
}

module.exports = startServer;



