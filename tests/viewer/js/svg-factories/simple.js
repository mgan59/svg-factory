var bigBunny = function(s){
return function(){
    var _obj = s.group();
_obj.add(s.path("M239.578,281.558c0,0-17.007-8.163-35.374,12.245s-54.422-3.401-54.422,4.762s-4.081,44.898,19.048,32.653s76.446-40.061,70.748-45.578").attr({fill:"#FFFFFF", stroke:"#000000"}));
var feet2 = s.group();
feet2.add(s.path("M258.24,383.384c19.952-24.846,121.322,13.058,115.199,22.582S240.32,405.699,258.24,383.384z").attr({fill:"#FFFFFF", stroke:"#000000"}));
feet2.add(s.path("M256.974,383.384c-19.952-24.846-121.321,13.058-115.199,22.582S274.894,405.699,256.974,383.384z").attr({fill:"#FFFFFF", stroke:"#000000"}));
_obj.add(feet2);
return _obj;
}; // private-functional-closure
}; // close factory
window.bigBunny = bigBunny;
