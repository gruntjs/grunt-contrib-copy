# Options

## process
Type: `Function(content, srcpath)`

This option is passed to `grunt.file.copy` as an advanced way to control the file contents that are copied.

*`processContent` has been renamed to `process` and the option name will be removed in the future.*

## noProcess
Type: `String`

This option is passed to `grunt.file.copy` as an advanced way to control which file contents are processed.

*`processContentExclude` has been renamed to `noProcess` and the option name will be removed in the future.*

## encoding
Type: `String`  
Default: `grunt.file.defaultEncoding`

The file encoding to copy files with.

## mode
Type: `Boolean` or `Number`  
Default: `false`

Whether to copy or set the existing file permissions. Set to `true` to copy the existing file permissions. Or set to the mode, i.e.: `0644`, that copied files will be set to.

## timestamp
Type: `Boolean`
Default: `false`

Whether to preserve the timestamp attributes(`atime` and `mtime`) when copying files. Set to `true` to preserve files timestamp. But timestamp will *not* be preserved when the file contents or name are changed during copying.
