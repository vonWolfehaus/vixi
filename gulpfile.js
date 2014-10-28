var gulp = require('gulp');
var rjs = require('gulp-requirejs');
var uglify = require('gulp-uglify');
var amdclean = require('amdclean');

/*
	I'm only using requirejs for its dependency resolution.
*/
gulp.task('default', function() {
	rjs({
			baseUrl: './src',
			include: ['Sprite', 'Stage'],
			onBuildWrite: function(name, path, contents) {
				return amdclean.clean({
					code: contents,
					removeAllRequires: true,
					prefixTransform: function(moduleName) {
						return moduleName.substring(moduleName.lastIndexOf('_') + 1, moduleName.length);
					},
					globalObject: true,
					globalObjectName: 'vixi'
				});
			},
			out: 'vixi.js',
			findNestedDependencies: true,
			wrap: false,
			keepAmdefine: false
		})
		.pipe(uglify({ outSourceMap: true }))
		.pipe(gulp.dest('./dist/'));
});
