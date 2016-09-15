//-----------------------------------
//
// DOJO.Stack: Stack some tileSources
// (Needs DOJO.Source)
//-----------------------------------

DOJO.Stack = function(src_terms){
    // For all sources
    DOJO.Source(src_terms);
    // lay all layers in z buffer
    this.n = this.preset.length;
    [9,11,10].map(this.slice, this);
    // Clear the index for internal records
    this.layers.map(this.clear, this);
}

DOJO.Stack.prototype = {
    layers: [],
    share: DOJO.Source().share,
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
    make: function(lay,z,i) {
        var set = this.share({index:i},lay.set);
        var src = this.share({z:z},lay.src);
        var source = new DOJO.Source(src);
        return this.share(source, set);
    },
    slice: function(z,i) {
        var index = this.layout(i);
        return this.preset.map(function(ps,pi){
            var source = this.make(ps,z,index[pi]);
            this.layers.push(source);
            return source;
        },this);
    },
    clear: function(layer) {
        this.share(layer,{index:undefined});
    },
    layout: function(n) {
        return [this.n*n,this.n*n+1];
    }
};