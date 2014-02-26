var fs = require('fs');
var _ = require('lodash');
var colors = require('colors');
// Our xml processing, abandoned xml2js because of order
// https://github.com/Leonidas-from-XIV/node-xml2js/issues/31 
var xamel = require('xamel');

// TODO write to be svg-generator
// which has a private method traverse :)
// our generator should have an interface to accept 
// options from top level, default fill/stroke colors 
// for doing a flat color system.
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

           return callback(err, srcJS);
        });
        // return out parsed SvgDocObject
    };
    
    return that;
};
