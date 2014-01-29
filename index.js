var _ = require('lodash');
var colors = require('colors');
// Our xml processing, abandoned xml2js because of order
// https://github.com/Leonidas-from-XIV/node-xml2js/issues/31 
var xamel = require('xamel');
var traverseNodes = require('./lib/traverseRefactor');

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
        xamel.parse(svgFragment, function (err, xmlObj) {
            // propogate err from svgParsing to client
            if(err){
                callback(err, null);
                process.exit();
            }
            
            // Get root xml node's attributes (root #id)
            //var docInfo = result.svg.$;
            console.log(xmlObj);

            // check that our xmlObj has children, if not major problem
            if(xmlObj.children.length === 0){
                // throw error
            }

            // determine eventually how we plan to template these src(s)
            // These pieces are the template-header
            srcJS += 'var '+factoryObjLabel+' = function(s){\n';
            srcJS += 'return function(){\n';
            // do 4 space indent
            srcJS += '    var '+rootObjLabel+' = s.group();\n';
            
            //srcTraverseJS = traverseNodes(result.svg, srcTraverseJS, rootObjLabel);
            // xmlObj.children is our rootNode to start on
            srcTraverseJS = traverseNodes(xmlObj.children, srcTraverseJS, rootObjLabel); 
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
