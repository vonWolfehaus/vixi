var gulp = require('gulp');
var rjs = require('gulp-requirejs');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('build-geom', function() {
	gulp.src('src/geom/*.js')
		.pipe(concat('lib-geom.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/'));
});

gulp.task('build', function() {
	rjs({
		baseUrl: 'src',
		out: 'von-canvas2d.js',
		include: ['Container', 'Sprite'],
		wrap: true,
		keepAmdefine: false
	})
		.pipe(uglify())
		.pipe(gulp.dest('dist/'));
});

gulp.task('all', ['build-geom', 'build'], function() {
	gulp.src(['dist/lib-geom.js', '../lib/LinkedList.js', 'dist/von-canvas2d.js'])
		.pipe(concat('von-canvas2d-all.js'))
		.pipe(gulp.dest('dist/'));
});

gulp.task('default', ['all']);