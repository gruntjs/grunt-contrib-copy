# Options

## processContent
Type: `Function(content, srcpath)`

This option is passed to `grunt.file.copy` as an advanced way to control the file contents that are copied.

## processContentExclude
Type: `String`

This option is passed to `grunt.file.copy` as an advanced way to control which file contents are processed.


## forceOverwrite
Type: `Boolean`

This option forces to overwrite files while copying regardless of their existence and attributes in destination.
Particulary it allow to overwrite read-only files (by default copying will fail).
