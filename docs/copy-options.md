# Options

## files
Type: `Object`

This defines what files this task will copy and should contain key:value pairs.

The key (destination) should be an unique path (supports [grunt.template](https://github.com/gruntjs/grunt/blob/master/docs/api_template.md)) and the value (source) should be a filepath or an array of filepaths (supports [minimatch](https://github.com/isaacs/minimatch)).

As of v0.3.0, when copying to a directory you must add a trailing slash to the destination due to added support of single file copy.

## options.cwd
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

## options.basePath

As of v0.4, this option has been removed in favor of `cwd` which fits the copy process so much better.

## options.flatten
Type: `Boolean`
Default: false

This option performs a flat copy that dumps all the files into the root of the destination directory, overwriting files if they exist.

## options.processName
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

## options.processContent
Type: `Function`

This option is passed to `grunt.file.copy` as an advanced way to control the file contents that are copied.

## options.processContentExclude
Type: `String`

This option is passed to `grunt.file.copy` as an advanced way to control which file contents are processed.

## options.minimatch
Type: `Object`

These options will be forwarded on to expandFiles, as referenced in the [minimatch options section](https://github.com/isaacs/minimatch/#options)