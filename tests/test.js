var fs = require('fs');
var SvgFactory = require('../index')();

var svgSrc = fs.readFileSync('../svg-examples/bunny.svg', {encoding:'utf-8'});


SvgFactory.parse(svgSrc, {factoryName:'bigBunny'}, function(err, src){
    
    if(err){
        console.log('the err? ',err);
    }

    console.log(src);

});
