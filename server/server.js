var express = require('express'),
	lrserver = require('tiny-lr')(),
	livereload = require('connect-livereload'),
	router = require('./router'),
	countryInfoAccess = require('./countryAccess');
	

var server = express();

var startServer = function(){

	server.use(express.static(__dirname + './../public'));

	server.use(livereload({port: 35729}));

	var expressRouter = express.Router();
	
	var APIrouter = router(expressRouter);

	server.use('/api', APIrouter);

	lrserver.listen(35729);

	server.all('/*', function(req, res){
		res.sendFile('index.html', { root: 'public' });
	});

	server.listen(5000);
}

module.exports = startServer;



