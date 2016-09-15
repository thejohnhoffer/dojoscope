//-----------------------------------
//
// DOJO.Source: makes tileSources
//
//-----------------------------------

DOJO.Source = function(src_terms){

    this.share(this, src_terms || {});
    // Only for the real tileSources
    if (this instanceof DOJO.Source) {
        var maxLevel = this.width/this.tileSize;
        this.maxLevel = Math.ceil(Math.log2(maxLevel));
        // Get the segmentation string for butterfly
        if (this.segmentation) {
            this.seg = '&segmentation=y&segcolor=y';
        }
        return {tileSource: this.share({}, this)};
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
        var width = this.getTileWidth(level);
        var height = this.getTileHeight(level);
        return 'http://' + this.server + '/data/?datapath=' +
            this.datapath + '&start=' + x*width + ',' + y*height + ',' +
            this.z + '&mip=' + (this.maxLevel - level) + '&size=' +
            width + ',' + height + ',' + 1 + this.seg;
    },
    share: function(to, from) {
        for (var key in from) {
           to[key] = from[key];
        }
        return to;
    }
};
DOJO.Source = DOJO.Source.bind(DOJO.Source.prototype);