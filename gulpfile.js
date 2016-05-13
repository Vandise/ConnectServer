var gulp = require('gulp'),
argv = require('yargs').argv,
nodemon = require('gulp-nodemon'),
babel = require('gulp-babel'),
mocha = require('gulp-mocha'),
uglify = require('gulp-uglify'),
watch = require('gulp-watch'),
istanbul = require('gulp-istanbul'),
plumber = require('gulp-plumber'),
jshint = require('gulp-jshint'),
del = require('del'),
gulpif = require('gulp-if');;

function isProduction() {
  return argv.production;
}

gulp.task('default',['conf','lint'], function () {
  return gulp.src('src/**/*.js')
  .pipe(plumber())
  .pipe(babel())
  .pipe(gulpif(isProduction(), uglify()))
  .pipe(gulp.dest('dist'));
});

gulp.task('conf',['clean'],function(){
  return gulp.src('src/conf/*')
  .pipe(gulp.dest('dist/conf'));
});

gulp.task('clean',function(){
  return del([
    'dist/**/*'
  ]);
});

gulp.task('lint', function() {
  return gulp.src('src/**/*.js')
  .pipe(jshint({esnext:true}))
  .pipe(jshint.reporter('default'));
});

gulp.task('pre-test',['default'], function () {
  return gulp.src(['dist/app/**/*.js'])
  .pipe(plumber())
  .pipe(istanbul({includeUntested: true}))
  .pipe(istanbul.hookRequire());
});

gulp.task('test',['pre-test'], function () {
  return gulp.src('dist/test/**/*.js')
  .pipe(plumber())
  .pipe(mocha())
  .pipe(istanbul.writeReports());
});

gulp.task('serve', function () {
  return nodemon({script:'dist/server.js',ext: 'js'}).on('restart',function(){console.log('restarted!');});   
});

gulp.task('watch', function () {
  watch('src/**/*.js', function(){
    gulp.start('test');
  });
});
