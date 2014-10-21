'use strict';

var expect = require('chai').expect;

describe('replaceAllMatchProps()', function() {
    var replaceAllMatchProps = require('../index').replaceAllMatchProps,
        source;

    beforeEach(function() {
        source = {
            foo: 1,
            bar: '1',
            second: {
                foo: 1,
                bar: '1'
            }
        };
    });

    it('should directly return if source is not object', function() {
        var result = replaceAllMatchProps('string');
        expect(result).to.equal('string');
    });

    it('should exec replace fn if value is matched', function() {
        replaceAllMatchProps(source, function(value) {
            return typeof value === 'number';
        }, function(val, key) {
            /* jshint unused:false */
            return 'updated';
        });

        expect(source).to.deep.equal({
            foo: 'updated',
            bar: '1',
            second: {
                foo: 'updated',
                bar: '1'
            }
        });
    });

    it('should exec replace with hoster', function() {
        var replacer = {
            text: 'updated',
            method: function() {
                return this.text;
            }
        };

        replaceAllMatchProps(source, function(value) {
            return typeof value === 'number';
        }, replacer.method, replacer);

        expect(source).to.deep.equal({
            foo: 'updated',
            bar: '1',
            second: {
                foo: 'updated',
                bar: '1'
            }
        });
    });

    it('should give the full path', function() {
        var paths = [];
        replaceAllMatchProps(source, function(value) {
            return typeof value === 'number';
        }, function(val, key, path) {
            paths.push(path);
        });

        expect(paths[0]).to.equal('foo');
        expect(paths[1]).to.equal('second.foo');
    });

    it('should give keys', function() {
        var keys = [];
        replaceAllMatchProps(source, function(value) {
            return typeof value === 'number';
        }, function(val, key) {
            keys.push(key);
        });

        expect(keys[0]).to.equal('foo');
        expect(keys[1]).to.equal('foo');
    });
});
