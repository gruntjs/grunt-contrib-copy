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

  grunt.registerMultiTask('copy', 'Copy files.', function() {

    var _ = grunt.util._;
    var kindOf = grunt.util.kindOf;
    var path = require('path');
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

    var basePath;
    var filename;
    var relative;
    var destFile;

    this.files.forEach(function(file) {
      file.dest = path.normalize(file.dest);
      srcFiles = grunt.file.expandFiles(options.minimatch, file.src);

      basePath = options.basePath || findBasePath(srcFiles);

      grunt.verbose.writeln('Base Path: ' + basePath.cyan);
      grunt.verbose.or.write('Copying file(s)' + ' to ' + file.dest + '...');

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
};