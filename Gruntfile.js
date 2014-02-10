/*
 * grunt-contrib-copy
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 Chris Talkington, contributors
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

      verbose: {
        files: [
          {expand: true, src: ['test/fixtures/**'], dest: 'tmp/copy_test_verbose/'}
        ]
      },

      mode: {
        options: {
          mode: '0444',
        },
        src: ['test/fixtures/test2.js'],
        dest: 'tmp/mode.js',
      },

      symlink: {
        options: {
          copySymlinkAsSymlink: true,
        },
        files: [
          {expand: true, cwd: 'test/fixtures', src: ['*.js'], dest: 'tmp/copy_test_symlink'}
        ]
      },

      dirlink: {
        options: {
          copySymlinkAsSymlink: true,
        },
        files: [
          {expand: true, cwd: 'test/fixtures/dirlink', src: ['**/*'], dest: 'tmp/copy_test_dirlink'}
        ]
      },
    },

    //On windows, "git clone" doesn't copy symlinks as real symlinks.
    //If we want to use symlinks in tests, we need to create this symlinks.
    symlink: {
      options: {
        overwrite: true
      },
      tests: {
        files: [{
          src: 'test/fixtures/test2.js',
          dest: 'test/fixtures/test2.link.js',
        }, {
          src: 'test/fixtures/dirlink/dir/file-b.js',
          dest: 'test/fixtures/dirlink/dir/link-b.js',
        }, {
          src: 'test/fixtures/dirlink/dir',
          dest: 'test/fixtures/dirlink/link',
        }, {
          src: 'test/expected/copy_test_symlink/test2.js',
          dest: 'test/expected/copy_test_symlink/test2.link.js',
        }, {
          src: 'test/expected/copy_test_mix/dirlink/dir',
          dest: 'test/expected/copy_test_mix/dirlink/link',
        }, {
          src: 'test/expected/copy_test_flatten/file-b.js',
          dest: 'test/expected/copy_test_flatten/link-b.js',
        }, {
          src: 'test/expected/copy_test_dirlink/dir/file-b.js',
          dest: 'test/expected/copy_test_dirlink/dir/link-b.js',
        }, {
          src: 'test/expected/copy_test_dirlink/dir',
          dest: 'test/expected/copy_test_dirlink/link',
        }],
      },
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
  grunt.loadNpmTasks('grunt-contrib-symlink');

  grunt.registerTask('create-symlinks', function() {
    var isSymlinksImplemented = require('./test/isSymlinksImplemented.js')();

    if (isSymlinksImplemented) {
      //only for OS with symlinks
      grunt.task.run('symlink');
    } else {
      //for OS without symlinks we need to create another test data set
      
    }
  });

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'create-symlinks', 'copy', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test', 'build-contrib']);
};