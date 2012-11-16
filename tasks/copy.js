/*
 * grunt-contrib-copy
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Chris Talkington, contributors
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt-contrib-copy/blob/master/LICENSE-MIT
 */

module.exports = function(grunt) {
  'use strict';

  var path = require('path');

  grunt.registerMultiTask('copy', 'Copy files.', function() {
    var kindOf = grunt.util.kindOf;
    var helpers = require('grunt-lib-contrib').init(grunt);

    var options = helpers.options(this, {
      basePath: false,
      flatten: false,
      processName: false,
      processContent: false,
      processContentExclude: [],
      minimatch: {}
    });

    var copyOptions = {
      process: options.processContent,
      noProcess: options.processContentExclude
    };

    grunt.verbose.writeflags(options, 'Options');

    var dest = path.normalize(this.file.dest);
    var srcFiles = grunt.file.expandFiles(options.minimatch, this.file.src);

    if (srcFiles.length === 0) {
      grunt.fail.warn('Unable to copy; no valid source files were found.');
    }

    var destType = detectDestType(dest);

    if (destType === 'file') {
      if (srcFiles.length === 1) {
        var srcFile = path.normalize(srcFiles[0]);

        grunt.verbose.or.write('Copying file' + ' to ' + dest.cyan + '...');
        grunt.file.copy(srcFile, dest, copyOptions);

        grunt.verbose.or.ok();
      } else {
        grunt.fail.warn('Unable to copy multiple files to the same destination filename, did you forget a trailing slash?');
      }
    } else if (destType === 'directory') {
      var basePath = helpers.findBasePath(srcFiles, options.basePath);

      grunt.verbose.writeln('Base Path: ' + basePath.cyan);
      grunt.verbose.or.write('Copying files' + ' to ' + dest.cyan + '...');

      var destFile;
      var filename;
      var relative;

      srcFiles.forEach(function(srcFile) {
        srcFile = path.normalize(srcFile);
        filename = path.basename(srcFile);
        relative = path.dirname(srcFile);

        if (options.flatten) {
          relative = '';
        } else if (basePath && basePath.length >= 1) {
          relative = grunt.util._(relative).strRight(basePath);
          relative = grunt.util._(relative).trim(path.sep);
        }

        if (options.processName && kindOf(options.processName) === 'function') {
          filename = options.processName(filename);
        }

        // make paths outside grunts working dir relative
        relative = relative.replace(/\.\.(\/|\\)/g, '');

        destFile = path.join(dest, relative, filename);

        grunt.file.copy(srcFile, destFile, copyOptions);
      });

      grunt.verbose.or.ok();
    }
  });

  var detectDestType = function(dest) {
    if (grunt.util._.endsWith(dest, path.sep)) {
      return 'directory';
    } else {
      return 'file';
    }
  };
};