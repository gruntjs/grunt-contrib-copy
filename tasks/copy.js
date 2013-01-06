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
  var fs = require('fs');

  grunt.registerMultiTask('copy', 'Copy files.', function() {
    var kindOf = grunt.util.kindOf;
    var helpers = require('grunt-lib-contrib').init(grunt);

    var options = helpers.options(this, {
      excludeEmpty: false,
      processContent: false,
      processContentExclude: [],
    });

    grunt.verbose.writeflags(options, 'Options');

    var dest = path.normalize(this.file.dest);
    var src = this.file.src;

    if (src.length === 0 && options.excludeEmpty) {
      grunt.fail.warn('Unable to copy; no valid sources were found.');
    }

    if (detectDestType(dest) === 'directory') {
      src.forEach(function(file) {
        copy(file, dest + file, options);
      });
    } else {
      if (src.length === 1) {
        copy(src[0], dest, options);
      } else {
        grunt.fail.warn('Unable to copy multiple files to the same destination filename, did you forget a trailing slash?');
      }
    }
  });

  var copy = function(src, dest, options) {
    if (fs.statSync(src).isDirectory()) {
      if (!options.excludeEmpty) {
        grunt.verbose.or.write('Creating directory ' + dest.cyan + '...');
        grunt.file.mkdir(dest);
        grunt.verbose.or.ok();
      }
    } else {
      grunt.verbose.or.write('Copying ' + src.cyan + ' to ' + dest.cyan + '...');
      grunt.file.copy(src, dest, {
        process: options.processContent,
        noProcess: options.processContentExclude
      });
      grunt.verbose.or.ok();
    }
  }

  var detectDestType = function(dest) {
    if (grunt.util._.endsWith(dest, path.sep)) {
      return 'directory';
    } else {
      return 'file';
    }
  };
};
