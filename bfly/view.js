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
    var lowLayer = new DOJO.Source({});
    var topLayer = new DOJO.Source({
        segmentation: true,
        segcolor: true
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
        var layer = e.tiledImage;
        var earth = e.eventSource.world;
//        console.log(e.rendered.canvas.width);
        if (earth.getIndexOfItem(layer) == 1 && e.tile.loaded !==1) {
            e.tile.loaded = 1;
            callback(e);
        }
    }

    seaGL.addHandler('tile-drawing',draw);

    seaGL.init();
}
