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
    if(svgNode.$.id){
        id = svgNode.$.id;
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

var makePathCode = function(groupLabel, pathID, path){
    var cleanPath = path.$.d.replace(/\t/gi, '');
    cleanPath = cleanPath.replace(/\n/gi,'');
    // get current color from svg-doc
    var baseColor = path.$.fill;
    var strokeColor = '#000000';
    // fluent for .path(`string`).attr({})
    var srcJS = groupLabel+'.add(s.path("'+cleanPath+'").attr({fill:"'+baseColor+'", stroke:"'+strokeColor+'"}));\n';
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
    
    ////////////////////////////
    // Process Path Nodes first
    ////////////////////////////
    if(_.has(svgDoc, 'path')){
        console.log('process PATH', svgDoc);
        console.log('-----'.yellow);
        // still not a fan of depth tracking, as a weird quirk
        // check if needed now that we changed depth and moved order
        _depth = ((_depth === 0)? 1:_depth);

        // our src buffer
        var srcArrayJS= [];

        var itemsLen = svgDoc.path.length;
        // iterate over the paths in the array
        // and access the $.id and $.d (path) also $.fill for color
        var pathID = null;
        
        // TODO make all group/path ids get routed through the uniqueId from
        // underscore so that we can prevent duplicate ids from implementor
        // error which would create scope-variable clashing
        var groupID = null;
        if(group){
            // set the scoped group into stub
            groupID = group;        
        } else {
            // generate a unique group for 
            
            // works but generates a random unique group for the top level
            // parent node which isn't correct
            //groupID = _.uniqueId('group_');
            //srcArrayJS.push(tabDepth(_depth)+'var '+groupID+' = s.group();\n'); 
            groupID = parentGroup;
        }
                
        // TODO replace with a map from underscore?
        for(var ctr=0; ctr < itemsLen; ctr++){
            //console.log('group: ',groupID,'; path #', getID(svgDoc.path[ctr]));
            //console.log(svgDoc.path[ctr].$.d);
            // we have a path ID, either from svgDoc or generated
            pathID = getID(svgDoc.path[ctr]);
            console.log('PATH --'+pathID);
            // TODO get the path srcJS working correctly
            // need to get the correct group/path var passed
            // into makePathCode right now only group matches
            // passing pathID, may not need it
            srcArrayJS.push(tabDepth(_depth)+makePathCode(groupID, pathID, svgDoc.path[ctr])); 
            //console.log((srcArrayJS.join('')).yellow);
            //console.log('-----'.red);
            
        }

        // TODO
        // For a set of paths with a group they will be handle by parent invoker
        // but for a single set of unbounded pathes with no group they need their unique
        // groupID to create a variable container
        // or we could solve all our problems and do our group binding here for paths
        // 
        // Counter Point
        // Ran into an issue with paths bound to parentNode on top level
        // which have no group <g> node because they are bound to the
        // root xml node.  By checking !group passed into scope and it
        // is undefined means we are the top of the stack.
        // only on next iteration does all that change.
        //
        // *srcTemplateCall 
        var srcTest = '';
        if(!_.isUndefined(group)){
            //console.log('what group bastard? ',group);
            srcTest = tabDepth(_depth)+parentGroup+'.add('+groupID+');\n\n';
        }

        srcJS = srcJS + srcArrayJS.join('')+srcTest;
        
    }
    
    //////////////////////////
    // Process Groups Second
    //////////////////////////
    if(_.has(svgDoc, 'g')){
        // for each parent group we need a ref for .add() diff from
        // the paths being bound to a parent.
        var srcTopParent = '';

        // If you don't hoist the current group into parentGroup
        // then it will never happen and everything binds to rootObject
        // from initial call.  This may/not be ideal, may of over built.
        if(group){
            // *srcTemplateCall
            srcTopParent = tabDepth(_depth)+parentGroup+'.add('+group+');\n';
            parentGroup = group;
        }
        
        var itemsLen = svgDoc.g.length;
        
        // create our buffer to hold the deep nested src tree
        var srcArrayJS = [];
        // had a system for parents, may not need anymore
        //var srcParentsJS = [];
        
        // todo replace with underscore 
        // iterate over all the children groups and call traverseNode
        for(var ctr=0; ctr<itemsLen; ctr++){
            
            // extract our group id from svgDoc, 
            // or generate one if doesn't exist
            var groupID = getID(svgDoc.g[ctr]);
            
            // create a var stub for the group
            // *srcTemplateCall
            var groupSrc = tabDepth(_depth)+'var '+groupID+' = s.group();\n';
            // queue the var stub into our array of js
            srcArrayJS.push(groupSrc);
            
            var doc = svgDoc.g[ctr];
            // for each depth traversal send a clean new string to concat on
            var srcJSLeafNodes = '';
            
            // create a separate array of closing parent groups
            // dep? think I moved this group binding in the path level
            // but a parent group bind for top level to root occurs
            // outside of iterator
            //var srcParentGroupBind = tabDepth(_depth)+'var '+parentGroup+'.add('+groupID+');\n';
            //srcParentsJS.push(srcParentGroupBind);

            // wrap our depth recursion calls into an array buffer :)
            srcArrayJS.push(tabDepth(_depth)+traverseNode(doc, srcJSLeafNodes, parentGroup, groupID, _depth));
        } 
        
        
        
        // increment our depth after have we have processed it 
        _depth++; 
        
        // concat all our src code up and if it is time
        // flow out of rescursive stack and let final return occur
        //srcJS = srcJS + srcArrayJS.join('')+srcParentsJS.join('');
        // concat our srcJS and serialize our deep recursive js
        srcJS = srcJS + srcArrayJS.join('')+srcTopParent;

         
    }
    

    return srcJS;

};


module.exports = traverseNode;
