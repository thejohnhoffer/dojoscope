var DOJO = DOJO || {};
//-----------------------------------
//
// J.Viewer - test webGL overlay atop OpenSeaDragon
//
//-----------------------------------

DOJO.Viewer = function(terms) {

    // preset tile source
    this.base = new DOJO.Sourcer(terms);
}

DOJO.Viewer.prototype.init = function() {

    // Make the two layers
    var lowLayer = new this.base({
        segment: '',
        layer: 0
    });
    var topLayer = new this.base({
        segment: '&segmentation=y&segcolor=y',
        layer: 1
    });
    console.log(lowLayer);
    // Open a seadragon with two layers
    var openSD = OpenSeadragon({
        tileSources: [lowLayer,topLayer],
        crossOriginPolicy: 'Anonymous',
        prefixUrl: 'images/icons/',
        id: 'viaWebGL'
    });

    // Make a link to webGL
    var seaGL = new openSeadragonGL(openSD);
    seaGL.vShader = 'shaders/vertex/square.glsl';
    seaGL.fShader = 'shaders/fragment/outline.glsl';

    var load = function(callback, e) {

        var source = e.tiledImage.source;
        if (source.layer == 1) {
            // via webGL
            callback(e);
        }
    }

    var draw = function(callback, e) {

        if (e.tile.loaded !==1) {
            load(callback, e);
            e.tile.loaded = 1;
        }
    }

    seaGL.addHandler('tile-drawing',draw);

    seaGL.init();
}



var DOJO = DOJO || {};

//-----------------------------------
//
// DOJO.Sourcer: makes tileSources
//
//-----------------------------------

DOJO.Sourcer = function(terms) {

    var source = function(terms) {
        this.share(terms);
        return {tileSource: this.tileSource}
    }
    this.share(terms);
    source.prototype.share = this.share;
    source.prototype.tileSource = this.tileSource;
    return source;
}

DOJO.Sourcer.prototype = {

    tileSource: {
        z: 0,
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
        },
    },
    share: function(terms) {
        var ts = 'tileSource';
        for (var t in terms) {
            this[ts][t] = terms[t];
        }
    }
}
