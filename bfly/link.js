var DOJO = DOJO || {};
//-----------------------------------
//
// J.Link - Link webGL to OpenSeaDragon
//
//-----------------------------------

DOJO.Link = function(openSD) {

    // Make a link to webGL
    var seaGL = new openSeadragonGL(openSD);
    seaGL.vShader = 'shaders/vertex/square.glsl';
    seaGL.fShader = 'shaders/fragment/outline.glsl';

    var draw = function(callback, e) {

        if ('drawn' in e.tile) {
            return;
        }
        if (e.tiledImage.source.segmentation) {
            callback(e);
        }
        e.tile.drawn = true;
    }

    seaGL.addHandler('tile-drawing',draw);

    seaGL.init();
}
