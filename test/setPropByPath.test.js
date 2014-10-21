'use strict';

var expect = require('chai').expect;

describe('setPropByPath()', function() {
    var setPropByPath = require('../index').setPropByPath,
        source;

    beforeEach(function() {
        source = {
            foo: {
                bar: 'hello'
            },
            baz: 'world'
        };
    });

    it('should set prop by normal path', function() {
        setPropByPath(source, 'baz', 'updated');
        expect(source.baz).to.equal('updated');
    });

    it('should set prop by hierarchy path', function() {
        setPropByPath(source, 'foo.bar', 'updated');
        expect(source.foo.bar).to.equal('updated');
    });

    it('should set obj prop by path', function() {
        setPropByPath(source, 'foo', {
            updated: true
        });
        expect(source.foo).to.deep.equal({
            updated: true
        });
    });

    it('should modify source if target is undfined', function() {
        setPropByPath(source, 'notexists', 'updated');
        setPropByPath(source, 'foo.notexists', 'updated');
        expect(source).to.deep.equal({
            foo: {
                bar: 'hello',
                notexists: 'updated'
            },
            baz: 'world',
            notexists: 'updated'
        });
    });

    it('should do nothing if target\'s parent is not found', function() {
        setPropByPath(source, 'foo.notexists.child', 'updated');
        expect(source).to.deep.equal({
            foo: {
                bar: 'hello'
            },
            baz: 'world'
        });
    });

    it('should do nothing if target\'s parent is not a object', function() {
        setPropByPath(source, 'baz.notexists.child', 'updated');
        expect(source).to.deep.equal(source);
    });
});
