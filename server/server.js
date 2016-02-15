var express = require('express'),
	lrserver = require('tiny-lr')(),
	livereload = require('connect-livereload'),
	router = require('./router');

var server = express();
var httpServer = require('http').Server(server);
var io = require('socket.io')(httpServer);

var startServer = function(){

	server.use(express.static(__dirname + './../public'));

	server.use(livereload({port: 35729}));

	var expressRouter = express.Router();

	var APIrouter = router(expressRouter, io);
	server.use('/api', APIrouter);

	lrserver.listen(35729);

	server.all('/*', function(req, res){
		res.sendFile('index.html', { root: 'public' });
	});

	httpServer.listen(5000);
}

module.exports = startServer;



