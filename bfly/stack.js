//-----------------------------------
//
// DOJO.Stack: Stack some tileSources
// (Needs DOJO.Source)
//-----------------------------------

DOJO.Stack = function(src_terms){

    // For all sources
    DOJO.Source(src_terms);

    // Determine number of tiles above and below
    var total = this.init(this.buffer,this.preset);
    var length = new Uint8Array(total);
    this.range = Object.keys(length);

    // Map zStacks to real indices
    this.zStack = this.range.map(this.zStacker,this);
    this.zMap = this.zStack.reduce(this.zMapper.bind(this),{});
    // Push all the initial sourced layers together
    this.source = this.zStack.reduce(this.zSourcer.bind(this),[]);
}

DOJO.Stack.prototype = {
    buffer: 4,
    first: 10,
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
    init: function(buffer, preset){
        this.nLayers = preset.length;
        return this.nLayers*buffer+this.nLayers-1;
    },
    make: function(z,i) {
        return this.preset.map(function(lay,li){
            var index = i? i[li] : undefined;
            var source = new DOJO.Source(this.share({z:z},lay.src));
            return this.share(source, this.share({index:index},lay.set));
        },this);
    },
    share: DOJO.Source().share,
    slice: function(offZ,offN) {
        var map = [this.zMap, {}][Number(offN<0)];
        return this.make(offZ, map[offN]);
    },
    zSourcer: function(out,lay) {
        return out.concat(this.slice(lay+this.first,-1));
    },
    zMapper: function(map,i) {
        var n = +this.range.slice(i-1, i||undefined);
        map[i]= [this.nLayers*n,this.nLayers*n+1];
        return map;
    },
    zStacker: function(key) {
        return key - this.buffer;
    }
};