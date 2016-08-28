var gulp 	  = require('gulp');
var banner    = require('gulp-banner');
var concat	  = require('gulp-concat');
var cleanCSS  = require('gulp-clean-css');
var sass 	  = require('gulp-ruby-sass');
var uglify	  = require('gulp-uglify');
var pkg		  = require('./package.json');
var pump 	  = require('pump');
var webserver = require('gulp-webserver');

// Default task
gulp.task('default', ['concat', 'sass', 'uglify', 'webserver', 'watch']);

// Default comment
var comment = '/*\n' +
    ' * Theme Name: <%= pkg.name %>\n' +
    ' * Author: <%= pkg.author %>\n' +
    ' * Author URI: <%= pkg.homepage %>\n' +
    ' * Description: <%= pkg.description %>\n' +
    ' * Version: <%= pkg.version %>\n' +
    '*/\n\n';

// Sass Task - Use to create sass task
gulp.task('sass', function() {
    sass('assets/scss/**/*.scss')
        .on('error', sass.logError)
        .pipe(gulp.dest('assets/css/'));
});

// Concat and Clean task
gulp.task('concat', function() {
	return gulp.src('assets/css/*.css')
		  .pipe(concat('style.css'))
		  .pipe(cleanCSS({keepSpecialComments: 0}))
		  .pipe(banner(comment, {
		  	pkg: pkg
		  }))
		  .pipe(gulp.dest('./'));
});

// Uglify Task - Use to minify js files
gulp.task('uglify', function() {
	gulp.src('assets/_js/**/*.js')
	.pipe(concat('app.min.js'))
	.pipe(uglify())
	.pipe(banner(comment, {
		pkg: pkg
	}))
	.pipe(gulp.dest('assets/js/'))
});

// Webserver task - Use to start a local webserver
gulp.task('webserver', function() {
	gulp.src('./')
	.pipe(webserver({
		livereload: true,
		open: true,
		directoryListing: {
			enable: true,
			path: './'
		}
	}));
});

// Watch task - Use to watch change in your files and execute other tasks
gulp.task('watch', function() {
	gulp.watch(['assets/_js/**/*.js'], ['uglify']);
	gulp.watch(['assets/scss/**/*.scss'], ['sass']);
	gulp.watch(['assets/css/**/*.css'], ['concat']);
});