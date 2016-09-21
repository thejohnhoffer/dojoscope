//-----------------------------------
//
// DOJO.Stack: Stack some tileSources
// Calls DOJO.Source
// -- Called by main.js
//-----------------------------------

DOJO.Stack = function(src_terms){

    // Setup
    var zBuff = this.zBuff;
    var make = this.make.bind(this);
    var nLayers = this.preset.length;
    var keys = this.range(2*zBuff-1);
    var join =  function(out,zLevel) {
        return out.concat(make(zLevel));
    }
    var addFirst = this.add.bind(this.first);
    var timesLayers = this.times.bind(nLayers);
    var addRange = this.addRange.bind(this, nLayers);
    var index = [0, zBuff-1, zBuff-2, 2*zBuff-3];

    // Prepare the sources
    DOJO.Source(src_terms);
    keys.push(keys.splice(zBuff-1, 1)[0]);
    this.source = keys.map(addFirst).reduce(join,[]);
    this.index = index.map(timesLayers).map(addRange);
}

DOJO.Stack.prototype = {
    zBuff: 2,
    first: 0,
    preset: [
        {
            set: {},
            src: {}
        },
        {
            set: {opacity: .4},
            src: {segmentation: true}
        }
    ],
    make: function(zLevel, indices) {
        var share = DOJO.Source().share;
        return this.preset.map(function(layer,i){
            var index = indices? indices[i]: undefined;
            var source = new DOJO.Source(share(layer.src, {z:zLevel}));
            return share(share(layer.set, {index:index}), source);
        });
    },
    range: function(end){
        return Object.keys(new Uint8Array(end)).map(Number);
    },
    addRange: function(layers,one) {
        return this.range(layers).map(this.add,one);
    },
    add: function(that) {
        return this + that;
    },
    times: function(that) {
        return this * that;
    }
};