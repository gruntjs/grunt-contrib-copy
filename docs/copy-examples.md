# Usage Examples

```js
copy: {
  main: {
    files: [
      {expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile'}, // includes files in path
      {expand: true, src: ['path/**'], dest: 'dest/'}, // includes files in path and its subdirs
      {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'}, // makes all src relative to cwd
      {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'} // flattens results to a single level
    ]
  }
}
```
