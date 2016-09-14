//-----------------------------------
//
// DOJO.Stack: Stack some tileSources
//    (Needs DOJO.Source)
//-----------------------------------

DOJO.Stack = function(src_terms){
    // For all sources
    DOJO.Source(src_terms);
    // lay layers in z buffer
    for (var z in [-1,1,0]) {
        for (var lay of this.preset) {
            log(lay);
            var source = new DOJO.Source(lay.src);
            this.share(source, lay.set);
            this.layers.push(source);
        }
    }
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
    ]
};