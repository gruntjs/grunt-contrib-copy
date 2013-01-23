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


_Version `0.4.x` of this plugin is compatible with Grunt `0.4.x`. Version `0.3.x` of this plugin is compatible with Grunt `0.3.x`._

### Options

#### processContent
Type: `Function`

This option is passed to `grunt.file.copy` as an advanced way to control the file contents that are copied.

#### processContentExclude
Type: `String`

This option is passed to `grunt.file.copy` as an advanced way to control which file contents are processed.

### Usage Examples

```js
copy: {
  main: {
    files: [
      {src: ['path/*'], dest: 'dest/', filter: 'isFile'}, // includes files in path
      {src: ['path/**'], dest: 'dest/'}, // includes files in path and its subdirs
      {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'}, // makes all src relative to cwd
      {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'} // flattens results to a single level
    ]
  }
}
```


## Release History

 * 2013-01-22   v0.4.0rc7   Updating grunt/gruntplugin dependencies to rc7. Changing in-development grunt/gruntplugin dependency versions from tilde version ranges to specific versions.
 * 2013-01-13   v0.4.0rc5   Updating to work with grunt v0.4.0rc5. Conversion to grunt v0.4 conventions. Replace basePath with cwd. Empty directory support.
 * 2012-10-17   v0.3.2   Pass copyOptions on single file copy.
 * 2012-10-11   v0.3.1   Rename grunt-contrib-lib dep to grunt-lib-contrib.
 * 2012-09-23   v0.3.0   General cleanup and consolidation. Global options depreciated.
 * 2012-09-17   v0.2.4   No valid source check.
 * 2012-09-16   v0.2.3   Path.sep fallback for node <= 0.7.9.
 * 2012-09-16   v0.2.2   Single file copy support. Test refactoring.
 * 2012-09-06   v0.2.0   Refactored from grunt-contrib into individual repo.

---

Task submitted by [Chris Talkington](http://christalkington.com/)

*This file was generated on Wed Jan 23 2013 10:40:27.*
