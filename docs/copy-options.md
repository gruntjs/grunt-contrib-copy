# Options

## files
Type: `Object`

This defines what files this task will copy and should contain key:value pairs.

The key (destination) should be an unique path (supports [grunt.template](https://github.com/gruntjs/grunt/blob/master/docs/api_template.md)) and the value (source) should be a filepath or an array of filepaths (supports [minimatch](https://github.com/isaacs/minimatch)).

As of v0.3.0, when copying to a directory you must add a trailing slash to the destination due to added support of single file copy.

## options.basePath
Type: `String`

This option adjusts the folder structure when copied to the destination directory. When not explicitly set, best effort is made to locate the basePath by comparing all source filepaths left to right for a common pattern.

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