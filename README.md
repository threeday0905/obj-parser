obj-parser
==========
A tool to parse object properties with dynamic replacer.

---
### How to Use

    var replacer = {
        name: 'James',
        age: 12
    };

    var source = {
        foo: '{{name}} / age {{age}}',
        bar: 'staic text',
        bar: [
            '{{name}}', {{age}}
        ]
    };

    var result = require('obj-parser').parse(source, replacer);
    expect(result).to.deep.equal({
        foo: 'James / age 12',
        bar: 'staic text',
        baz: [
            'James', '12'
        ]
    });


### APIs

There are some other useful APIs as below:

##### isPlainObject( value )
Just like **jQuery.isPlainObject**

##### extendAllProps( receiver, [ supplier, supplier2, ...] )
Just like **jQuery.extend**

##### parseString( str, replacer, callback )
Parse string, replace {{xxx}} with map object or callback function

    parseString('name: {{foo}}', {
        foo: 'James'
    });

    parseString('name: {{foo}}', function(match, key) {
        return key.toUpperCase(); // key will be 'foo'
    });    
    
##### getPropByPath( object, path )
Get prop value from object with prop path

    var source = {
        foo: {
            bar: 'hello'
        }
    };
    
    getPropByPath(source, 'foo.bar'); //return 'hello'
    
##### setPropByPath ( object, path, newValue )
Set prop value from object with prop path

    var source = {
        foo: {
            bar: 'hello'
        }
    };
    
    setPropByPath(source, 'foo.bar', 'world'); // update 'hello' to 'world'
    
##### replaceAllStrProps( obj, replaceFn, hoster )
go throgh all props, and replace the value if it is string.

*refer "test/replaceAllStrProp.test.js" for" detail usage.*

##### replaceAllMatchProps( obj, matchFn, replaceFn, hoster )
go throgh all props, and replace the value if it is pase the matchFn.

*refer "test/replaceAllMatchProps.test.js" for detail usage.*

---
### Questions?

If you have any questions, feel free to create a new issue.
