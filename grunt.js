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
        }
    });

    grunt.registerTask('default', ['lint', 'jshint']);
};