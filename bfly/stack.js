//-----------------------------------
//
// DOJO.Stack: Stack some tileSources
// Calls DOJO.Source
// -- Called by main.js
//-----------------------------------

DOJO.Stack = function(src_terms){

    var first = 3
    var make = this.make.bind(this);
    var flat = function(out,index) {
        return out.concat(make(+index+first, [undefined,undefined]));
    };
    // Prepare the sources
    DOJO.Source(src_terms);
    this.nLayers = this.preset.length;
    // Map z offset to tiledImage indices
    var range = Object.keys(new Uint8Array(2*this.zBuff-1));
    range.push(range.splice(this.zBuff-1, 1)[0]);
    this.source = range.reduce(flat,[]);
}

DOJO.Stack.prototype = {
    zBuff: 2,
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
    make: function(zLevel, index) {
        return this.preset.map(function(layer,i){
            var source = new DOJO.Source(this.share(layer.src, {z:zLevel}));
            return this.share(this.share(layer.set, {index:index[i]}), source);
        },this);
    },
    share: DOJO.Source().share
};