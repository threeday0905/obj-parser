'use strict';

var expect = require('chai').expect;

describe('getPropByPath()', function() {
    var getPropByPath = require('../index').getPropByPath;

    var source = {
            foo: {
                bar: 'hello'
            },
            baz: 'world'
        };

    it('should get prop by normal path', function() {
        var result = getPropByPath(source, 'baz');
        expect(result).to.equal('world');
    });

    it('should get prop by hierarchy path', function() {
        var result = getPropByPath(source, 'foo.bar');
        expect(result).to.equal('hello');
    });

    it('should get obj prop by path', function() {
        var result = getPropByPath(source, 'foo');
        expect(result).to.deep.equal(source.foo);
    });

    it('should return undefined if path is not found', function() {
        var result1 = getPropByPath(source, 'notexists'),
            result2 = getPropByPath(source, 'foo.notexists'),
            result3 = getPropByPath(source, 'foo.notexists.child');

        expect(result1).to.equal(undefined);
        expect(result2).to.equal(undefined);
        expect(result3).to.equal(undefined);
    });
});
