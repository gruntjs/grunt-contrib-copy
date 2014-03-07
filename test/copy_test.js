var grunt = require('grunt');
var fs = require('fs');

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

  symlink: function(test) {
    'use strict';

    test.expect(4);

    // Check content
    var actual = grunt.file.read('tmp/copy_test_links/test_link.js');
    var expected = grunt.file.read('test/expected/copy_test_links/test_link.js');
    test.equal(expected, actual, 'should allow for single copy symlink');

    // Check symlink type
    var isLink = grunt.file.isLink('tmp/copy_test_links/test_link.js');
    test.equal(isLink, true, 'should allow for a hard link copy');

    // Check content
    var actualDir = fs.readlink('tmp/copy_test_links/empty_folder_link');
    var expectedDir = fs.readlink('test/expected/copy_test_links/empty_folder_link');
    test.deepEqual(expectedDir, actualDir, 'should allow for single copy symlink');

    // Check symlink type
    var isLinkDir = grunt.file.isLink('tmp/copy_test_links/empty_folder_link');
    test.equal(isLinkDir, true, 'should allow for a hard link copy');

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
  }
};