var gulp = require('gulp');
var rjs = require('gulp-requirejs');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var fs = require('fs');

// this is great, but i really need to simply hit 'refresh' instead of opening a command prompt
// i could watch the files and all that... but that still means opening a command prompt :P
// var resolve = require('gulp-resolve-dependencies');


gulp.task('geo', function() {
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

gulp.task('dev', function() {
	rjs({
			baseUrl: 'src',
			include: ['Sprite', 'Stage'],
			onBuildWrite: function(name, path, contents) {
				return require('amdclean').clean({
					code: contents,
					removeAllRequires: true,
					globalObject: true,
					globalObjectName: 'von2d'
				});
			},
			out: 'von2d.js',
			findNestedDependencies: true,
			wrap: false,
			keepAmdefine: false
		})
		.pipe(gulp.dest('dist/'));
});

/*
gulp.task('dev', function() {
	var i, dir = 'src/',
		allFiles = fs.readdirSync(dir);
	
	for (i = 0; i < allFiles.length; i++) {
		allFiles[i] = dir + allFiles[i];
	}
	
	gulp.src(allFiles)
		.pipe(resolve({
				log: true,
				pattern: /\* @require (.*?\.js)/g
			}))
		// .pipe(uglify({ outSourceMap: true }))
		.pipe(concat('von2d.js'))
		// .pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist/'));
});
*/

// gulp.task('watch', function() {
// 	gulp.watch('src/**/*.js', ['dev']);
// });

gulp.task('release', ['dev'], function() {
	var min = 'dist/von2d.min.js';
	if (fs.existsSync(min)) {
		fs.unlinkSync(min);
	}
	
	gulp.src('dist/von2d.js')
		.pipe(uglify({ outSourceMap: true }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist/'));
});


gulp.task('default', ['release']);
