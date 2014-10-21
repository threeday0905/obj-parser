'use strict';

var expect = require('chai').expect;

describe('parseString()', function() {
    var parseString = require('../index').parseString;

    var tplString = 'name: {{foo}} {{bar}}';

    it('should return target directly if not provide map', function() {
        var result = parseString(tplString);
        expect(result).to.equal(tplString);
    });

    it('should parse target with given map object', function() {
        var result = parseString(tplString, {
            foo: 'herman',
            bar: 'lee'
        });

        expect(result).to.equal('name: herman lee');
    });

    it('should support customize replace callback', function() {
        var result = parseString(tplString, function(match, name) {
            if (name === 'foo') {
                return 'herman';
            } else if (name === 'bar') {
                return 'lee';
            }
        });
        expect(result).to.equal('name: herman lee');
    });

    it('should support hierarchy prop lookup', function() {
        var result = parseString('{{a.b.c}}', {
            a: {
                b: {
                    c: 'hello'
                }
            }
        });
        expect(result).to.equal('hello');
    });

    it('should work normally even if replacer is not found', function() {
        var result = parseString(tplString, {
            foo: 'herman'
        });

        expect(result).to.equal('name: herman {{bar}}');
    });
});
