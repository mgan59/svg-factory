// s is the drawing context
// Snap is our actual svg lib
var bob_the_blob = function(s, Snap){
    return function(params){
        //var curPos = {x:null, y:null};
        var _positionMatrix = null;

        // mask our params to handle possible undefined
        var _params = ((params)? params:{});
        
        // our private factory we will return
        var _obj = s.group();

        _obj.actions = {};
        _obj.actions.animateRotate = function(){
           //var rotate1 = {transform:"t-0,60r45"};
           var rotate1 = {transform:"R45"};
            var rotate2 = {transform:"t-0,60r-45"};
           _obj.animate(rotate1,1000, mina.easeinout, function(){
               
             //_obj.animate(rotate2,1000, mina.easeinout);  
            }); 
        };

        _obj.actions.rotate = function(angle){
            angle = 22;
            var rotateMatrix = new Snap.Matrix();
            rotateMatrix.add(_positionMatrix);
            /*
            var cpos = {
                x:_positionMatrix.x(0,0),
                y:_positionMatrix.y(0,0)
            };
            */
            var cpos = {
                x:242,
                y:183
            };

            //console.log('CUR POS', cpos);
            rotateMatrix.rotate(angle, cpos.x,cpos.y);
            //_obj.transform(rotateMatrix);
            //_obj.animate({'transform':rotateMatrix}, 1000, mina.easeinout);
            _obj.animate({'transform':"t242,20r22"}, 1000, mina.easeinout);


        };
        _obj.actions.position = function(x,y){
            console.log('-- ',s);
            console.log('pf --', Snap);
            var positionMatrix = new Snap.Matrix();
            positionMatrix.translate(x,y);
            _obj.transform(positionMatrix);
            _positionMatrix = positionMatrix;
            //console.log(_obj);
            //console.log('pos x0,0 -',positionMatrix.x(10,0));
        };

        /**
         * color param matching, see if we can logic block
         */
        // colors to namingConvention
        var _palette = _params.colorPalette;

        // namingConventions to #domID
        var _colorMapping = _params.colorMapping;
        
        // accepts an id target looks up the palette match
        // then returns the actual palette
        var color = function(target){
            var paletteMatch=null,
                // by default return white/black for unmatched
                // lookup calls, instead of not handling and
                // having an exception throw
                // improve to log message if palette error
                // or mapping error, to help developer
                palette={fill:'#fff', stroke:'#000'};
            if(_colorMapping && _colorMapping[target]){
                paletteMatch = _colorMapping[target];
                if(_palette[paletteMatch]){
                    palette = _palette[paletteMatch];
                } else {
                    console.warn('_palette missing', paletteMatch);
                }
            } else {
                console.warn('_colorMap missing ',target);
            }
             
            return palette;
        };
        /* end color matching block */


        _obj.add(s.path("M167.558,240c-29.792-49.22,28.572-127.83,80.272-117.626S347.15,203.885,309.735,240C272.32,276.115,187.285,272.592,167.558,240z").attr({fill:color('body').fill, stroke:color('body').stroke}));
var mouth2=s.ellipse(236.123,229.75,51.123,13.75).attr({fill:"#FFFFFF", stroke:"#000000"});

_obj.add(mouth2);
var eyes3 = s.group();
var node_4=s.ellipse(210.5,166.563,12.5,16.063).attr({fill:"#FFFFFF", stroke:"#000000"});

_obj.add(node_4);
var node_5=s.ellipse(258.5,166.563,12.5,16.063).attr({fill:"#FFFFFF", stroke:"#000000"});

_obj.add(node_5);
var rightIris6=s.ellipse(258,166.5,4,5).attr({fill:"#000000", stroke:"#000000"});

_obj.add(rightIris6);
var leftIris7=s.ellipse(209,166.5,4,5).attr({fill:"#000000", stroke:"#000000"});

_obj.add(leftIris7);
_obj.add(eyes3);
var ears8 = s.group();
ears8.add(s.path("M183.948,150.24c0,0-11.383-60.228-3.111-51.769c3.318,3.393,33.76,27.125,29.409,30.544C197.023,139.409,197.402,135.579,183.948,150.24z").attr({fill:"#C19C00", stroke:"#000000"}));
ears8.add(s.path("M297.546,152.24c0,0,11.383-60.228,3.111-51.769c-3.318,3.393-33.76,27.125-29.409,30.544C284.471,141.409,284.092,137.579,297.546,152.24z").attr({fill:"#C19C00", stroke:"#000000"}));
_obj.add(ears8);


        return _obj;
    
    };
};
window.bob_the_blob = bob_the_blob;
