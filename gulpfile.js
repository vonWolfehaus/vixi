var gulp = require('gulp');
var rjs = require('gulp-requirejs');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('build-geo', function() {
	rjs({
		baseUrl: 'src',
		out: 'von.geom.js',
		include: ['Matrix2', 'Rectangle', 'Point'],
		wrap: true,
		keepAmdefine: false
	})
		.pipe(uglify())
		.pipe(gulp.dest('dist/'));
});

gulp.task('build-dev', function() {
	rjs({
			baseUrl: 'src',
			include: ['Sprite', 'Stage'],
			onBuildWrite: function(name, path, contents) {
				return require('amdclean').clean({
					code: contents,
					removeAllRequires: true,
					globalObject: true,
					globalObjectName: 'von2d'/*,
					globalModules: []*/
				});
			},
			out: 'von2d.js',
			findNestedDependencies: true,
			wrap: false,
			keepAmdefine: false
		})
		.pipe(gulp.dest('dist/'));
});

gulp.task('build-release', ['build-dev'], function() {
	gulp.src('dist/von2d.js')
		.pipe(uglify({ outSourceMap: true }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist/'));
});


gulp.task('default', ['build-release']);
