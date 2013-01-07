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

  /*
   src and dest are complete paths to the source and destination files
   copyOptions are the options to the grunt.file copy command
   onlyIf - 'always'|'newer'|'missing'|'modified'|
   */
  var doCopy = function(src, dest, onlyIf, copyOptions) {
     var okToCopy = true;

     var statSrc = fs.statSync(src);
     var statDest = fs.statSync(dest);

     if (statDest !== null) {
         var theType = toString.call(onlyIf);
         if (theType == '[object String]') {
             if (onlyIf !== 'always') {
                 if (onlyIf === 'missing') {
                     okToCopy = false;
                 }
                 else {
                     if (onlyIf === 'newer') {
                         if (statSrc.mtime.getTime() <= statDest.mtime.getTime()) okToCopy = false;
                     }
                     else if (onlyIf === 'modified') {
                         if (statSrc.mtime.getTime() == statDest.mtime.getTime()) {
                             okToCopy = false;
                         }
                     }
                     else {
                         grunt.warn('copy: onlyIf should be set to always|newer|missing|modified or '+
                             'a function, assuming "always"'.yellow);
                     }
                 }
             }
         }
         else if (theType == '[object Function]') {
             okToCopy = onlyIf(src, dest, statSrc, statDest);
         }
     }

     if (okToCopy) {
         grunt.verbose.or.write('Copying file' + src.cyan + ' to ' + dest.cyan + '...');
         grunt.file.copy(src, dest, copyOptions);
         fs.utimes(dest, statSrc.atime, statSrc.mtime);
     }
  }


  grunt.registerMultiTask('copy', 'Copy files.', function() {
    var kindOf = grunt.util.kindOf;
    var helpers = require('grunt-lib-contrib').init(grunt);

    var options = helpers.options(this, {
      cwd: '',
      excludeEmpty: false,
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

    var srcDirs = grunt.file.expandDirs(options.minimatch, this.file.srcRaw);
    var srcFiles = grunt.file.expandFiles(options.minimatch, this.file.srcRaw);

    if (srcFiles.length === 0 && options.excludeEmpty) {
      grunt.fail.warn('Unable to copy; no valid sources were found.');
    }

    var srcFile;

    var destType = detectDestType(dest);

    if (destType === 'file') {
      if (srcFiles.length === 1) {
        srcFile = path.join(options.cwd, srcFiles[0]);

        grunt.verbose.or.write('Copying file' + ' to ' + dest.cyan + '...');
        doCopy(srcFile, destFile, options.onlyIf, copyOptions);

        grunt.verbose.or.ok();
      } else {
        grunt.fail.warn('Unable to copy multiple files to the same destination filename, did you forget a trailing slash?');
      }
    } else if (destType === 'directory') {
      var destDir;
      var destFile;

      if (options.flatten === false && options.excludeEmpty === false && srcDirs.length > 0) {
        grunt.verbose.or.write('Creating directories' + ' in ' + dest.cyan + '...');

        srcDirs.forEach(function(dir) {
          destDir = path.join(dest, dir);

          grunt.file.mkdir(destDir);
        });

        grunt.verbose.or.ok();
      }

      grunt.verbose.or.write('Copying files' + ' to ' + dest.cyan + '...');

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
        doCopy(srcFile, destFile, options.onlyIf, copyOptions);
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