var grunt = require('grunt');
var fs = require('fs');

exports['copy'] = {
  main: function(test) {
    'use strict';

    var expected, actual;

    test.expect(5);

    expected = fs.readdirSync('test/expected/copy_test_files').sort();
    actual = fs.readdirSync('tmp/copy_test_files').sort();
    test.deepEqual(expected, actual, 'should copy several files');

    expected = fs.readdirSync('test/expected/copy_test_v0.1.0').sort();
    actual = fs.readdirSync('tmp/copy_test_v0.1.0').sort();
    test.deepEqual(expected, actual, 'should copy several folders and files (with template support)');

    expected = fs.readdirSync('test/expected/copy_test_flatten').sort();
    actual = fs.readdirSync('tmp/copy_test_flatten').sort();
    test.deepEqual(expected, actual, 'should create a flat structure');

    expected = fs.readdirSync('test/expected/copy_minimatch').sort();
    actual = fs.readdirSync('tmp/copy_minimatch').sort();
    test.deepEqual(expected, actual, 'should allow for minimatch dot option');

    expected = grunt.file.read('test/expected/single.js');
    actual = grunt.file.read('tmp/single.js');
    test.equal(expected, actual, 'should allow for single file copy');

    test.done();
  }
};