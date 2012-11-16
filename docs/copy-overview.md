# Overview

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

### Recent Confusion

Many expect this task to work like `cp` on *nix systems but it was designed to use grunt conventions including the use of minimatch regex. We are working hard to make this and other tasks suitable for advanced users but there are no current plans to emulate `cp`.