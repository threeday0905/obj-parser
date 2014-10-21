'use strict';

var expect = require('chai').expect;

describe('isPlainObject()', function() {
    /*jshint -W030, -W024 */
    var isPlainObject = require('../index').isPlainObject;

    it('should detect plain objects', function() {
        function Foo(a) {
            this.a = a;
        }

        expect(isPlainObject({

        })).to.be.true;

        expect(isPlainObject({
            'a': 1
        })).to.be.true;

        expect(isPlainObject({
            'constructor': Foo
        })).to.be.true;

        expect(isPlainObject(
            [ 1, 2, 3 ]
        )).to.be.false;

        expect(isPlainObject(
            new Foo(1)
        )).to.be.false;

        expect(isPlainObject(
            true
        )).to.be.false;

        expect(isPlainObject(
            'a'
        )).to.be.false;
    });

    it('should return `true` for obj with a custom `valueOf` property', function() {
        expect(isPlainObject({
            'valueOf': function() {}
        })).to.be.true;
    });

    it('should return `true` for obj with a `[Prototype]` of `null`', function() {
        expect(isPlainObject(
            Object.create(null)
        )).to.equal(true);
    });

    it('should return `false` for obj without a `[Class]` of "Object"', function() {
        expect(isPlainObject(arguments)).to.be.false;
        expect(isPlainObject(Error)).to.be.false;
        expect(isPlainObject(Math)).to.be.false;
    });
});
