'use strict';

var expect = require('chai').expect;

describe('replaceAllStrProps()', function() {
    var replaceAllStrProps = require('../index').replaceAllStrProps,
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

    it('should replace all string props', function() {
        replaceAllStrProps(source, function(val, key) {
            /* jshint unused:false */
            return 'updated';
        });

        expect(source).to.deep.equal({
            foo: 1,
            bar: 'updated',
            second: {
                foo: 1,
                bar: 'updated'
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

        replaceAllStrProps(source, replacer.method, replacer);

        expect(source).to.deep.equal({
            foo: 1,
            bar: 'updated',
            second: {
                foo: 1,
                bar: 'updated'
            }
        });
    });
});
