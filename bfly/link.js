//-----------------------------------
//
// J.Link - Link webGL to OpenSeaDragon
// (Needs openSeadragonGL)
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
                var earth = this.openSD.world;
                var two_down = [0,1].map(earth.getItemAt, earth);
                two_down.map(earth.removeItem, earth);
                // Lose the tiles two rows down
                console.log(earth._items)
//                earth.removeItem()
            }
        },
        {
            name: 'down',
            onClick: function(){

            }
        }
    ]
}