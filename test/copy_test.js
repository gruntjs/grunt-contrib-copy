var grunt = require('grunt');
var fs = require('fs');

exports['copy'] = {
  main: function(test) {
    'use strict';

    var expect, result;

    test.expect(4);

    expect = ['test.css', 'test.js'].sort();
    result = fs.readdirSync('tmp/copy_test_files').sort();
    test.deepEqual(expect, result, 'should copy several files');

    expect = ['folder_one', 'folder_two', 'test.css', 'test.js'].sort();
    result = fs.readdirSync('tmp/copy_test_v0.1.0').sort();
    test.deepEqual(expect, result, 'should copy several folders and files (with template support)');

    expect = ['one.css', 'one.js', 'test.css', 'test.js', 'two.css', 'two.js'].sort();
    result = fs.readdirSync('tmp/copy_test_flatten').sort();
    test.deepEqual(expect, result, 'should create a flat structure');

    expect = ['.hidden', 'test.css', 'test.js'].sort();
    result = fs.readdirSync('tmp/copy_minimatch').sort();
    test.deepEqual(expect, result, 'should allow for minimatch dot option');

    test.done();
  }
};