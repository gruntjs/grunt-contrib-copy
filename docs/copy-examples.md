# Usage Examples

```js
copy: {
  main: {
    files: [
      // includes files within path
      {expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile'},

      // includes files within path and its sub-directories
      {expand: true, src: ['path/**'], dest: 'dest/'},

      // makes all src relative to cwd
      {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

      // flattens results to a single level
      {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'}
    ]
  }
}
```

This task supports all the file mapping format Grunt supports. Please read [Globbing patterns](http://gruntjs.com/configuring-tasks#globbing-patterns) and [Building the files object dynamically](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically) for additional details.

Here are some additional examples, given the following file tree:
```shell
$ tree -I node_modules
.
├── Gruntfile.js
└── src
    ├── a
    ├── a.link -> a
    └── subdir
        └── b

2 directories, 4 files
```

**Copy a single file tree:**
```js
copy: {
  main: {
    src: 'src/*',
    dest: 'dest/',
  },
},
```

```shell
$ grunt copy
Running "copy:main" (copy) task
Created 1 directories, copied 2 files

Done, without errors.
$ tree -I node_modules
.
├── dest
│   └── src
│       ├── a
│       ├── a.link
│       └── subdir
├── Gruntfile.js
└── src
    ├── a
    ├── a.link -> a
    └── subdir
        └── b

5 directories, 6 files
```

**Flattening the filepath output:**

```js
copy: {
  main: {
    expand: true,
    cwd: 'src/',
    src: '**',
    dest: 'dest/',
    flatten: true,
    filter: 'isFile',
  },
},
```

```shell
$ grunt copy
Running "copy:main" (copy) task
Copied 3 files

Done, without errors.
$ tree -I node_modules
.
├── dest
│   ├── a
│   ├── a.link
│   └── b
├── Gruntfile.js
└── src
    ├── a
    ├── a.link -> a
    └── subdir
        └── b

3 directories, 7 files
```


**Copy and modify a file:**

To change the contents of a file as it is copied, set an `options.process` function as follows:

```js
copy: {
  main: {
    src: 'src/a',
    dest: 'src/a.bak',
    options: {
      process: function (content, srcpath) {
        return content.replace(/[sad ]/g,"_");
      }
    }
  },
},
```

Here all occurences of the letters "s", "a" and "d", as well as all spaces, will be changed to underlines in "a.bak". Of course, you are not limited to just using regex replacements.

To process all files in a directory, the `process` function is used in exactly the same way.

NOTE: If `process` is not working, be aware it was called `processContent` in v0.4.1 and earlier.



**Symlinks:**

By default, the task copies each `src` symlink to `dest` as a regular file with contents equal to that of target of the `src` symlink. The option `copySymlinkAsSymlink` can change this behaviour. If set to `true`, symlinks will be copied as symlinks.

```js
copy: {
  main: {
    options: {
      copySymlinkAsSymlink: true
    },
    expand: true,
    cwd: 'src/',
    src: '**',
    dest: 'dest/',
  },
},
```

```shell
$ grunt copy
Running "copy:main" (copy) task
Created 2 directories, copied 3 files

Done, without errors.
$ tree -I node_modules
.
├── dest
│   ├── a
│   ├── a.link -> a
│   └── subdir
│       └── b
├── Gruntfile.js
└── src
    ├── a
    ├── a.link -> a
    └── subdir
        └── b

4 directories, 7 files
```


### Troubleshooting

By default, if a file or directory is not found it is quietly ignored. If the file should exist, and non-existence generate an error, then add `nonull:true`. For instance, this Gruntfile.js entry:

```js
copy: {
  main: {
    nonull: true,
    src: 'not-there',
    dest: 'create-me',
  },
},
```

gives this output:

```shell
$ grunt copy
Running "copy:main" (copy) task
Warning: Unable to read "not-there" file (Error code: ENOENT). Use --force to continue.

Aborted due to warnings.
```

