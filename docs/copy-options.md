# Options

## cwd
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

## excludeEmpty
Type: `Boolean`
Default: false

This option excludes empty folders from being copied to the destination directory.

## flatten
Type: `Boolean`
Default: false

This option performs a flat copy that dumps all the files into the root of the destination directory, overwriting files if they exist.

## processName
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

## processContent
Type: `Function`

This option is passed to `grunt.file.copy` as an advanced way to control the file contents that are copied.

## processContentExclude
Type: `String`

This option is passed to `grunt.file.copy` as an advanced way to control which file contents are processed.

## minimatch
Type: `Object`

These options will be forwarded on to expandFiles, as referenced in the [minimatch options section](https://github.com/isaacs/minimatch/#options)
