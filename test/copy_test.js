var grunt = require('grunt');
var fs = require('fs');

exports['copy'] = {
  main: function(test) {
    'use strict';

    var expect, result;

    test.expect(5);

    expect = fs.readdirSync('test/expected/copy_test_files').sort();
    result = fs.readdirSync('tmp/copy_test_files').sort();
    test.deepEqual(expect, result, 'should copy several files');

    expect = fs.readdirSync('test/expected/copy_test_v0.1.0').sort();
    result = fs.readdirSync('tmp/copy_test_v0.1.0').sort();
    test.deepEqual(expect, result, 'should copy several folders and files (with template support)');

    expect = fs.readdirSync('test/expected/copy_test_flatten').sort();
    result = fs.readdirSync('tmp/copy_test_flatten').sort();
    test.deepEqual(expect, result, 'should create a flat structure');

    expect = fs.readdirSync('test/expected/copy_minimatch').sort();
    result = fs.readdirSync('tmp/copy_minimatch').sort();
    test.deepEqual(expect, result, 'should allow for minimatch dot option');

    expect = grunt.file.read('test/expected/single.js');
    result = grunt.file.read('tmp/single.js');
    test.equal(expect, result, 'should allow for single file copy');

    test.done();
  }
};