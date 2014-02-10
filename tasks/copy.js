/*
 * grunt-contrib-copy
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 Chris Talkington, contributors
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt-contrib-copy/blob/master/LICENSE-MIT
 */

module.exports = function(grunt) {
  'use strict';

  var path = require('path');
  var fs = require('fs');
  var chalk = require('chalk');

  grunt.registerMultiTask('copy', 'Copy files.', function() {
    var kindOf = grunt.util.kindOf;

    var options = this.options({
      encoding: grunt.file.defaultEncoding,
      // processContent/processContentExclude deprecated renamed to process/noProcess
      processContent: false,
      processContentExclude: [],
      mode: false,
      copySymlinkAsSymlink: false
    });

    var copyOptions = {
      encoding: options.encoding,
      process: options.process || options.processContent,
      noProcess: options.noProcess || options.processContentExclude,
    };

    var dest;
    var isExpandedPair;
    var srcStat;
    var fileMode;
    var isLink;
    var copiedDirLinks = [];
    var tally = {
      dirs: 0,
      files: 0
    };
    var symlinksNotImplementedCode = 35;

    this.files.forEach(function(filePair) {
      isExpandedPair = filePair.orig.expand || false;

      filePair.src.forEach(function(src) {
        var skip = false;
        if (copiedDirLinks.length) {
          for (var i in copiedDirLinks) {
            if (copiedDirLinks[i].test(src)) {
              skip = true;
              break;
            }
          }
        }
        if (skip) {
          return;
        }

        if (detectDestType(filePair.dest) === 'directory') {
          dest = (isExpandedPair) ? filePair.dest : unixifyPath(path.join(filePair.dest, src));
        } else {
          dest = filePair.dest;
        }

        srcStat = fs.lstatSync(src);
        isLink = srcStat.isSymbolicLink();
        if (grunt.file.isDir(src)) {
          grunt.verbose.writeln('Creating ' + chalk.cyan(dest));
          if (options.copySymlinkAsSymlink && isLink) {
            try {
              fs.symlinkSync(fs.readlinkSync(src), dest);
              copiedDirLinks.push(new RegExp('^' + src.replace(/\/*$/,'/').replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")));
            } catch(e) {
              if (e.errno === symlinksNotImplementedCode) {
                grunt.file.mkdir(dest);
              }else{
                throw e;
              }
            }
          } else {
            grunt.file.mkdir(dest);
          }
          tally.dirs++;
        } else {
          grunt.verbose.writeln('Copying ' + chalk.cyan(src) + ' -> ' + chalk.cyan(dest));
          if (options.copySymlinkAsSymlink && isLink) {
            try {
              grunt.file.mkdir(path.dirname(dest));
              if (grunt.file.exists(dest)) {
                grunt.file.delete(dest);
              }
              fs.symlinkSync(fs.readlinkSync(src), dest);
            } catch(e) {
              if (e.errno === symlinksNotImplementedCode) {
                grunt.file.copy(src, dest, copyOptions);
              }else{
                throw e;
              }
            }
          } else {
            grunt.file.copy(src, dest, copyOptions);
          }
          if (options.mode !== false && !(options.copySymlinkAsSymlink && isLink)) {
            fs.chmodSync(dest, (options.mode === true) ? srcStat.mode : options.mode);
          }
          tally.files++;
        }
      });
    });

    if (tally.dirs) {
      grunt.log.write('Created ' + chalk.cyan(tally.dirs.toString()) + ' directories');
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
};