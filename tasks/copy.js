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
      cwd: '',
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

    if (options.cwd.length > 0) {
      options.minimatch.cwd = options.cwd;
    }

    grunt.verbose.writeflags(options, 'Options');

    var dest = path.normalize(this.file.dest);
    var srcFiles = grunt.file.expandFiles(options.minimatch, this.file.srcRaw);

    if (srcFiles.length === 0) {
      grunt.fail.warn('Unable to copy; no valid source files were found.');
    }

    var srcFile;

    var destType = detectDestType(dest);

    if (destType === 'file') {
      if (srcFiles.length === 1) {
        srcFile = path.join(options.cwd, srcFiles[0]);

        grunt.verbose.or.write('Copying file' + ' to ' + dest.cyan + '...');
        grunt.file.copy(srcFile, dest, copyOptions);

        grunt.verbose.or.ok();
      } else {
        grunt.fail.warn('Unable to copy multiple files to the same destination filename, did you forget a trailing slash?');
      }
    } else if (destType === 'directory') {
      grunt.verbose.or.write('Copying files' + ' to ' + dest.cyan + '...');

      var destFile;

      var fileName;
      var filePath;

      srcFiles.forEach(function(file) {
        fileName = path.basename(file);
        filePath = path.dirname(file);

        srcFile = path.join(options.cwd, file);

        if (options.processName && kindOf(options.processName) === 'function') {
          fileName = options.processName(fileName) || fileName;
        }

        if (options.flatten) {
          destFile = path.join(dest, fileName);
        } else {
          destFile = path.join(dest, filePath, fileName);
        }

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