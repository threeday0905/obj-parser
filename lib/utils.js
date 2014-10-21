'use strict';

var expect = require('args-expect');

function isObject(obj) {
    return obj &&
        ( typeof obj === 'object' || typeof obj === 'function' );
}

var isPlainObject = require('./is-plain-object');

/**
*   go throgh all props, and replace the value if it is match condition
*   @param {string} obj
*   @param {function} matchFn - check the prop, if return true, then replace it
*   @param {function} replaceFn - use this function to replace the matched prop
*   @param {object} hoster - the hoster of replacefn
*   @param {string} _propPath - cache prop path during recursive, callback on replace
*/
function replaceAllMatchProps(obj, matchFn, replaceFn, hoster, _propPath) {
    if (!isObject(obj)) {
        return obj;
    }

    expect.all(matchFn, replaceFn).isFunction();

    _propPath = _propPath || '';

    Object.keys(obj).forEach(function(key) {
        var prop = obj[key],
            fullPath = _propPath ? _propPath + '.' + key : key;

        if (matchFn(prop)) {
            obj[key] = replaceFn.call(hoster, prop, key, fullPath);
        } else if (isObject(prop)) {
            replaceAllMatchProps(
                prop, matchFn, replaceFn, hoster, fullPath);
        }
    });

    return obj;
}

/**
*   go throgh all props, and replace the value if it is string
*   @param {string} obj
*   @param {function} replaceFn - use this function to replace the string prop
*   @param {object} hoster - the hoster of replacefn
*/
function replaceAllStrProps(obj, replaceFn, hoster) {
    return replaceAllMatchProps(obj, function(prop) {
        return typeof prop === 'string';
    }, replaceFn, hoster);
}

/**
*   Merge the contents of two or more objects together into the first object.
*/
function extendAllProps() {
    var receiver = arguments[0],
        suppliers = Array.prototype.slice.call(arguments, 1);

    if (isObject(receiver)) {
        suppliers.forEach(function(supplier) {
            if (isObject(supplier) && supplier !== null) {
                Object.keys(supplier).forEach(function(key) {
                    var src = receiver[key],
                        copy = supplier[key], descriptor;

                    if (src === copy) {
                        return;
                    }

                    if (isPlainObject(copy)) {
                        receiver[key] = extendAllProps(
                            isObject(src) ? src : {},
                            copy
                        );
                    } else if (Array.isArray(copy)) {
                        receiver[key] = extendAllProps(
                            Array.isArray(src) ? src : [],
                            copy
                        );
                    } else if (copy !== undefined) {
                        descriptor = Object.getOwnPropertyDescriptor(supplier, key);
                        Object.defineProperty(receiver, key, descriptor);
                    }
                });
            }
        });
    }
    return receiver;
}

/**
*   Regex. it will match the value like {{xxx}}
*   @constant
*/
var PARSER_REG = /\{\{([^{}]+)\}\}/g;

/**
*   Get prop value from map object with prop path
*   @param {object} map
*   @param {string} path - like 'from.to'
*/
function getPropByPath(map, path) {
    expect(path).isString();
    expect(map).isObject();

    var prop, paths;

    if (path.lastIndexOf('.') === -1) {
        prop = map[path];
    } else {
        paths = path.split('.');
        prop = map[paths[0]];
        for (var i = 1, len = paths.length; i < len; i += 1) {
            if (isObject(prop)) {
                prop = prop[paths[i]];
            } else {
                prop = undefined;
                break;
            }
        }
    }
    return prop;
}

/**
*   Set prop value from map object with prop path
*   @param {object} map
*   @param {string} path - like 'from.to'
*/
function setPropByPath(map, path, value) {
    expect(path).isString();
    expect(map).isObject();

    var prop, paths, nextPhase;

    if (path.lastIndexOf('.') === -1) {
        map[path] = value;
    } else {
        paths = path.split('.');
        prop = map[paths[0]];
        for (var i = 1, len = paths.length; i < len; i += 1) {
            nextPhase = paths[i];

            if (i === len - 1) { //last call
                if (prop) {
                    prop[nextPhase] = value;
                }
            } else {
                if (isObject(prop)) {
                    prop = prop[nextPhase];
                } else {
                    break;
                }
            }
        }
    }

    return map;
}

/**
*   Parse string, replace {{xxx}} with map object or callback function
*   @param {string} str
*   @param {object} map
*   @param {function} callback
*/
function parseString(str, map, callback) {
    expect(str).isString();

    if (typeof map === 'function') {
        callback = map;
        map = {};
    } else if (!map) {
        map = {};
    }

    return str.replace(PARSER_REG, callback || function(match, name) {
        var value = getPropByPath(map, name);
        if (value === undefined) {
            //console.warn('replacer: %s has not been defined, parsed failed', name);
            return match;
        } else {
            return value;
        }
    });
}

/**
*   Replace all string prop with map object
*   @param {object} source
*   @param {object} map
*/
function parseObject(source, map) {
    expect(source, 'object source').isObject();
    return replaceAllStrProps(source, function(prop) {
        return parseString(prop, map);
    });
}

module.exports = parseObject;

extendAllProps(module.exports, {
    isObject: isObject,
    isPlainObject: isPlainObject,
    extendAllProps: extendAllProps,
    getPropByPath: getPropByPath,
    setPropByPath: setPropByPath,
    replaceAllMatchProps: replaceAllMatchProps,
    replaceAllStrProps: replaceAllStrProps,
    parseString: parseString,
    parseObject: parseObject
});
