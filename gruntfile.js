module.exports = function(grunt){
	grunt.initConfig({
		watch: {
			// jade: {
			// 	files: ['views/**'],
			// 	options: {
			// 		livereload: true
			// 	}
			// },
			js:{
				files: ['wechat/**','wx/**','libs/**'],
				// tasks: ['jshint'],
				options: {
					livereload: true
				}
			}
		},

		nodemon: {
			dev: {
				options: {
					file: 'app.js',
					args: [],
					ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
					watchedExtensions: ['js'],
					watchedFolers: ['./'],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},

		concurrent: {
			tasks: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		}
	})
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	// grunt.loadNpmTasks('grunt-mocha-test');

	grunt.option('force',true);
	grunt.registerTask('default',['concurrent']);
}