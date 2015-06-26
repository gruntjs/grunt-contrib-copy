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

  single: function(test) {
    'use strict';

    test.expect(1);

    var actual = grunt.file.read('tmp/single.js');
    var expected = grunt.file.read('test/expected/single.js');
    test.equal(expected, actual, 'should allow for single file copy');

    test.done();
  },

  multiple: function(test) {
    'use strict';

    test.expect(2);

    var actual = grunt.file.read('tmp/copy_test_multiple/test/fixtures/test.js');
    var expected = grunt.file.read('test/fixtures/test.js');
    test.equal(expected, actual);

    actual = grunt.file.read('tmp/copy_test_multiple/test/fixtures/test2.js');
    expected = grunt.file.read('test/fixtures/test2.js');
    test.equal(expected, actual);

    test.done();
  },

  mode: function(test) {
    'use strict';

    test.expect(1);

    test.equal(fs.lstatSync('tmp/mode.js').mode.toString(8).slice(-3), '444');

    test.done();
  },

  modeDir: function(test) {
    'use strict';
    test.expect(2);
    test.equal(fs.lstatSync('tmp/copy_test_modeDir/time_folder').mode.toString(8).slice(-3), '777');
    test.equal(fs.lstatSync('tmp/copy_test_modeDir/time_folder/sub_folder').mode.toString(8).slice(-3), '777');
    test.done();
  },

  process: function(test) {
    'use strict';

    test.expect(2);
    test.equal(fs.lstatSync('tmp/process/beep.wav').size, fs.lstatSync('test/fixtures/beep.wav').size);
    test.notEqual(fs.lstatSync('tmp/process/test2.js').size, fs.lstatSync('test/fixtures/test2.js').size);

    test.done();
  },
  timestamp: function(test) {
    'use strict';

    test.expect(4);

    test.equal(fs.lstatSync('tmp/copy_test_timestamp/sub_folder').mtime.getTime(), fs.lstatSync('test/fixtures/time_folder/sub_folder').mtime.getTime());
    test.equal(fs.lstatSync('tmp/copy_test_timestamp/test.js').mtime.getTime(), fs.lstatSync('test/fixtures/time_folder/test.js').mtime.getTime());
    test.notEqual(fs.lstatSync('tmp/copy_test_timestamp/test1.js').mtime.getTime(), fs.lstatSync('test/fixtures/time_folder/test.js').mtime.getTime());
    test.notEqual(fs.lstatSync('tmp/copy_test_timestamp/test_process.js').mtime.getTime(), fs.lstatSync('test/fixtures/time_folder/test_process.js').mtime.getTime());

    test.done();
  }
};
