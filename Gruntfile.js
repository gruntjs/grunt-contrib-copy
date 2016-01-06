/*
 * grunt-contrib-copy
 * http://gruntjs.com/
 *
 * Copyright (c) 2016 Chris Talkington, contributors
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  // Make an empty dir for testing as git doesn't track empty folders.
  grunt.file.mkdir('test/fixtures/empty_folder');
  grunt.file.mkdir('test/expected/copy_test_mix/empty_folder');

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    touch : {
      original : {
        options: {
          nocreate: true,
          time: new Date('2035-12-01')
        },
        files : [
          // fixtures updates
          { src : 'test/fixtures/onlynewer/initial/onlyonce.txt' },
          { src : 'test/fixtures/onlynewer/initial/unchanged.txt' },
          { src : 'test/fixtures/onlynewer/initial/updated.txt' },
          { src : 'test/fixtures/onlynewer/updated/unchanged.txt' },
          { src : 'test/fixtures/onlynewer/updated/updated.txt' },

          // expected results updates
          { src : 'test/expected/copy_test_onlynewer/onlyonce.txt' },
          { src : 'test/expected/copy_test_onlynewer/unchanged.txt' },
          { src : 'test/expected/copy_test_onlynewer/updated.txt' }
        ]
      },
      changed : {
        options: {
          nocreate: true,
          mtime: new Date('2035-12-31')
        },
        files : [
          // fixtures timestamps
          { src : 'test/fixtures/onlynewer/updated/updated.txt' },

          // expected results updates
          { src : 'test/expected/copy_test_onlynewer/updated.txt' }
        ]
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      test: ['tmp']
    },

    test_vars: {
      name: 'grunt-contrib-copy',
      version: '0.1.0',
      match: 'folder_one/*'
    },

    // Configuration to be run (and then tested).
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'test/fixtures', src: ['*.js'], dest: 'tmp/copy_test_files/'},
          {expand: true, cwd: 'test/fixtures', src: ['**', '!*.wav'], dest: 'tmp/copy_test_mix/'},
          {expand: true, cwd: 'test/fixtures', src: ['<%= test_vars.match %>'], dest: 'tmp/copy_test_v<%= test_vars.version %>/'}
        ]
      },

      noexpandWild: {
        files: [
          {src: 'test/fixtures/*.js', dest: 'tmp/copy_test_noexpandWild/'}
        ]
      },

      flatten: {
        files: [
          {expand: true, flatten: true, filter: 'isFile', src: ['test/fixtures/**', '!**/*.wav'], dest: 'tmp/copy_test_flatten/'}
        ]
      },

      single: {
        files: [
          {src: ['test/fixtures/test.js'], dest: 'tmp/single.js'}
        ]
      },

      verbose: {
        files: [
          {expand: true, src: ['test/fixtures/**'], dest: 'tmp/copy_test_verbose/'}
        ]
      },

      mode: {
        options: {
          mode: '0444'
        },
        src: ['test/fixtures/test2.js'],
        dest: 'tmp/mode.js'
      },

      modeDir: {
        options: {
          mode: '0777'
        },
        files: [
          {
            expand: true,
            cwd: 'test/fixtures/',
            src: ['time_folder/**'],
            dest: 'tmp/copy_test_modeDir/'}
        ]
      },

      process: {
        options: {
          noProcess: ['test/fixtures/beep.wav'],
          process: function (content) {
            return content + '/* comment */';
          }
        },
        files: [{ expand: true, cwd: 'test/fixtures', src: ['test2.js', 'beep.wav'], dest: 'tmp/process/' }]
      },

      timestamp: {
        options: {
            process: function (content, srcpath) {
                if (srcpath === 'test/fixtures/time_folder/test_process.js') {
                    return 'with process and file contents were changed';
                } else {
                    return content;
                }
            },
            timestamp: true
        },
        files: [
            {expand: true, cwd: 'test/fixtures/time_folder/', src: ['**'], dest: 'tmp/copy_test_timestamp/'},
            {src: 'test/fixtures/time_folder/test.js', dest:'tmp/copy_test_timestamp/test1.js'}
        ]
      },

      onlynewer: {
        options: {
          timestamp: true,
          onlyNewer: true
        },
        files: [
          { expand: true, cwd: 'test/fixtures/onlynewer/initial', src: ['**'], dest: 'tmp/copy_test_onlynewer' },
          { expand: true, cwd: 'test/fixtures/onlynewer/updated', src: ['**'], dest: 'tmp/copy_test_onlynewer' }
        ]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');
  grunt.loadNpmTasks('grunt-touch');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['jshint', 'clean', 'touch:original', 'touch:changed', 'copy', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test', 'build-contrib']);
};
