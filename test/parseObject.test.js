'use strict';

var expect = require('chai').expect;

describe('parseObject()', function() {
    var parseObject = require('../index').parseObject;

    var source, replacer;

    beforeEach(function() {
        source = {
            foo: '{{first}} {{last}}',
            bar: 'static text',
            second: {
                foo: '{{first}} {{last}}',
                bar: 'static text'
            }
        };
        replacer = {
            first: 'herman',
            last: 'lee'
        };
    });

    it('should replace source with dynamic value', function() {
        var result = parseObject(source, replacer);
        expect(result).to.deep.equal({
            foo: 'herman lee',
            bar: 'static text',
            second: {
                foo: 'herman lee',
                bar: 'static text'
            }
        });
    });

    it('should work normally even if replacer is not found', function() {
        var result = parseObject(source, {
            first: 'herman'
        });

        expect(result).to.deep.equal({
            foo: 'herman {{last}}',
            bar: 'static text',
            second: {
                foo: 'herman {{last}}',
                bar: 'static text'
            }
        });
    });
});
