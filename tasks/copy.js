/*
 * grunt-contrib-copy
 * http://gruntjs.com/
 *
 * Copyright (c) 2015 Chris Talkington, contributors
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt-contrib-copy/blob/master/LICENSE-MIT
 */

module.exports = function(grunt) {
  'use strict';

  var path = require('path');
  var fs = require('fs');
  var chalk = require('chalk');
  var crypto = require('crypto');
  var fileSyncCmp = require('file-sync-cmp');

  grunt.registerMultiTask('copy', 'Copy files.', function() {

    var options = this.options({
      encoding: grunt.file.defaultEncoding,
      // processContent/processContentExclude deprecated renamed to process/noProcess
      processContent: false,
      processContentExclude: [],
      timestamp: false,
      mode: false,
    });

    var copyOptions = {
      encoding: options.encoding,
      process: options.process || options.processContent,
      noProcess: options.noProcess || options.processContentExclude,
    };

    var isExpandedPair;
    var dirs = {};
    var tally = {
      dirs: 0,
      files: 0,
    };

    this.files.forEach(function(filePair) {
      var dest = unixifyPath(filePair.dest);
      isExpandedPair = filePair.orig.expand || false;

      filePair.src.forEach(function(src) {
        src = unixifyPath(src);
        var localDest = dest;

        if (detectDestType(localDest) === 'directory') {
          localDest = (isExpandedPair) ? localDest : path.join(localDest, src);
        }

        if (grunt.file.isDir(src)) {
          grunt.verbose.writeln('Creating ' + chalk.cyan(localDest));
          grunt.file.mkdir(localDest);
          if (options.mode !== false) {
            fs.chmodSync(localDest, (options.mode === true) ? fs.lstatSync(src).mode : options.mode);
          }

          if (options.timestamp) {
            dirs[localDest] = src;
          }

          tally.dirs++;
        } else {
          grunt.verbose.writeln('Copying ' + chalk.cyan(src) + ' -> ' + chalk.cyan(localDest));
          grunt.file.copy(src, localDest, copyOptions);
          syncTimestamp(src, localDest);
          if (options.mode !== false) {
            fs.chmodSync(localDest, (options.mode === true) ? fs.lstatSync(src).mode : options.mode);
          }
          tally.files++;
        }
      });
    });

    if (options.timestamp) {
      Object.keys(dirs).sort(function (a, b) {
        return b.length - a.length;
      }).forEach(function (dest) {
        syncTimestamp(dirs[dest], dest);
      });
    }

    if (tally.dirs) {
      grunt.log.write('Created ' + chalk.cyan(tally.dirs.toString()) + (tally.dirs === 1 ? ' directory' : ' directories'));
    }

    if (tally.files) {
      grunt.log.write((tally.dirs ? ', copied ' : 'Copied ') + chalk.cyan(tally.files.toString()) + (tally.files === 1 ? ' file' : ' files'));
    }

    grunt.log.writeln();
  });

  var detectDestType = function(dest) {
    if (grunt.util._.endsWith(dest, '/')) {
      return 'directory';
    } else {
      return 'file';
    }
  };

  var unixifyPath = function(filepath) {
    if (process.platform === 'win32') {
      return filepath.replace(/\\/g, '/');
    } else {
      return filepath;
    }
  };

  var syncTimestamp = function (src, dest) {
    var stat = fs.lstatSync(src);
    if (path.basename(src) !== path.basename(dest)) {
      return;
    }

    if (stat.isFile() && !fileSyncCmp.equalFiles(src, dest)) {
      return;
    }

    fs.utimesSync(dest, stat.atime, stat.mtime);
  };
};
