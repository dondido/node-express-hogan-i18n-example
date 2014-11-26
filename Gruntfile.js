module.exports = function(grunt) { 
  grunt.initConfig({ 
    pkg: grunt.file.readJSON('package.json'), // read the json file 
    log: { 
      name: '<%= pkg.name %>', // this is the name of the project in package.json 
      version: '<%= pkg.version %>' // the version of the project in package.json 
    },

    copy: {
      build: {
        cwd: 'public/dev/',
        src: [ '**' ],
        dest: 'public/build/',
        expand: true
      },
    },

    clean: {
      build: {
        src: ['public/build/']
      },
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: 'public/build/css',
        src: ['*.css', '!*min.css'],
        dest: 'public/build/css'
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
            cwd: 'public/build/js',      // Src matches are relative to this path.
            src: ['*.js'], // Actual pattern(s) to match.
            dest: 'public/build/js'   // Destination path prefix.
          },
        ],
      },
    },

    imagemin: {                          // Task
      dynamic: {                         // Another target
        options: {                       // Target options
          optimizationLevel: 7
        },
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'public/build/images/',   // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
          dest: 'public/build/images/'   // Destination path prefix
        }]
      }
    }
  }); 

  grunt.registerMultiTask('log', 'Log project details.', function() { 
    // because this uses the registerMultiTask function it runs grunt.log.writeln() 
    // for each attribute in the above log: {} object 
    grunt.log.writeln(this.target + ': ' + this.data); 
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  //grunt.registerTask('default', ['cssmin', 'uglify']);
  grunt.registerTask('default', ['clean', 'copy', 'cssmin', 'uglify', 'imagemin']);
};