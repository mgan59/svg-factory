# svg-factory
===========

A [meta-programming](http://en.wikipedia.org/wiki/Meta_programming) library for generating js-object code from a src svg document.

```javascript

var svgDoc = '<svg><ellipse id="theEllipse" rx="10" ry="10"></ellipse></svg>'

svgFactory.parse(svgDoc, {factoryName:'myEllipse'}, function(err, srcCode){
    
    // output to stdout
    console.log(srcCode);

});
```

Output
```javascript
/*
 * @s - RaphaelJS drawing interface
 */
(function(s){
    """use strict"""
    return function(){
        var _obj = s.group();
        var theEllipse2 = s.ellipse(); 
        return _obj;
    };
});
```

The above example is a default template, but custom templates can be created to support specific environments for requirejs or browserify.  Also a grunt-task exists to batch process a directory of svg files.

