var fs = require('fs');
var _ = require('lodash');
var colors = require('colors');
// Our xml processing, abandoned xml2js because of order
// https://github.com/Leonidas-from-XIV/node-xml2js/issues/31 
var xamel = require('xamel');
var traverseNodes = require('./lib/traverse');


module.exports = function(){
    var that = {};

    var _templateStore = {
        'globalWindow':__dirname+'/lib/templates/globalWindow.ejs',
        'commonJS':__dirname+'/lib/templates/commonJS.ejs'
    };
    
    that.parse = function(svgFragment, options, callback){
        // params
        // * need a constructor/factory function name
        // * need rootObjectLabel
        // throw an error if missing factoryName/Root
        var factoryObjLabel = options.factoryName,
            template = ((options.template)? options.template:'globalWindow'),
            // use lodash to gen a unique var to encapsulate
            // this is in a functional closure [private]
            rootObjLabel = '_obj',
            srcJS = '',
            srcTraverseJS = '';
        
        // do template frame-loading
        var templateFrame = fs.readFileSync(_templateStore[template],{encoding:'utf-8'});

        //console.log(templateFrame);

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
            //console.log(xmlObj);

            // check that our xmlObj has children, if not major problem
            if(xmlObj.children.length === 0){
                // throw error
            }
            
            srcTraverseJS = traverseNodes(xmlObj.children, srcTraverseJS, rootObjLabel); 
            srcJS = _.template(templateFrame, {factoryObjLabel:factoryObjLabel, rootObjLabel:rootObjLabel, jsSrc:srcTraverseJS});
            /*
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
            */
            return callback(err, srcJS);
        });
        // return out parsed SvgDocObject
    };
    
    return that;
};
