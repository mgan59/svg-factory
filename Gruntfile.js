module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint:{
      files:['Gruntfile.js','index.js', 'package.json',
        'tests/*.js', 'tests/viewer/js/svg-factories'
      ]
    },
    // Configuration to be run (and then tested).
    svg_factory_writer: {
      testExamples: {
        options: {

        },
        files: [
          {
            expand:true, cwd:'svg-examples/', src:'*.svg', 
            dest:'tests/viewer/js/svg-factories/'
          }
        ]
      }
      
    },

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-svg-factory-writer');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'svg_factory_writer']);

};
