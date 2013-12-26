module.exports = function (grunt) {

    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // Project Configuration
    var yeomanConfig = {
        app:  'app'
    };

    grunt.initConfig({
        yeoman:  yeomanConfig,
        pkg:     grunt.file.readJSON('package.json'),
        watch:   {
            js:   {
                files:   ['app.js', 'app/**/*.js'],
                tasks:   ['jshint'],
                options: {
                    livereload: true,
                }
            }
        },
        jshint:  {
            all: ['gruntfile.js', 'app.js', 'app/**/*.js']
        },
        nodemon: {
            dev: {
                options: {
                    file:              'app.js',
                    args:              [],
                    ignoredFiles:      ['README.md', 'node_modules/**'],
                    watchedExtensions: ['js'],
                    watchedFolders:    ['app', 'config'],
                    debug:             true,
                    delayTime:         1,
                    env:               {
                    },
                    cwd:               __dirname
                }
            }
        },

        concurrent: {
            tasks:   ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    });

    //Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Default task(s).
    grunt.registerTask('default', ['jshint', 'concurrent']);

    //Test task.
    grunt.registerTask('test', []);
};