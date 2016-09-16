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
    this.buff = (this.firsts.length-1)/2;
    this.firsts.map(this._slice, this);
    // Clear the index for internal records
    this.layers.map(this.clear, this);
}

DOJO.Stack.prototype = {
    layers: [],
    share: DOJO.Source().share,
    firsts: [11,12,13,7,8,9,10],
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
        return this.preset.map(function(ps,pi){
            var source = this.make(ps,z,i[pi]);
            this.layers.push(source);
            return source;
        },this);
    },
    _slice: function(z,i) {
        return this.slice(z,this.bound(i));
    },
    clear: function(layer) {
        this.share(layer,{index:undefined});
    },
    bound: function(n) {
        return [this.n*n,this.n*n+1];
    }
};