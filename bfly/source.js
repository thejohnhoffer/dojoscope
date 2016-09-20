//-----------------------------------
//
// DOJO.Source: makes tileSources
// -- Called by DOJO.Stack
//-----------------------------------

DOJO.Source = function(src_terms){

    this.share(src_terms || {}, this);
    // Only for the real tileSources
    if (this instanceof DOJO.Source) {
        var maxLevel = this.width/this.tileSize;
        this.maxLevel = Math.ceil(Math.log2(maxLevel));
        // Get the segmentation string for butterfly
        if (this.segmentation) {
            this.seg = '&segmentation=y&segcolor=y';
        }
        return {tileSource: this.share(this, {})};
    }
    return this;
}

DOJO.Source.prototype = {
    z: 0,
    seg: '',
    minLevel: 0,
    width: 8096,
    height: 8096,
    tileSize: 512,
    server: 'localhost:2001',
    datapath: '/Volumes/NeuroData/cylindojo/mojo',
    getTileUrl: function( level, x, y ) {
        var settings = '';
        return 'http://' + this.server + "/api/node/" + 0 + "/" +
            settings + "/tile/" + this.z + "/" + level + "/" +
            x + "_" + y + "_" + 1;
    },
    share: function(from, to) {
        for (var key in from) {
           to[key] = from[key];
        }
        return to;
    }
};
DOJO.Source = DOJO.Source.bind(DOJO.Source.prototype);