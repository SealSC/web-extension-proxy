module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      proxy: {
        files: {
          'dist/sealsc-web-extension-proxy.js': [ 'src/proxy.js' ]
        },

        options: {
          transform: [["babelify"]],
          browserifyOptions: {
            standalone: 'sealsc-web-extension-proxy'
          }
        }
      },
    },
    uglify: {
      options: {
        sourceMap: true
      },
      proxy: {
        files:{
          'dist/sealsc-web-extension-proxy.min.js': [ 'dist/sealsc-web-extension-proxy.js' ],
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', ['browserify', 'uglify']);
};
