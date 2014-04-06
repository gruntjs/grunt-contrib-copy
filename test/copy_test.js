var grunt = require('grunt');
var fs = require('fs');

exports.copy = {
  main: function(test) {
    'use strict';

    test.expect(3);

    var excludeDotFiles;
    if (process.platform === 'darwin') {
      excludeDotFiles = function (filepath) {
        return filepath[0] !== '.';
      };
    } else {
      excludeDotFiles = function () { return true; }
    }

    var actual = fs.readdirSync('tmp/copy_test_files').sort().filter(excludeDotFiles);
    var expected = fs.readdirSync('test/expected/copy_test_files').sort().filter(excludeDotFiles);
    test.deepEqual(expected, actual, 'should copy several files');

    actual = fs.readdirSync('tmp/copy_test_mix').sort().filter(excludeDotFiles);
    expected = fs.readdirSync('test/expected/copy_test_mix').sort().filter(excludeDotFiles);
    test.deepEqual(expected, actual, 'should copy a mix of folders and files');

    actual = fs.readdirSync('tmp/copy_test_v0.1.0').sort().filter(excludeDotFiles);
    expected = fs.readdirSync('test/expected/copy_test_v0.1.0').sort().filter(excludeDotFiles);
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

  process: function(test) {
    'use strict';

    test.expect(1);

    var actual = grunt.file.read('tmp/copy_test_process/test.js');
    var expected = grunt.file.read('test/expected/process.js');
    test.equal(expected, actual, 'should allow for single file copy');

    test.done();
  }
};