'use strict';

var expect = require('chai').expect;

describe('extendAllProps()', function() {
    var extendAllProps = require('../index').extendAllProps;

    it('can extend an object with the attributes of another', function() {
        var result = extendAllProps({}, {
            a: 'b'
        });

        expect(result.a).to.equal('b');
    });

    it('properties in source override destination', function() {
        var result = extendAllProps({
            a: 'x'
        }, {
            a: 'b'
        });

        expect(result.a).to.equal('b');
    });

    it('properties not in source don\'t get overriden', function() {
        var result = extendAllProps({
            x: 'x'
        }, {
            a: 'b'
        });

        expect(result.x).to.equal('x');
    });

    it('can extend from multiple source objects', function() {
        var result = extendAllProps({
            x: 'x'
        }, {
            a: 'a'
        }, {
            b: 'b'
        });

        expect(result).to.deep.equal({
            x: 'x',
            a: 'a',
            b: 'b'
        });
    });

    it('extending from multiple source objects last property trumps', function() {
        var result = extendAllProps({
            x: 'x'
        }, {
            a: 'a',
            x: 2
        }, {
            a: 'b'
        });

        expect(result).to.deep.equal({
            x: 2,
            a: 'b'
        });
    });

    it('extend copies null values but exclude undefined value', function() {
        var result = extendAllProps({

        }, {
            a: undefined,
            b: null
        });

        expect(result).to.deep.equal({
            b: null
        });
    });

    it('should not error on null or undefined sources', function() {
        var result = extendAllProps({}, null, undefined, { a: 1 });
        expect(result.a).to.equal(1);
    });

    it('extending null results in null', function() {
        var result = extendAllProps(null, {
            a: 1
        });
        expect(result).to.equal(null);
    });

    it('extending undefined results in undefined', function() {
        var result = extendAllProps(undefined, {
            a: 1
        });
        expect(result).to.equal(undefined);
    });

    it('extending deep result', function() {
        var result = extendAllProps({
            a: 1,
            b: {
                b1: 2,
                b2: 2
            },
            c: {

            },
            d: {

            }
        }, {
            a: 'updated'
        }, {
            b: {
                b2: 'updated'
            }
        }, {
            c: 'updated'
        }, {
            d: [
                'updated'
            ]
        });

        expect(result).to.deep.equal({
            a: 'updated',
            b: {
                b1: 2,
                b2: 'updated'
            },
            c: 'updated',
            d: [
                'updated'
            ]
        });
    });

    it('should overwrite non-object target with object supplier', function() {
        var result = extendAllProps({
            a: '123'
        }, {
            a: {
                b: 1,
                c: 2
            }
        });

        expect(result).to.deep.equal({
            a: {
                b: 1,
                c: 2
            }
        });
    });

    it('should extend array', function() {
        var result = extendAllProps({
            a: [ 1, 2, 3 ]
        }, {
            a: [ 0 ]
        });

        expect(result).to.deep.equal({
            a: [ 0, 2, 3 ]
        });
    });

    it('should ignore if supplier is undefined', function() {
        var result = extendAllProps({
            a: 1
        }, {
            a: undefined
        });

        expect(result).to.deep.equal({
            a: 1
        });
    });
});
