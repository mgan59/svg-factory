var fs = require('fs');
var xamel = require('xamel');
var SvgFactory = require('../index')();
var colors = require('colors');

var svgSrc = fs.readFileSync('../svg-examples/bob-the-blob.svg', {encoding:'utf-8'});
/*
xamel.parse(svgSrc, function(err, xml) {
    
    console.log(err);
    console.log('--');
    //console.log(xml.children[1]);
    var store = xml.children[1];
    for(var ctr=0; ctr < store.children.length; ctr++){
        console.log(store.children[ctr]);
    }
});
*/

SvgFactory.parse(svgSrc, {factoryName:'bigBunny'}, function(err, src){
    
    if(err){
        console.log('the err? ',err);
    }
    
    console.log(src);

});

