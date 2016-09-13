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
        var maxLevel = this.width/this.tileSize;
        this.maxLevel = Math.ceil(Math.log2(maxLevel));
        return {tileSource: share({}, this)};
    }
}

DOJO.Source.prototype = {
    z: 0,
    layer: 0,
    minLevel: 0,
    width: 8096,
    height: 8096,
    tileSize: 512,
    server: 'localhost:2001',
    datapath: '/home/d/data/alyssa_large/mojo',
    getTileUrl: function( level, x, y ) {
        var width = this.getTileWidth(level);
        var height = this.getTileHeight(level);
        return 'http://' + this.server + '/data/?datapath=' +
            this.datapath + '&start=' + x*width + ',' + y*height + ',' +
            this.z + '&mip=' + (this.maxLevel - level) + '&size=' +
            width + ',' + height + ',' + 1 + this.segment
    }
};
DOJO.Source = DOJO.Source.bind(DOJO.Source.prototype);