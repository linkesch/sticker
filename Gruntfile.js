'use strict';
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9000;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
	require('time-grunt')(grunt);
	require('jit-grunt')(grunt);

	grunt.initConfig({
		watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            compass: {
                files: ['src/sass/{,*/}*.{scss,sass}'],
                tasks: ['css']
            },
            livereload: {
                options: {
                    livereload: grunt.option('livereloadport') || LIVERELOAD_PORT
                },
                files: [
                    '*.html',
                    'dist/css/{,*/}*.css'
                ]
            }
        },
        connect: {
            options: {
                port: grunt.option('port') || SERVER_PORT,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, './')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
		sass: {
    	    dist: {
                files: [{
                    expand: true,
                    cwd: 'src/sass/',
                    src: ['*.scss'],
                    dest: 'dist/css/',
                    ext: '.css'
                }]
            }
        },
        autoprefixer: {
            dist: {
                src: 'dist/css/*.css'
            }
        },
        cssmin: {
            dist: {
                files: {
                    'dist/css/sticker.min.css': [
                        'dist/css/sticker.css'
                    ]
                }
            }
        }
	});

	grunt.registerTask('css', ['sass', 'autoprefixer', 'cssmin']);
	grunt.registerTask('serve', ['css', 'connect', 'open', 'watch']);
	grunt.registerTask('default', ['css']);
};