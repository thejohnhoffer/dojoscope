var SCOPE = {};
//-----------------------------------
//
// http://<host>:<port>/index.html#server=<...>#datapath=<...>
//
//-----------------------------------
window.onload = function(e){{}

    // preset tile source
    var terms = SCOPE.parse();
    SCOPE.stack = new DOJO.Stack();
    SCOPE.stack.init(terms);

    // Open a seadragon with two layers
    SCOPE.openSD = OpenSeadragon({
        tileSources: SCOPE.stack.layers,
        crossOriginPolicy: 'Anonymous',
        prefixUrl: 'images/icons/',
        id: 'viaWebGL'
    });

    // Link everything to WebGL
    SCOPE.view = new DOJO.Link(SCOPE.openSD);
};

// Change any preset terms set in input address
SCOPE.parse = function() {
    var output = {};
    var input = document.location.hash;
    var string = decodeURI(input).slice(1);
    // read value pair as bool, string, or int
    string.split('#').map(function(pair) {
        var key = pair.split('=')[0];
        var val = pair.split('=')[1];
        switch (!val*2 + !Number(val)) {
            case 0: return output[key] = parseInt(val,10);
            case 1: return output[key] = val;
            default: return output[key] = true;
        }
    });
    return output;
};