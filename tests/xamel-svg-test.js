var fs = require('fs');
var xamel = require('xamel');
var SvgFactory = require('../index')();
var colors = require('colors');


//
// File read
//
var svgSrc = fs.readFileSync('../svg-examples/bob-the-blob.svg', {encoding:'utf-8'});

SvgFactory.parse(svgSrc, {factoryName:'bigBunny'}, function(err, src){
    
    if(err){
        console.log('the err? ',err);
    }
    
    console.log(src);

});

