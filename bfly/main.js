var SCOPE = {};
//-----------------------------------
//
// http://<host>:<port>/index.html#server=<...>#datapath=<...>
//
//-----------------------------------
window.onload = function(e){

    var kwargs = SCOPE.parse();
    SCOPE.view = new DOJO.View(kwargs);
};

// Change any preset terms set in input address
SCOPE.parse = function( input, output) {
    var output = output || {};
    var input = input || document.location.hash;
    var string = decodeURI(input).slice(1);
    // read as bool, string, or int
    string.split('#').map(function(pair) {
        var key = pair.split('=')[0];
        var val = pair.split('=')[1];
        switch (!val*2 + !Number(val)) {
            case 0: return output[key] = parseInt(val,10);
            case 1: return output[key] = val.replace(new RegExp('\/$'),'');
            default: return output[key] = true;
        }
    });
    return output;
};