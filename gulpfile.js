'use strict';

// sass compile
var gulp        = require('gulp');
var sass        = require('gulp-sass');
var prettify    = require('gulp-prettify');
var minifyCss   = require("gulp-minify-css");
var rename      = require("gulp-rename");
var uglify      = require("gulp-uglify");
var rtlcss      = require("gulp-rtlcss");
var nodemon		= require('gulp-nodemon');

//*** SASS compiler task
gulp.task('sass', function () {
    
  // bootstrap compilation
	gulp.src('./public/sass/bootstrap.scss').pipe(sass()).pipe(gulp.dest('./public/assets/global/plugins/bootstrap/css/'));

  // select2 compilation using bootstrap variables
	gulp.src('./public/assets/global/plugins/select2/sass/select2-bootstrap.min.scss').pipe(sass({outputStyle: 'compressed'})).pipe(gulp.dest('./public/assets/global/plugins/select2/css/'));

  // global theme stylesheet compilation
	gulp.src('./public/sass/global/*.scss').pipe(sass()).pipe(gulp.dest('./public/assets/global/css'));
	gulp.src('./public/sass/apps/*.scss').pipe(sass()).pipe(gulp.dest('./public/assets/apps/css'));
	gulp.src('./public/sass/pages/*.scss').pipe(sass()).pipe(gulp.dest('./public/assets/pages/css'));

  // theme layouts compilation
  gulp.src('./public/sass/layouts/layout5/**/*.scss').pipe(sass()).pipe(gulp.dest('./public/assets/layouts/layout5/css'));

});

gulp.task('default', function () {
    nodemon({
        script: 'server.js',
        ext: "js"});

    //gulp.watch(['./public/**/*.js'], ['minify']);
    //gulp.watch('./public/sass/**/*.scss', ['sass', 'minify']);
});

//*** CSS & JS minify task
gulp.task('minify', function () {
    // css minify 
    gulp.src(['./public/assets/apps/css/*.css', '!./public/assets/apps/css/*.min.css']).pipe(minifyCss()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('./public/html'));
    gulp.src(['./public/assets/global/css/*.css','!./public/assets/global/css/*.min.css']).pipe(minifyCss()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('./public/html'));
    gulp.src(['./public/assets/pages/css/*.css','!./public/assets/pages/css/*.min.css']).pipe(minifyCss()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('./public/html'));    
    gulp.src(['./public/assets/layouts/**/css/*.css','!./public/assets/layouts/**/css/*.min.css']).pipe(rename({suffix: '.min'})).pipe(minifyCss()).pipe(gulp.dest('./public/html'));
    gulp.src(['./public/assets/layouts/**/css/**/*.css','!./public/assets/layouts/**/css/**/*.min.css']).pipe(rename({suffix: '.min'})).pipe(minifyCss()).pipe(gulp.dest('./public/html'));

    gulp.src(['./public/assets/global/plugins/bootstrap/css/*.css','!./public/assets/global/plugins/bootstrap/css/*.min.css']).pipe(minifyCss()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('./public/html'));

    //js minify
    gulp.src(['./public/assets/apps/scripts/*.js','!./public/assets/apps/scripts/*.min.js']).pipe(uglify()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('./public/html'));
    gulp.src(['./public/assets/global/scripts/*.js','!./public/assets/global/scripts/*.min.js']).pipe(uglify()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('./public/html'));
    gulp.src(['./public/assets/pages/scripts/*.js','!./public/assets/pages/scripts/*.min.js']).pipe(uglify()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('./public/html'));
    gulp.src(['./public/assets/layouts/**/scripts/*.js','!./public/assets/layouts/**/scripts/*.min.js']).pipe(uglify()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('./public/html'));
});

//*** RTL convertor task
gulp.task('rtlcss', function () {

  gulp
    .src(['./public/assets/apps/css/*.css', '!./public/assets/apps/css/*-rtl.min.css', '!./public/assets/apps/css/*-rtl.css', '!./public/assets/apps/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./public/assets/apps/css'));

  gulp
    .src(['./public/assets/pages/css/*.css', '!./public/assets/pages/css/*-rtl.min.css', '!./public/assets/pages/css/*-rtl.css', '!./public/assets/pages/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./public/assets/pages/css'));

  gulp
    .src(['./public/assets/global/css/*.css', '!./public/assets/global/css/*-rtl.min.css', '!./public/assets/global/css/*-rtl.css', '!./public/assets/global/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./public/assets/global/css'));

  gulp
    .src(['./public/assets/layouts/**/css/*.css', '!./public/assets/layouts/**/css/*-rtl.css', '!./public/assets/layouts/**/css/*-rtl.min.css', '!./public/assets/layouts/**/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./public/assets/layouts'));

  gulp
    .src(['./public/assets/layouts/**/css/**/*.css', '!./public/assets/layouts/**/css/**/*-rtl.css', '!./public/assets/layouts/**/css/**/*-rtl.min.css', '!./public/assets/layouts/**/css/**/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./public/assets/layouts'));

  gulp
    .src(['./public/assets/global/plugins/bootstrap/css/*.css', '!./public/assets/global/plugins/bootstrap/css/*-rtl.css', '!./public/assets/global/plugins/bootstrap/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./public/assets/global/plugins/bootstrap/css')); 
});

//*** HTML formatter task
gulp.task('prettify', function() {
  	gulp.src('./**/*.html').
  	  	pipe(prettify({
    		indent_size: 4, 
    		indent_inner_html: true,
    		unformatted: ['pre', 'code']
   		})).
   		pipe(gulp.dest('./public'));
});