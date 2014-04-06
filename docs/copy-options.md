# Options

## process
Type: `Function(content, srcpath, destpath)`

The source file contents, source file path, and destination file path are passed into this function, whose return value will be used as the destination file's contents. If this function returns `false`, the file copy will be aborted.

*`processContent` has been renamed to `process` and the option name will be removed in the future.*

## noProcess
Type: `String`

These optional globbing patterns will be matched against the filepath (not the filename) using grunt.file.isMatch. If any specified globbing pattern matches, the file won't be processed via the `process` function. If `true` is specified, processing will be prevented.

*`processContentExclude` has been renamed to `noProcess` and the option name will be removed in the future.*

## encoding
Type: `String`  
Default: `grunt.file.defaultEncoding`

The file encoding to copy files with.

## mode
Type: `Boolean` or `Number`  
Default: `false`

Whether to copy or set the existing file permissions. Set to `true` to copy the existing file permissions. Or set to the mode, i.e.: `0644`, that copied files will be set to.
