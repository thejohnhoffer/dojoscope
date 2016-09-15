//-----------------------------------
//
// J.Link - Link webGL to OpenSeaDragon
// (Needs DOJO.Stack + openSeadragonGL)
//-----------------------------------

DOJO.Link = function(scope) {

    // Make a link to webGL
    var seaGL = new openSeadragonGL(scope.openSD);
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
    this.preset.map(seaGL.button.bind(seaGL));
    seaGL.init();
}
DOJO.Link.prototype = {

    preset: [
        {
            name: 'up',
            onClick: function(){
                var w = this.openSD.world;
                // Lose the tiles two rows down
                w._items.map(i=>log(i.source.z));
                [0,1].map(w.getItemAt, w).map(w.removeItem, w);

//                w._items.map(i=>log(i.source.z));
                // Get new tileSources
            }
        },
        {
            name: 'down',
            onClick: function(){

            }
        }
    ]
}