process.env.NODE_ENV = 'development'; //XXX hack for envify
var stringify = require('stringify');
module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		watch: {
			// builds the demo js
			browserify: {
				files: ['client/*.js', 'client/**/*.js', 'client/components/*.jsx', 'client/components/**/*.jsx', 'client/components/demo/*.jsxdemo'],
				tasks: ['jshint-jsx', 'react', 'browserify', 'notify:js'],
				options: {
					livereload: 35730
				}
			}
		},

		notify: {
			js: {
				options: {
					message: 'JS rebuilt' 
				}
			}
		},

		browserify: {
			options: {
				browserifyOptions: {
					debug: true,
					extensions: [ '.jsx', '.jsxdemo' ]
				},
				transform: [
					function(file) {
						return stringify({extensions: ['.jsxdemo']}).call(stringify, file);
					},
					[require('grunt-react').browserify, { harmony: true }],
					['browserify-shim'],
					'envify'
				]
			},

			demo: {
				src:        'client/demo.js',
				dest:       'js/demo.js'
			},

			shims: {
				src:        'client/ie-shims.js',
				dest:       'js/ie-shims.js'
			}
		},

		envify: {
			options: {

			}
		},

		'jshint-jsx': {
			options: {
				esnext: true,
				convertJSX: true,
				curly: true,
				undef: true,
				unused: true,
				funcscope: true,
				browser: true,
				debug: true,
				globals: { module: true, require: true, jQuery: true, Akismet: true, console: true }
			},
			all: ['client/**/*.js', 'client/**/*.jsx']
		},

		// we use this to compile jsx templates into individual js files 
		// for easy inclusion in sub-projects
		react: {
			options: {
				harmony: true
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: 'client/components',
						src: ['*.jsx', '**/*.jsx'],
						dest: 'js/components',
						ext: '.js'
					}
				]
			},
			deps: {
				files: [
					{
						expand: true,
						cwd: 'client',
						src: ['styles.js'],
						dest: 'js'
					},
					{
						expand: true,
						cwd: 'client/utils',
						src: ['*.js', '**/*.js'],
						dest: 'js/utils',
						ext: '.js'
					}
				]	
			}
		},
		'gh-pages': {
			options: {
				base: '.'
			},
			src: ['demo.html', 'js/**/*', 'node_modules/codemirror/lib/codemirror.css', 'node_modules/codemirror/theme/solarized.css']
		}
	});

	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-contrib-jshint-jsx');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-envify');
	grunt.loadNpmTasks('grunt-minifyify');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-react');
	grunt.loadNpmTasks('grunt-contrib-concat');     // concatenate
	grunt.loadNpmTasks('grunt-contrib-uglify');     // minify
	grunt.loadNpmTasks('grunt-contrib-watch');      // watch files for changes

	grunt.registerTask('default', ['watch']);

};
