var _ = require('lodash');
var colors = require('colors');
// our xml parsing lib
var parseString = require('xml2js').parseString;
var traverseNodes = require('./lib/traverse');

module.exports = function(){
    var parser = {};
    
    parser.parse = function(svgFragment, options, callback){
        // params
        // * need a constructor/factory function name
        // * need rootObjectLabel
        // throw an error if missing factoryName/Root
        var factoryObjLabel = options.factoryName,
            // use lodash to gen a unique var to encapsulate
            // this is in a functional closure [private]
            rootObjLabel = '_obj',
            srcJS = '',
            srcTraverseJS = '';
        

        

        // magic happens here
        // parse our xml/svgFragment
        parseString(svgFragment, function (err, result) {
            // propogate err from svgParsing to client
            if(err){
                callback(err, null);
                exit

            }
            
            // Get root xml node's attributes (root #id)
            var docInfo = result.svg.$;


            // determine eventually how we plan to template these src(s)
            // These pieces are the template-header
            srcJS += 'var '+factoryObjLabel+' = function(s){\n';
            srcJS += 'return function(){\n';
            // do 4 space indent
            srcJS += '    var '+rootObjLabel+' = s.group();\n';
            
            srcTraverseJS = traverseNodes(result.svg, srcTraverseJS, rootObjLabel);
            
            srcJS += srcTraverseJS;
            srcJS += 'return '+rootObjLabel+';';
            srcJS += '\n}; // private-functional-closure\n}; // close factory';
            srcJS += '\nwindow.'+factoryObjLabel+' = '+factoryObjLabel+';';
            

            return callback(err, srcJS);
        });
        // return out parsed SvgDocObject
    };

    return parser;
};
