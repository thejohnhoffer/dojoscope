//-----------------------------------
//
// DOJO.Sourcer: makes tileSources
//
//-----------------------------------

DOJO.Source = function(terms){
    var share = function(to, from) {
        for (var key in from) {
           to[key] = from[key];
        }
        return to;
    }
    share(this, terms);
    // Only for the real tileSources
    if (this instanceof DOJO.Source) {
        this.seg = '';
        var maxLevel = this.width/this.tileSize;
        this.maxLevel = Math.ceil(Math.log2(maxLevel));
        // Get the segmentation string for butterfly
        for (var term of ['segmentation','segcolor'].filter(this.hasOwnProperty, this)) {
            var which = {false:'=n',true:'=y'}[this[term]];
            this.seg = this.seg.concat('&'+term+which);
        }
        return {tileSource: share({}, this)};
    }
}

DOJO.Source.prototype = {
    z: 0,
    minLevel: 0,
    width: 8096,
    height: 8096,
    tileSize: 512,
    server: 'localhost:2001',
    datapath: '/Neurodata/mojo',
    getTileUrl: function( level, x, y ) {
        var width = this.getTileWidth(level);
        var height = this.getTileHeight(level);
        return 'http://' + this.server + '/data/?datapath=' +
            this.datapath + '&start=' + x*width + ',' + y*height + ',' +
            this.z + '&mip=' + (this.maxLevel - level) + '&size=' +
            width + ',' + height + ',' + 1 + this.seg;
    }
};
DOJO.Source = DOJO.Source.bind(DOJO.Source.prototype);