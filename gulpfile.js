var gulp = require('gulp'),
	gutil = require('gulp-util'),
	jshint = require('gulp-jshint'),
	browserify = require('gulp-browserify'),
	concat = require('gulp-concat'),
	clean = require('gulp-clean'),
	embedlr = require('gulp-embedlr'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
    refresh = require('gulp-livereload'),
    plumber = require('gulp-plumber'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    port = 5000,
    minifyCSS = require('gulp-minify-css');

//JSHint task - check for js code quality
gulp.task('lint', function(){
	gulp.src('./app/scripts/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

// Browserify
gulp.task('browserify', function(){
	// entry into js files
	gulp.src(['app/scripts/main.js'])
	.pipe(plumber())
	.pipe(browserify({
		insertGlobals: true,
		debug: true
	}))
	//put all js into one file
	.pipe(concat('index.js'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify())
	//output into folder
	.pipe(gulp.dest('public/js'))
	.pipe(refresh(lrserver));
});

gulp.task('watch', ['lint'], function(){
	var writeError = function(){
		console.log('err');
	};
	//watch for any changes to js files whilst running
	gulp.watch(['app/scripts/*.js', 'app/scripts/**/*.js'],[
		'lint',
		'browserify'
		]).on('error', writeError);
	gulp.watch(['app/index.html', 'app/views/**/*.html'], [
		'views'
		]).on('error', writeError);
	gulp.watch(['app/styles/*.css'], [
		'css'
		]).on('error', writeError);
});

//move html into served folder
gulp.task('views', function(){
	gulp.src('app/index.html')
	.pipe(gulp.dest('public/'));

	gulp.src('app/views/**/*')
	.pipe(gulp.dest('public/views/'))
	.pipe(refresh(lrserver));
});

//move css and minify
gulp.task('css', function() {
	gulp.src('app/styles/app.css')
	.pipe(minifyCSS())
	.pipe(rename('style.min.css'))
	.pipe(gulp.dest('public/css'));

});

// set up the server to reload any updates
// while running the app
var server = express();
// reload
server.use(livereload({port: livereloadport}));
// folder to use for root
server.use(express.static('./public'));

server.all('/*', function(req, res){
	res.sendFile('index.html', { root: 'public' });
});

gulp.task('dev', function() {
	console.log('running');
	// start the server
	server.listen(port);
	// run live reload
	lrserver.listen(livereloadport);
	// run watch to take care of any changes made
	gulp.start('watch');
});

gulp.task('default', ['lint', 'browserify', 'views', 'css', 'dev']);