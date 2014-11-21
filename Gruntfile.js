module.exports = function(grunt) { 
  grunt.initConfig({ 
    pkg: grunt.file.readJSON('package.json'), // read the json file 
    log: { 
      name: '<%= pkg.name %>', // this is the name of the project in package.json 
      version: '<%= pkg.version %>' // the version of the project in package.json 
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'public/css/dev/',
        src: ['*.css'],
        dest: 'public/css/min/',
        ext: '.min.css'
      }
    },
    uglify: {
      dynamic_mappings: {
        // Grunt will search for "*.js" under "public/css/" when the "uglify" task
        // runs and build the appropriate src-dest file mappings then, so you
        // don't need to update the Gruntfile when files are added or removed.
        files: [
          {
            expand: true,     // Enable dynamic expansion.
            cwd: 'public/js/',      // Src matches are relative to this path.
            src: ['*.js'], // Actual pattern(s) to match.
            dest: 'public/js/min/',   // Destination path prefix.
            ext: '.min.js'   // Dest filepaths will have this extension.
          },
        ],
      },
    },
  }); 

  grunt.registerMultiTask('log', 'Log project details.', function() { 
    // because this uses the registerMultiTask function it runs grunt.log.writeln() 
    // for each attribute in the above log: {} object 
    grunt.log.writeln(this.target + ': ' + this.data); 
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['cssmin', 'uglify']);
};