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

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  var path = require('path');
  var _ = grunt.util._;

  grunt.registerMultiTask('copy', 'Copy files.', function() {

    var kindOf = grunt.util.kindOf;
    var helpers = require('grunt-contrib-lib').init(grunt);

    var options = helpers.options(this, {
      basePath: false,
      flatten: false,
      processName: false,
      processContent: false,
      processContentExclude: [],
      minimatch: {}
    });

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

    var copyOptions = {
      process: options.processContent,
      noProcess: options.processContentExclude
    };

    if (options.basePath) {
      options.basePath = path.normalize(options.basePath);
      options.basePath = _(options.basePath).trim(path.sep);
    }

    grunt.verbose.writeflags(options, 'Options');

    var srcFiles;
    var destType;

    var basePath;
    var filename;
    var relative;
    var destFile;
    var srcFile;

    this.files.forEach(function(file) {
      file.dest = path.normalize(file.dest);
      srcFiles = grunt.file.expandFiles(options.minimatch, file.src);

      basePath = options.basePath || findBasePath(srcFiles);
      destType = detectDestType(file.dest);

      if (destType === 'file') {
        if (srcFiles.length === 1) {
          srcFile = path.normalize(srcFiles[0]);

          grunt.verbose.or.write('Copying file' + ' to ' + file.dest + '...');
          grunt.file.copy(srcFile, file.dest);

          grunt.verbose.or.ok();
        } else {
          grunt.fail.warn('Unable to copy multiple files to the same destination filename, did you forget a trailing slash?');
        }
      } else if (destType === 'dir') {
        grunt.verbose.writeln('Base Path: ' + basePath.cyan);
        grunt.verbose.or.write('Copying files' + ' to ' + file.dest + '...');

        srcFiles.forEach(function(srcFile) {
          srcFile = path.normalize(srcFile);
          filename = path.basename(srcFile);
          relative = path.dirname(srcFile);

          if (options.flatten) {
            relative = '';
          } else if (basePath && basePath.length > 1) {
            relative = _(relative).chain().strRight(basePath).trim(path.sep).value();
          }

          if (options.processName && kindOf(options.processName) === 'function') {
            filename = options.processName(filename);
          }

          // make paths outside grunts working dir relative
          relative = relative.replace(/\.\.(\/|\\)/g, '');

          destFile = path.join(file.dest, relative, filename);

          grunt.file.copy(srcFile, destFile, copyOptions);
        });

        grunt.verbose.or.ok();
      }
    });
  });

  var findBasePath = function(srcFiles) {
    var basePaths = [];
    var dirName;

    srcFiles.forEach(function(srcFile) {
      dirName = path.dirname(srcFile);
      dirName = path.normalize(dirName);

      basePaths.push(dirName.split(path.sep));
    });

    basePaths = _.intersection.apply([], basePaths);

    return path.join.apply(path, basePaths);
  };

  var detectDestType = function(dest) {
    if (_.endsWith(dest, path.sep)) {
      return 'dir';
    } else {
      return 'file';
    }
  };
};