var DOJO = DOJO || {};
//-----------------------------------
//
// J.Viewer - test webGL overlay atop OpenSeaDragon
//
//-----------------------------------

DOJO.View = function(terms) {

    // preset tile source
    DOJO.Source(terms);

    // Make the two layers
    var lowLayer = new DOJO.Source({
        segment: '',
        layer: 0
    });
    var topLayer = new DOJO.Source({
        segment: '&segmentation=y&segcolor=y',
        layer: 1
    });
    topLayer.opacity = .4;
    // Open a seadragon with two layers
    var openSD = OpenSeadragon({
        tileSources: [lowLayer, topLayer],
        crossOriginPolicy: 'Anonymous',
        prefixUrl: 'images/icons/',
        id: 'viaWebGL'
    });

    // Make a link to webGL
    var seaGL = new openSeadragonGL(openSD);
    seaGL.vShader = 'shaders/vertex/square.glsl';
    seaGL.fShader = 'shaders/fragment/outline.glsl';

    var draw = function(callback, e) {

        if (e.tiledImage.source.layer == 1 && e.tile.loaded !==1) {
            callback(e);
            e.tile.loaded = 1;
        }
    }

    seaGL.addHandler('tile-drawing',draw);

    seaGL.init();
}
