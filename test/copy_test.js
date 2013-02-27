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

  copy_if_newer: function(test) {
    'use strict';

    var statSrc = fs.statSync('test/fixtures/test.js');
    grunt.task.run('copy:copy_if_newer_1');

    // mark the new file to be older
    var date = statSrc.mtime;
    date.setHours(date.getHours() + 2);
    fs.utimesSync('tmp/copy_test_newer/test.js', date, date);

    grunt.task.run('copy:copy_if_newer_2');

    test.expect(1);

    var statDest = fs.statSync('tmp/copy_test_newer/test.js');
    var actual = statDest.mtime;
    test.equal(date.getTime(), actual.getTime(), 'should not overwrite a newer file');

    test.done();
  },

  // Not sure about this test -- it will look identical to 'always', without the workload
  copy_if_modified: function(test) {
    'use strict';

    var statSrc = fs.statSync('test/fixtures/test.js');
    grunt.task.run('copy:copy_if_modified_1');

    // mark the new file to be older
    var date = statSrc.mtime;
    date.setHours(date.getHours() + 2);
    fs.utimesSync('tmp/copy_test_modified/test.js', date, date);

    grunt.task.run('copy:copy_if_modified_2');

    test.expect(1);

    var statDest = fs.statSync('tmp/copy_test_modified/test.js');
    var actual = statDest.mtime;
    test.equal(statSrc.mtime.getTime(), actual.getTime(), 'should overwrite modified files, even if newer');

    test.done();
  },


  copy_function: function(test) {
    'use strict';

    grunt.task.run('copy:onlyIf_function');
    test.ok(fs.existsSync('tmp/copy_test_onlyIf_function/test.js'), 'test.js should have copied');
    test.ok(!fs.existsSync('tmp/copy_test_onlyIf_function/test2.js'), 'test2.js should not have copied');

    test.done();
  }



};