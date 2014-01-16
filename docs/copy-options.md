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

#### copySymlinkAsSymlink
Type: `Boolean`  
Default: `false`

If set to true, symlinks will be copied as symlinks, not regular files. Target in a `dest` symlink is copied from `src` symlink 'as is', i.e. absolute links remain absolute and relative links remain relative.

If set to false, `dest` file will contain data from the `src` symlink's target.