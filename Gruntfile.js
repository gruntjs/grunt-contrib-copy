/*
 * grunt-contrib-copy
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Chris Talkington, contributors
 * Licensed under the MIT license.
 */

function myOnlyIf(src, dest, statSrc, statDest) {
    return (src === 'test/fixtures/test.js');
}

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
          {expand: true, cwd: 'test/fixtures', src: ['*.*'], dest: 'tmp/copy_test_files/'},
          {expand: true, cwd: 'test/fixtures', src: ['**'], dest: 'tmp/copy_test_mix/'},
          {expand: true, cwd: 'test/fixtures', src: ['<%= test_vars.match %>'], dest: 'tmp/copy_test_v<%= test_vars.version %>/'}
        ]
      },

      flatten: {
        files: [
          {expand: true, flatten: true, filter: 'isFile', src: ['test/fixtures/**'], dest: 'tmp/copy_test_flatten/'}
        ]
      },

      single: {
        files: [
          {src: ['test/fixtures/test.js'], dest: 'tmp/single.js'}
        ]
      },

      copy_if_newer_1: {
        files: [
          {expand: true, cwd: 'test/fixtures', src: ['*.*'], dest: 'tmp/copy_test_newer/'}
        ]
      },

      copy_if_newer_2: {
        files: [
          {expand: true, cwd: 'test/fixtures', src: ['*.*'], dest: 'tmp/copy_test_newer/', onlyIf: 'newer'}
        ]
      },

      copy_if_modified_1: {
        files: [
          {expand: true, cwd: 'test/fixtures', src: ['*.*'], dest: 'tmp/copy_test_modified/'}
        ]
      },

      copy_if_modified_2: {
        files: [
          {expand: true, cwd: 'test/fixtures', src: ['*.*'], dest: 'tmp/copy_test_modified/', onlyIf: 'modified'}
        ]
      },


      onlyIf_function: {
        files: [
          {expand: true, cwd: 'test/fixtures', src: ['*.*'], dest: 'tmp/copy_test_onlyIf_function/', onlyIf: myOnlyIf }
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
  grunt.registerTask('test', ['clean', 'copy', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test', 'build-contrib']);
};