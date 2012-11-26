# grunt-contrib-copy [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-copy.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-copy)

> Copy files and folders.

_Note that this plugin has not yet been released, and only works with the latest bleeding-edge, in-development version of grunt. See the [When will I be able to use in-development feature 'X'?](https://github.com/gruntjs/grunt/blob/devel/docs/faq.md#when-will-i-be-able-to-use-in-development-feature-x) FAQ entry for more information._

## Getting Started
_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```bash
npm install grunt-contrib-copy --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-contrib-copy');
```

If the plugin has been installed correctly, running `grunt --help` at the command line should list the newly-installed plugin's task or tasks. In addition, the plugin should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html


## The copy task

### Overview

In your project's Gruntfile, add a section named `copy` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  copy: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### files
Type: `Object`

This defines what files this task will copy and should contain key:value pairs.

The key (destination) should be an unique path (supports [grunt.template](https://github.com/gruntjs/grunt/blob/master/docs/api_template.md)) and the value (source) should be a filepath or an array of filepaths (supports [minimatch](https://github.com/isaacs/minimatch)).

As of v0.3.0, when copying to a directory you must add a trailing slash to the destination due to added support of single file copy.

#### options.cwd
Type: `String`

This option sets the current working directory for use with the minimatch and copy process. This helps translate paths when copied so that the destination stucture matches the source structure exactly. Without a `cwd` set, all paths are relative to the gruntfile directory which can cause extra depth to be added to your copied structure when it may not be desired.

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

#### options.basePath

As of v0.4, this option has been removed in favor of `cwd` which fits the copy process so much better.

#### options.flatten
Type: `Boolean`
Default: false

This option performs a flat copy that dumps all the files into the root of the destination directory, overwriting files if they exist.

#### options.processName
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

#### options.processContent
Type: `Function`

This option is passed to `grunt.file.copy` as an advanced way to control the file contents that are copied.

#### options.processContentExclude
Type: `String`

This option is passed to `grunt.file.copy` as an advanced way to control which file contents are processed.

#### options.minimatch
Type: `Object`

These options will be forwarded on to expandFiles, as referenced in the [minimatch options section](https://github.com/isaacs/minimatch/#options)
### Examples

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

 * 2012-11-21 - v0.4.0 - Conversion to grunt v0.4 conventions. Replace basePath with cwd which is much smarter and understandable.
 * 2012-10-17 - v0.3.2 - Pass copyOptions on single file copy
 * 2012-10-11 - v0.3.1 - Rename grunt-contrib-lib dep to grunt-lib-contrib.
 * 2012-09-23 - v0.3.0 - General cleanup and consolidation. Global options depreciated.
 * 2012-09-17 - v0.2.4 - No valid source check.
 * 2012-09-16 - v0.2.3 - Path.sep fallback for node <= 0.7.9.
 * 2012-09-16 - v0.2.2 - Single file copy support. Test refactoring.
 * 2012-09-06 - v0.2.0 - Refactored from grunt-contrib into individual repo.

--
Task submitted by <a href="http://christalkington.com/">Chris Talkington</a>.

*Generated on Wed Nov 21 2012 00:51:53.*
