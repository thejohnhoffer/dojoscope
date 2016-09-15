//-----------------------------------
//
// DOJO.Stack: Stack some tileSources
// (Needs DOJO.Source)
//-----------------------------------

DOJO.Stack = function(src_terms){
    // For all sources
    DOJO.Source(src_terms);
    // lay all layers in z buffer
    [0,1,0].map(this.slice, this);
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
        var added = [];
        for (var lay of this.preset) {
            var source = this.make(lay,z,i);
            this.layers.push(source);
            added.push(source);
        }
        return added;
    },
    clear: function(layer) {
        this.share(layer,{index:undefined});
    }
};