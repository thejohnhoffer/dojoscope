var DOJO = DOJO || {};

//-----------------------------------
//
// DOJO.Sourcer: makes tileSources
//
//-----------------------------------

DOJO.Sourcer = function(terms) {

    // presets
    this.mip = 1;
    this.z = 199;
    this.layer = 0;
    this.depth = 1;
    this.alpha = 0.6;
    this.minLevel = 0;
    this.width = 1024;
    this.segment = '';
    this.height = 1024;
    this.tileSize = 512;
    this.server = 'localhost:2001';
    this.datapath = '/Volumes/NeuroData/mojo';

    // Add new terms
    for (var key in terms) {
        this[key] = terms[key];
    }
    this.maxLevel = Math.min(this.mip, Math.ceil(Math.log2(this.width/this.tileSize)));
}

DOJO.Sourcer.prototype = {

    make: function(terms) {
       var made = {};
       made.getTileUrl = this.getTileUrl;
       [this,terms].forEach(function(which){
          Object.keys(which).forEach(function(key){
              made[key] = which[key];
          });
       });
       return made;
    },
    getTileUrl: function( level, x, y ) {
        var width = this.getTileWidth(level);
        var height = this.getTileHeight(level);
        return 'http://' + this.server + '/data/?datapath=' + this.datapath + '&start=' +
            x*width + ',' + y*height + ',' + this.z + '&mip=' + (this.maxLevel - level) +
            '&size=' + width + ',' + height + ',' + this.depth + this.segment
    }
}