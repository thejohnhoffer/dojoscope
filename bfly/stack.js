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
}

DOJO.Stack.prototype = {
    layers: [],
    share: DOJO.Source().share,
    preset: [
        {
            set: {},
            src: {z: 0}
        },
        {
            set: {opacity: .4},
            src: {z: 0, segmentation: true}
        }
    ],
    make: function(lay) {
        var source = new DOJO.Source(lay.src);
        return this.share(source, lay.set);
    },
    slice: function(z) {
        for (var lay of this.preset) {
            var source = this.make(lay);
            source.tileSource.z = z;
            this.layers.push(source);
        }
    }
};