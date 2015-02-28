/*
 * grunt-contrib-copy
 * http://gruntjs.com/
 *
 * Copyright (c) 2015 Chris Talkington, contributors
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
          process: function (content, srcpath) {
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

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['jshint', 'clean', 'copy', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test', 'build-contrib']);
};
