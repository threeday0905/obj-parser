'use strict';

var expect = require('chai').expect;

describe('parseObject()', function() {
    var parse = require('../index');

    it('will provide "parse" shourtcut', function() {
        var replacer = {
            name: 'James',
            age: 12
        };

        var source = {
            foo: '{{name}} / age {{age}}',
            bar: 'staic text',
            baz: [
                '{{name}}', '{{age}}'
            ]
        };

        var result = parse(source, replacer);
        expect(result).to.deep.equal({
            foo: 'James / age 12',
            bar: 'staic text',
            baz: [
                'James', '12'
            ]
        });
    });
});
