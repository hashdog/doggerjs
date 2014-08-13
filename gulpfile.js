'use strict';

var del = require('del'),
    gulp = require('gulp'),
    htmlify = require('gulp-angular-htmlify'),
    templateCache = require('gulp-angular-templatecache'),
    autoprefixer = require('gulp-autoprefixer'),
    changed = require('gulp-changed'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    minifyCss = require('gulp-minify-css'),
    minifyHtml = require('gulp-minify-html'),
    ngAnnotate = require('gulp-ng-annotate'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify');

var sources = {
  styles: 'src/stylesheets/',
  images: 'src/img/**/*',
  scripts: 'src/js/**/*.js',
  templatesIndex: 'src/views/index.html',
  templatesAll: ['src/views/**/*.html', '!src/views/index.html']
};

// Clean up!
gulp.task('clean', function(cb) {
  del(['public/js', 'public/css', 'public/img', 'public/index.html'], cb);
});

// Styles
gulp.task('sass', function() {
  return gulp.src(sources.styles + 'style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(minifyCss())
    .pipe(plumber.stop())
    .pipe(gulp.dest('public/css'));
});

gulp.task('css', function() {
  /*
   * Put here all css that you use in your app
   * eg. ['public/lib/bootstrap/dist/css/bootstrap.css']
   */
  gulp.src([
    'public/lib/bootstrap/dist/css/bootstrap.css'
  ])
    .pipe(minifyCss({ keepSpecialComments: 0 }))
    .pipe(gulp.dest('public/css'));
});

// Images
gulp.task('images', function() {
  var imgDest = 'public/img';
  return gulp.src(sources.images)
    .pipe(changed(imgDest))
    .pipe(imagemin({
      optimizationLevel: 8,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(imgDest));
});

// JS hint task
gulp.task('jshint', function() {
  gulp.src(sources.scripts)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

// Scripts
gulp.task('scripts:angular', function() {
  return gulp.src([
    'public/lib/angular/angular.js',
    'public/lib/angular-cookies/angular-cookies.js',
    'public/lib/angular-resource/angular-resource.js',
    'public/lib/angular-route/angular-route.js'
  ])
    .pipe(concat('angular-all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

gulp.task('scripts:vendors', function() {
  /*
   * Put here all scripts that you use in your app
   * eg. ['public/lib/moment/moment.js']
   */
  return gulp.src([''])
    .pipe(concat('vendors.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

gulp.task('scripts:app', function() {
  // The files order is important
  return gulp.src([
    'src/js/app.js',
    'src/js/services/*.js',
    'src/js/controllers/*.js',
    'src/js/directives/*.js',
    'src/js/filters/*.js'
  ])
    .pipe(plumber())
    .pipe(concat('app.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(plumber.stop())
    .pipe(gulp.dest('public/js'));
});

// Templates
gulp.task('templates:all', function() {
  return gulp.src(sources.templatesAll)
    .pipe(plumber())
    .pipe(minifyHtml({ empty: true }))
    .pipe(templateCache({
      root: 'views',
      standalone: true
    }))
    .pipe(htmlify())
    .pipe(plumber.stop())
    .pipe(gulp.dest('public/js'));
});

gulp.task('templates:index', function() {
  return gulp.src(sources.templatesIndex)
    .pipe(plumber())
    .pipe(minifyHtml({ empty: true }))
    .pipe(htmlify())
    .pipe(plumber.stop())
    .pipe(gulp.dest('public'));
});

// Watch
gulp.task('watch', function() {
  gulp.watch(sources.styles + '**/*.scss', ['sass']);
  gulp.watch(sources.images, ['images']);
  gulp.watch(sources.scripts, ['scripts:app']);
  gulp.watch(sources.templatesAll, ['templates:all']);
  gulp.watch(sources.templatesIndex, ['templates:index']);
});

gulp.task('default', ['clean'], function() {
  gulp.start('sass', 'css', 'images', 'scripts:angular', 'scripts:vendors', 'scripts:app', 'templates:all', 'templates:index', 'watch');
});
