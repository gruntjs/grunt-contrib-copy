/*
 * grunt-contrib-copy
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 Chris Talkington, contributors
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt-contrib-copy/blob/master/LICENSE-MIT
 */

module.exports = function(grunt) {
  'use strict';


  // store original values in private variable.
  var originalConfig;
  var configKey;

  grunt.registerTask('diffCopy', 'Copy only if changed.', function() {
    var taskChain = grunt.util._.first(this.args);
    var files = checkCopies(taskChain);

    if( !taskChain ) {
      grunt.task.run(grunt.util._.map(grunt.util._.keys(grunt.config('copy')), function(target) {
        return 'diffCopy:'+target;
      }));
      return;
    }

    configKey = 'copy.'+taskChain+'.files';
    originalConfig = grunt.config(configKey);


    if( files && files.length ) {
      grunt.config(configKey, files);
      grunt.task.run('copy:'+taskChain);
      grunt.task.run('diffCopy:__postrun');
    } else {
      grunt.log.warn('No files changed; copy:%s not run.', taskChain);
    }

  });

  // reset config to original values.
  grunt.registerTask('diffCopy:__postrun', function() {
    grunt.config(configKey, originalConfig);
  });

  function checkCopies(target) {
    var confPath = grunt.util._.compact(['copy', target]).join('.');
    grunt.config.requires(confPath);
    var conf = grunt.config(confPath);

    var srcDestPairs = conf && grunt.task.normalizeMultiTaskFiles(conf);

    function compare(src, dest) {
      var newer = grunt.file.read(src);
      var older = grunt.file.read(dest);

      var test = (newer !== older);

      return test;
    }


    srcDestPairs = grunt.util._.filter(srcDestPairs, function(pair) {
      var src = pair && pair.src && grunt.util._.first(pair.src);
      var dest = pair && pair.dest;

      var srcIsFile = src && grunt.file.isFile(src);
      var srcIsDir = src && grunt.file.isDir(src);
      var srcExists = src && grunt.file.exists(src);

      var srcIsRootDir = false;

      var wildCardRegex = /\/[\*]{1,2}$/;

      if ( srcIsDir && pair.orig && pair.orig.expand ) {
        if( src === pair.orig.cwd ) {
          srcIsRootDir = true;
        } else if ( src === grunt.util._.first(pair.orig.src).replace(wildCardRegex, '')) {
          srcIsRootDir = true; 
        }
      }

      if ( srcIsRootDir ) {
        srcExists = false;
      }

      var destIsFile = dest && grunt.file.isFile(dest);
      var destExists = dest && grunt.file.exists(dest);

      var bothFiles = srcIsFile && destIsFile;
      var srcIsFresh = srcExists && !destExists;

      if( bothFiles ) {
        return compare(src, dest);
      } else if ( srcIsFresh ) {
        return true;
      }
    });

    if( srcDestPairs.length > 0 ) {
      grunt.log.ok('Changed files: %s', grunt.util._.pluck(srcDestPairs, 'dest').join(' '));
    }

    return srcDestPairs;

  }
};
