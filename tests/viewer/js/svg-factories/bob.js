var bigBunny = function(s){
return function(){
    var _obj = s.group();
_obj.add(s.path("M167.558,240c-29.792-49.22,28.572-127.83,80.272-117.626S347.15,203.885,309.735,240C272.32,276.115,187.285,272.592,167.558,240z").attr({fill:"#3D77F9", stroke:"#000000"}));
var eyes2 = s.group();
_obj.add(eyes2);
var ears3 = s.group();
ears3.add(s.path("M183.948,150.24c0,0-11.383-60.228-3.111-51.769c3.318,3.393,33.76,27.125,29.409,30.544C197.023,139.409,197.402,135.579,183.948,150.24z").attr({fill:"#C19C00", stroke:"#000000"}));
ears3.add(s.path("M297.546,152.24c0,0,11.383-60.228,3.111-51.769c-3.318,3.393-33.76,27.125-29.409,30.544C284.471,141.409,284.092,137.579,297.546,152.24z").attr({fill:"#C19C00", stroke:"#000000"}));
_obj.add(ears3);
return _obj;
}; // private-functional-closure
}; // close factory
window.bigBunny = bigBunny;
