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
    share: DOJO.Source().share,
    init: function(buffer, preset){
        this.nLayers = preset.length;
        return this.nLayers*buffer+this.nLayers-1;
    },
    make: function(zLevel, index) {
        return this.preset.map(function(lay,li){
            var source = new DOJO.Source(this.share({z:zLevel},lay.src));
            return this.share(source, this.share({index:index[li]},lay.set));
        },this);
    },
    zSourcer: function(out,lay) {
        return out.concat(this.make(this.first+lay, this.zMap[lay]));
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