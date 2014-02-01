/**
 * Build File
 */
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        lint: {
            src: ["public/js/**/*.js"]
        },
        jsduck: {
            main: {
                src: [
                    'src/server',
                    'src/shared',
                    'src/client/controllers',
                    'src/client/client.js',
                    'src/client/public/mobile',
                    'src/client/public/scripts/player',
                    'src/client/public/scripts/screen'
                ],
                dest: 'build/api',
                options: {
                    'builtin-classes': true,
                    'title': 'Youtube DJ'
                }
            }
        },
        clean: {
            build: ["build"]
        },
        watch: {
            files: ['sass/*.scss'],
            tasks: ['compass:dev']
        },
        compass: {
            dev: {
                src: 'sass',
                dest: 'src/client/public/css',
                linecomments: true,
                forcecompile: true,
                require: [],
                debugsass: true,
                images: 'images',
                relativeassets: true
            },
            prod: {
                src: 'sass',
                dest: 'src/client/public/css',
                linecomments: false,
                forcecompile: true,
                require: [],
                debugsass: false,
                images: 'images',
                relativeassets: true
            }
        }
    });

    grunt.registerTask('prepare', function() {
        grunt.file.mkdir('build');
    });

    grunt.loadNpmTasks('grunt-jsduck');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-compass');

    grunt.registerTask('default', ['clean', 'prepare', 'compass:prod', 'jsduck']);
};