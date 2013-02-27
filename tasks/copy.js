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
  var async = require('async');

  /*
   src and dest are complete paths to the source and destination files
   copyOptions are the options to the grunt.file copy command
   onlyIf - 'always'|'newer'|'missing'|'modified'|
   */
  var doCopy = function(src, dest, onlyIf, copyOptions, callback) {
     var okToCopy = true;
     if (onlyIf == null) { onlyIf = 'always'; }
     fs.stat(src,
        function(err, statSrc) {
            if (err === null) {
                fs.stat(dest,
                    function(err, statDest) {
                        var theType = Object.prototype.toString.call(onlyIf);
                        if (theType === '[object Function]') {
                                okToCopy = onlyIf(src, dest, statSrc, statDest);
                        }
                        else if (err === null) {
                             if (theType === '[object String') {
                                 if (onlyIf !== 'always') {
                                     if (onlyIf === 'missing') {
                                         okToCopy = false;
                                     }
                                     else {
                                         if (onlyIf === 'newer') {
                                             if (statSrc.mtime.getTime() <= statDest.mtime.getTime()) {
                                                 okToCopy = false;
                                             }
                                         }
                                         else if (onlyIf === 'modified') {
                                             if (statSrc.mtime.getTime() === statDest.mtime.getTime()) {
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
                        }

                        if (okToCopy) {
                            grunt.file.copy(src, dest, copyOptions);
                            fs.utimes(dest, statSrc.atime, statSrc.mtime, function(){ callback(null); });
                        }
                        else
                        {
                            callback(null);
                        }
                    }
                );
            }
            else {
                callback(err);
            }
        }
     );
  };

  grunt.registerMultiTask('copy', 'Copy files.', function() {
    var done = this.async();

    var kindOf = grunt.util.kindOf;

    var options = this.options({
      processContent: false,
      processContentExclude: []
    });

    var copyOptions = {
      process: options.processContent,
      noProcess: options.processContentExclude
    };

    grunt.verbose.writeflags(options, 'Options');

    var dest;
    var isExpandedPair;

    async.each(this.files, function(filePair, callback) {
      isExpandedPair = filePair.orig.expand || false;

      async.each(filePair.src, function(src, callback) {
            if (detectDestType(filePair.dest) === 'directory') {
              dest = (isExpandedPair) ? filePair.dest : unixifyPath(path.join(filePair.dest, src));
            } else {
              dest = filePair.dest;
            }

            if (grunt.file.isDir(src)) {
              grunt.log.writeln('Creating ' + dest.cyan);
              grunt.file.mkdir(dest);
              callback(null);
            } else {
              doCopy(src, dest, filePair.onlyIf, copyOptions, callback);
            }
          }, callback(null));
    }, function(){ done(); });
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