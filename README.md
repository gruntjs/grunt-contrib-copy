# grunt-contrib-copy [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-copy.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-copy)

> Copy files and folders.


## Getting Started
If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide, as it explains how to create a [gruntfile][Getting Started] as well as install and use grunt plugins. Once you're familiar with that process, install this plugin with this command:

```shell
npm install grunt-contrib-copy --save-dev
```

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md


## Copy task
_Run this task with the `grunt copy` command._

_This task is a [multi task][] so any targets, files and options should be specified according to the [multi task][] documentation._
[multi task]: https://github.com/gruntjs/grunt/wiki/Configuring-tasks

This task will preserve the modification timestamp of the original file.


### Options

#### cwd
Type: `String`

This option sets the current working directory for use with the minimatch and copy process. This helps translate paths when copied so that the destination stucture matches the source structure exactly. Without a `cwd` set, all paths are relative to the gruntfile directory which can cause extra depth to be added to your copied structure when it may not be desired.

When copying to a directory you must add a trailing slash to the destination due to added support of single file copy.

```js
copy: {
  target: {
    options: {
      cwd: 'path/to/sources'
    },
    files: {
      'tmp/test/': ['*', 'sub1/*']
    }
  }
}
```

#### excludeEmpty
Type: `Boolean`
Default: false

This option excludes empty folders from being copied to the destination directory.

#### flatten
Type: `Boolean`
Default: false

This option performs a flat copy that dumps all the files into the root of the destination directory, overwriting files if they exist.

#### processName
Type: `Function`

This option accepts a function that adjusts the filename of the copied file. Function is passed filename and should return a string.

```js
options: {
  processName: function(filename) {
    if (filename == "test.jpg") {
      filename = "newname.jpg";
    }
    return filename;
  }
}
```

#### processContent
Type: `Function`

This option is passed to `grunt.file.copy` as an advanced way to control the file contents that are copied.

#### processContentExclude
Type: `String`

This option is passed to `grunt.file.copy` as an advanced way to control which file contents are processed.

#### onlyIf
Type: `String` | `Function` Default 'always'

Controls whether or not the file will be copied.

If `onlyIf` is a function, is should have the signature: `fn(srcPath, destPath, srcStat, destStat)`
and it should return `true` if the file is to be copied, `false` otherwise.

If `onlyIf` is a string, then it must be one of:
* **always** -- the source will always be copied to the destination
* **newer** -- the source will only be copied if it is newer than the destination
* **modified** -- the source will be copied if its timestamp is different than that of the destination
* **missing** -- the source will only be copied if there is no destination file

#### minimatch
Type: `Object`

These options will be forwarded on to expandFiles, as referenced in the [minimatch options section](https://github.com/isaacs/minimatch/#options)


### Usage Examples

```js
copy: {
  dist: {
    files: {
      "path/to/directory/": "path/to/source/*", // includes files in dir
      "path/to/directory/": "path/to/source/**", // includes files in dir and subdirs
      "path/to/project-<%= pkg.version %>/": "path/to/source/**", // variables in destination
      "path/to/directory/": ["path/to/sources/*.js", "path/to/more/*.js"], // include JS files in two diff dirs
      "path/to/filename.ext": "path/to/source.ext"
    }
  }
}
```


## Release History

 * 2012-11-29   v0.4.0   Conversion to grunt v0.4 conventions. Replace basePath with cwd. Empty directory support.
 * 2012-10-17   v0.3.2   Pass copyOptions on single file copy.
 * 2012-10-11   v0.3.1   Rename grunt-contrib-lib dep to grunt-lib-contrib.
 * 2012-09-23   v0.3.0   General cleanup and consolidation. Global options depreciated.
 * 2012-09-17   v0.2.4   No valid source check.
 * 2012-09-16   v0.2.3   Path.sep fallback for node <= 0.7.9.
 * 2012-09-16   v0.2.2   Single file copy support. Test refactoring.
 * 2012-09-06   v0.2.0   Refactored from grunt-contrib into individual repo.

---

Task submitted by [Chris Talkington](http://christalkington.com/)

*This file was generated on Thu Nov 29 2012 20:23:02.*
