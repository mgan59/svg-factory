var colors = require('colors');
var _ = require('lodash');

/*
 * TODO rename to getNodeID since it actual gets it 
 * from a node
 * if svgNode has an id return it
 * else generate one
 */
var getID = function(svgNode){
    var id = 'node_'
    if(svgNode.attrs.id){
        id = _.uniqueId(svgNode.attrs.id);
    } else {
        id = _.uniqueId(id);
    }
    return id;
}

/*
 * Make a simple wrapper to route all groupIDs 
 * to a uniqueID so prevent variable clashing
 */
//var getGroupID = function(){};

/*
 *  Bundle up the template code generator for a 
 *  group and its pathes
 *  Note: passing pathID in not sure if we will need it depends on how we implement fill
 */

var makePathCode = function(groupLabel, pathID, nodeAttrs){
    var cleanPath = nodeAttrs.d.replace(/\t/gi, '');
    cleanPath = cleanPath.replace(/\n/gi,'');
    // get current color from svg-doc
    var baseColor = nodeAttrs.fill;
    var strokeColor = '#000000';
    // fluent for .path(`string`).attr({})
    var srcJS = groupLabel+'.add(s.path("'+cleanPath+'").attr({fill:"'+baseColor+'", stroke:"'+strokeColor+'"}));\n';
    return srcJS;
};

var makeEllipseCode = function(nodeAttrs){
    var rx=nodeAttrs.rx, ry=nodeAttrs.ry,
        cx=nodeAttrs.cx, cy=nodeAttrs.cy,
        strokeColor=nodeAttrs.stroke; 
    // if fill is set use it, otherwise use stroke (this is how svg works)
    var baseColor=(nodeAttrs.fill)? nodeAttrs.fill:nodeAttrs.stroke;

    var srcJS = 's.ellipse('+cx+','+cy+','+rx+','+ry+').attr({fill:"'+baseColor+'", stroke:"'+strokeColor+'"});\n';
    return srcJS;

};

var tabDepth = function(depth){
    var token = '    ';
    var tabSpace = '';
    for(var ctr = 0; ctr < depth; ctr++){
        tabSpace += token;
    }
    return tabSpace;
};


/*
 *  Recursively traverse an svgDoc fragment
 *  Groups contain nested elements
 *  Paths 
 *
 */
var traverseNode = function(svgDoc, srcJS, parentGroup, group, depth){
    //
    // On depth 1 get/store master node
    // all grops in the end should bind to it and any unbound paths
    // do inc? on the check? instead of in group?
    var _depth = ((depth)? depth:1);
    
    //console.log('count: ',svgDoc.length); 
    //console.log(svgDoc);
    
    // svgDoc should be an array of objLiterals, commonly `0` will our 
    // objLiteral that contains the sub-children
    // however, if there is a chance there can be other items (comments)
    // so we need to check the obj-lit for keys 
    // 99% of the time there will be a single item, but must handle edge case
    for(var ctr=0; ctr < svgDoc.length; ctr++){
        //console.log('iteration check on ',ctr,'of ',svgDoc.length,' \n',svgDoc[ctr]);
        if(_.has(svgDoc[ctr], 'children')){
            
            // namespace our node
            var node = svgDoc[ctr];
            
            //console.log('processing node ', node);

            /*
             *
             *
             */
            // call traverse on each child...
            // name = `svg` topRootNode
            if(node.name === 'svg'){
                // first pass so we should define out parentGroup
                // top level element needs to iterate over each child and
                // call the traverse
                srcJS = traverseNode(node.children, srcJS, parentGroup, '', _depth);
            }
            // name = `path` a path element
            else if(node.name === 'path'){
                // create path
                //console.log(('PATH: '+node.attrs.id).yellow);
                //console.log(node.attrs.d);
                // TODO not make it always bind to parent, should do local
                //console.log('group check ', parentGroup, group);
                var pathID = ((node.attrs.id)? _.uniqueId(node.attrs.id):_.uniqueId('path'));
                var groupID = ((group)? group:parentGroup);
                var test =  makePathCode(groupID, pathID, node.attrs);
                //test+= parentGroup+'.add('+groupID+');\n';
                //console.log(test);
                // concat all our js onto the scoped srcJS being
                // passed into rescursive stack
                srcJS = srcJS + test;
                //return srcJS;
            }
            // name = `g` a group element
            else if(node.name === 'g'){
                //console.log('---'.yellow);
                //console.log(('Group: '+node.attrs.id).yellow);
                //console.log(node);
                var groupID = getID(node); 
                // create group srcJS
                srcJS += 'var '+groupID+' = s.group();\n';
                srcJS = traverseNode(node.children, srcJS, parentGroup, groupID, _depth);
                // need to bind all the generated paths/sub-groups to parent
                srcJS += parentGroup+'.add('+groupID+');\n';
                

            }
            else if(node.name === 'ellipse'){
                // get the node id
                var nodeID = getID(node);
                var ellipseCode = makeEllipseCode(node.attrs);
                srcJS += 'var '+nodeID+'='+ellipseCode+'\n'; 
                
                // need to bind all the generated paths/sub-groups to parent
                srcJS += parentGroup+'.add('+nodeID+');\n';


            }
            
        }
    }
    
    return srcJS;
};


module.exports = traverseNode;


