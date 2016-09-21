var SCOPE = {};
var DOJO = {};
var log = function(x,n) {
  console.log(x);
  if (n) console.log(new Error().stack.split(/\n/).splice(2,n).join('\n'));
}
//-----------------------------------
//
// http://<host>:<port>/index.html?server=<...>&datapath=<...>
// Calls DOJO.Stack + DOJO.Link
// -- Called first
//-----------------------------------
window.onload = function(e){{}

    // preset tile source
    SCOPE.stack  = SCOPE.parse(DOJO.Stack);
    // Open a seadragon with two layers
    SCOPE.openSD = OpenSeadragon({
        tileSources: SCOPE.stack.source,
        crossOriginPolicy: 'Anonymous',
        prefixUrl: 'images/icons/',
        showZoomControl: 0,
        id: 'viaWebGL'
    });
    // Link everything to WebGL
//    SCOPE.link = new DOJO.Link(SCOPE).init();
};

// Change any preset terms set in input address
SCOPE.parse = function(maker) {
    var output = {};
    var input = document.location.search;
    var string = decodeURI(input).slice(1);
    // read value pair as bool, string, or int
    string.split('&').map(function(pair) {
        var key = pair.split('=')[0];
        var val = pair.split('=')[1];
        switch (!val*2 + !Number(val)) {
            case 0: return output[key] = parseInt(val,10);
            case 1: return output[key] = val;
            default: return output[key] = true;
        }
    });
    return new maker(output);
};