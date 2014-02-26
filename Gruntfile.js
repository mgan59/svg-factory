module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint:{
      files:['Gruntfile.js','index.js', 'package.json',
        'tests/*.js' 
        //'tests/viewer/js/svg-factories/globalWindow/*.js'
      ]
    },
    // Configuration to be run (and then tested).
    svg_factory_writer: {
      globalWindowExamples: {
        options: {
            template:'globalWindow'
        },
        files: [
          {
            expand:true, cwd:'svg-examples/', src:'*.svg', 
            dest:'tests/viewer/js/svg-factories/globalWindow/'
          }
        ]
      },
      commonJSExamples: {
        options: {
            template:'commonJS'
        },
        files: [
          {
            expand:true, cwd:'svg-examples/', src:'*.svg', 
            dest:'tests/viewer/js/svg-factories/commonJS/'
          }
        ]
      }
      
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-svg-factory-writer');

  // Default task(s).
  grunt.registerTask('default', ['svg_factory_writer', 'jshint']);

  grunt.registerTask('jshint', ['jshint']);

};
