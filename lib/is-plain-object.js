'use strict';

/** most of logic are copied from lodash */

var toString = Object.prototype.toString,
    getPrototypeOf = Object.getPrototypeOf;

var reNative = new RegExp('^' +
  String(toString)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/toString| for [^\]]+/g, '.*?') + '$'
);

function isNative(value) {
    return typeof value === 'function' && reNative.test(value);
}

function shimIsPlainObject(value) {
    var ctor, key, result;

    // avoid non Object objects, `arguments` objects, and DOM elements
    if (!(value && toString.call(value) === '[object Object]')) {
        return false;
    }

    ctor = value.constructor;
    if (typeof ctor === 'function' && !(ctor instanceof ctor)) {
        return false;
    }

    // In most environments an object's own properties are iterated before
    // its inherited properties. If the last iterated property is an object's
    // own property then there are no inherited enumerable properties.
    for (key in value) {
        /* jshint forin: false */
        result = key;
    }
    return typeof result === 'undefined' || hasOwnProperty.call(value, result);
}

var isPlainObject = !getPrototypeOf ? shimIsPlainObject :
    function isPlainObject(value) {
        if (!(value && toString.call(value) === '[object Object]')) {
            return false;
        }

        var valueOf = value.valueOf, objProto;
        if (isNative(valueOf)) {
            objProto = getPrototypeOf(valueOf);
            if (objProto) {
                objProto = getPrototypeOf(objProto);
            }
        }

        return objProto ? (value === objProto || getPrototypeOf(value) === objProto)
          : shimIsPlainObject(value);
    };

module.exports = isPlainObject;
