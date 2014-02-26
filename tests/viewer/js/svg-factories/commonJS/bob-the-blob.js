module.export = function(s){
    return function(){
        var _obj = s.group();

        _obj.add(s.path("M167.558,240c-29.792-49.22,28.572-127.83,80.272-117.626S347.15,203.885,309.735,240C272.32,276.115,187.285,272.592,167.558,240z").attr({fill:color('body').fill, stroke:color('body').stroke}));
var mouth22=s.ellipse(236.123,229.75,51.123,13.75).attr({fill:"#FFFFFF", stroke:"#000000"});

_obj.add(mouth22);
var eyes23 = s.group();
var node_24=s.ellipse(210.5,166.563,12.5,16.063).attr({fill:"#FFFFFF", stroke:"#000000"});

_obj.add(node_24);
var node_25=s.ellipse(258.5,166.563,12.5,16.063).attr({fill:"#FFFFFF", stroke:"#000000"});

_obj.add(node_25);
var rightIris26=s.ellipse(258,166.5,4,5).attr({fill:"#000000", stroke:"#000000"});

_obj.add(rightIris26);
var leftIris27=s.ellipse(209,166.5,4,5).attr({fill:"#000000", stroke:"#000000"});

_obj.add(leftIris27);
_obj.add(eyes23);
var ears28 = s.group();
ears28.add(s.path("M183.948,150.24c0,0-11.383-60.228-3.111-51.769c3.318,3.393,33.76,27.125,29.409,30.544C197.023,139.409,197.402,135.579,183.948,150.24z").attr({fill:"#C19C00", stroke:"#000000"}));
ears28.add(s.path("M297.546,152.24c0,0,11.383-60.228,3.111-51.769c-3.318,3.393-33.76,27.125-29.409,30.544C284.471,141.409,284.092,137.579,297.546,152.24z").attr({fill:"#C19C00", stroke:"#000000"}));
_obj.add(ears28);


        return _obj;
    };
};
