//-----------------------------------
//
// DOJO.Stack: Stack some tileSources
//
//-----------------------------------

DOJO.Stack = function() {

}

DOJO.Stack.prototype = {

    init: function(src_terms){
        // For all sources
        DOJO.Source(src_terms);
        // Overlay the two layers
        for (i in this.terms) {
            // for all the depths
            for (var z in new Uint8Array(this.depth)) {
                var source = new DOJO.Source(this.src[i%2]);
                this.share(source, this.terms[i]);
                this.layers.push(source);
            }
        }
    },
    share: DOJO.Source().share,
    src: [{},{segmentation: true}],
    terms: [{},{opacity: .4}],
    layers: [],
    depth: 1
};