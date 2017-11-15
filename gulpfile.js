var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

var port = process.env.PORT || 9000;

gulp.task('server', function() {
	browserSync({
   	  notify: false,
   	  port: port,
   	  server: {
    	 baseDir: 'app',
                 routes: {
                    "/bower_components": "bower_components"
                }
      }
   });
});   

gulp.task('watch', function(){
    gulp.watch([
        'app/css/*.css',
				'app/css/**/*.css',
				'app/js/*.js',
        'app/js/**/*.js',
        'app/views/*.html',
        'app/*.html']).on('change', reload);
});

gulp.task('default', ['server', 'watch']);