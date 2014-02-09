var grunt = require('grunt');
var fs = require('fs');
var isSymlinksImplemented = require('./isSymlinksImplemented.js')();

exports.copy = {
  main: function(test) {
    'use strict';

    test.expect(3);

    var actual = fs.readdirSync('tmp/copy_test_files').sort();
    var expected = fs.readdirSync('test/expected/copy_test_files').sort();
    test.deepEqual(expected, actual, 'should copy several files');

    actual = fs.readdirSync('tmp/copy_test_mix').sort();
    expected = fs.readdirSync('test/expected/copy_test_mix').sort();
    test.deepEqual(expected, actual, 'should copy a mix of folders and files');

    actual = fs.readdirSync('tmp/copy_test_v0.1.0').sort();
    expected = fs.readdirSync('test/expected/copy_test_v0.1.0').sort();
    test.deepEqual(expected, actual, 'should parse both dest and src templates');

    test.done();
  },

  flatten: function(test) {
    'use strict';

    test.expect(1);

    var actual = fs.readdirSync('tmp/copy_test_flatten').sort();
    var expected = fs.readdirSync('test/expected/copy_test_flatten').sort();
    test.deepEqual(expected, actual, 'should create a flat structure');

    test.done();
  },

  single: function(test) {
    'use strict';

    test.expect(1);

    var actual = grunt.file.read('tmp/single.js');
    var expected = grunt.file.read('test/expected/single.js');
    test.equal(expected, actual, 'should allow for single file copy');

    test.done();
  },

  mode: function(test) {
    'use strict';

    test.expect(1);

    test.equal(fs.lstatSync('tmp/mode.js').mode.toString(8).slice(-3), '444');

    test.done();
  },

  symlink: function(test) {
    'use strict';

    test.expect(1);

    if (isSymlinksImplemented) {
      test.ok(fs.lstatSync('tmp/copy_test_symlink/test2.link.js').isSymbolicLink());
    } else {
      test.ok(true);
    }

    test.done();
  },

  dirlink: function(test) {
    'use strict';

    test.expect(1);

    var actual = fs.readdirSync('tmp/copy_test_dirlink').sort();
    var expected = fs.readdirSync('test/expected/copy_test_dirlink').sort();
    test.deepEqual(expected, actual, 'should copy mix of directories, files and symlinks');

    test.done();
  },
};