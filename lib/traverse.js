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
        // sanitize node (make sure invalid js chars like '-'
        // aren't put into variable labels
        var cleanId = svgNode.attrs.id.replace(/-/g,'_');
        id = _.uniqueId(cleanId);
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

/*
 * helper/partial-template for makePathCode that 
 * builds the colorPaletteMapping
 * attribute code literal.
 */
var generatedAttr = function(target){
    var code = "{fill:color('<%=target%>').fill, stroke:color('<%=target%>').stroke}";
    var s = _.template(code, {target:target});
    return s;
};

/*
 * @nodeAttrs will have .id (pathid) and .d which is path directions
 */
var makePathCode = function(groupLabel, nodeAttrs){
    var pathID = ((nodeAttrs.id)? nodeAttrs.id:'path');
    var pathOpID = ((nodeAttrs.id)? _.uniqueId(nodeAttrs.id):_.uniqueId('path'));

    var cleanPath = nodeAttrs.d.replace(/\t/gi, '');
    cleanPath = cleanPath.replace(/\n/gi,'');
    // get current color from svg-doc
    var baseColor = nodeAttrs.fill;
    var strokeColor = '#000000';
    console.log('path -->', pathID);
    console.log('group -->',groupLabel);
    console.log('---');
    // fluent for .path(`string`).attr({})
    // here we check if the pathID has a matching palette key
    // and we should use correct code
    var srcTemplate = '<%= varLabel %>.add(s.path("<%= path %>").attr(<%= attrSet %>));\n';
    var srcJS = '';
    if(_.indexOf(['body','ears'], pathID) !== -1){
        console.log('matchup so dump out beetch');
        srcJS = _.template(srcTemplate, {varLabel:groupLabel, path:cleanPath,attrSet:generatedAttr(pathID)});
    } else {
        //srcJS = groupLabel+'.add(s.path("'+cleanPath+'").attr({fill:"'+baseColor+'", stroke:"'+strokeColor+'"}));\n';
        var attr = '{fill:"'+baseColor+'", stroke:"'+strokeColor+'"}';
        srcJS = _.template(srcTemplate,{varLabel:groupLabel, path:cleanPath,attrSet:attr});

    }
    console.log('dumping srcJS \n',srcJS);
    return srcJS;
};

// TODO add colorPaletteMapping functionality
// also templatize?
var makeEllipseCode = function(nodeAttrs){
    var rx=nodeAttrs.rx, ry=nodeAttrs.ry,
        cx=nodeAttrs.cx, cy=nodeAttrs.cy,
        strokeColor=nodeAttrs.stroke; 
    // if fill is set use it, otherwise use stroke (this is how svg works)
    var baseColor=(nodeAttrs.fill)? nodeAttrs.fill:nodeAttrs.stroke;

    var srcJS = 's.ellipse('+cx+','+cy+','+rx+','+ry+').attr({fill:"'+baseColor+'", stroke:"'+strokeColor+'"});\n';
    return srcJS;

};


var pathGenParams = {};
// need to keep param signatures as unified as possible
var PathGenerator = function(params){
    var that = {
        path:makePathCode,
        ellipse:makeEllipseCode
    };
    return function(params){
        
    }(params);
}(pathGenParams);


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
 *  TODO separate our code some, traverseNode should just be our recursive
 *  iterator that provides the top level writing hook.
 *  Maybe make the traverse a function on a parent class which handles a 
 * dependency injection using a writer that has settings from client
 * such as default fill colors, template/shape writers and what not.
 * need to mount our module.export at top
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
                //var pathID = ((node.attrs.id)? _.uniqueId(node.attrs.id):_.uniqueId('path'));
                var groupID = ((group)? group:parentGroup);
                var test =  makePathCode(groupID, node.attrs);
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


