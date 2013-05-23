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

    var options = this.options({
      processContent: false,
      processContentExclude: [],
      hardLink: false
    });

    var copyOptions = {
      process: options.processContent,
      noProcess: options.processContentExclude
    };

    grunt.verbose.writeflags(options, 'Options');

    var dest;
    var isExpandedPair;
    var tally = {
      dirs: 0,
      files: 0,
      links: 0
    };

    if (options.hardLink && process.platform == "win32") {
      grunt.verbose.writeln('Cannot hardLink on Windows; copying instead.');
      options.hardLink = false;
    }

    this.files.forEach(function(filePair) {
      isExpandedPair = filePair.orig.expand || false;

      filePair.src.forEach(function(src) {
        if (detectDestType(filePair.dest) === 'directory') {
          dest = (isExpandedPair) ? filePair.dest : unixifyPath(path.join(filePair.dest, src));
        } else {
          dest = filePair.dest;
        }

        if (grunt.file.isDir(src)) {
          grunt.verbose.writeln('Creating ' + dest.cyan);
          grunt.file.mkdir(dest);
          tally.dirs++;
        } else {
          var hardLink = options.hardLink;
          if (hardLink) {
            if (copyOptions.process &&
                ((! copyOptions.noProcess) ||
                 (! grunt.file.match(copyOptions.noProcess, [src])))) {
              hardLink = false;
            }
          }
          if (hardLink) {
            if (fs.existsSync(dest)) {
              grunt.verbose.writeln('Removing ' + dest.cyan);
              fs.unlinkSync(dest);
            }
            grunt.verbose.writeln('Hard linking ' + src.cyan + ' -> ' + dest.cyan);
            fs.linkSync(src, dest);
            tally.links++;
          } else {
            grunt.verbose.writeln('Copying ' + src.cyan + ' -> ' + dest.cyan);
            grunt.file.copy(src, dest, copyOptions);
            tally.files++;
          }
        }
      });
    });

    if (tally.dirs) {
      grunt.log.write('Created ' + tally.dirs.toString().cyan + ' directories');
    }

    if (tally.links) {
      grunt.log.write((tally.dirs ? ', linked ' : 'Linked ') + tally.links.toString().cyan + ' files');
    }

    if (tally.files) {
      grunt.log.write((tally.dirs || tally.links ? ', copied ' : 'Copied ') + tally.files.toString().cyan + ' files');
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
