//-----------------------------------
//
// DOJO.Link - Link webGL to OpenSeaDragon
// Calls DOJO.Input + openSeadragonGL
// -- Called by main.js
//-----------------------------------

DOJO.Link = function(scope) {

    this.input = new DOJO.Input(scope);
//    window.addEventListener('keyup',this.input.key.bind(this.input));
    this.buttons = ['up','down'].map(this.linkButtons,this);
    this.openSD = scope.openSD;
}
DOJO.Link.prototype = {

    init: function(){
        // Make a link to webGL
        var seaGL = new openSeadragonGL(this.openSD);
        seaGL.fShader = 'shaders/fragment/outline.glsl';
        seaGL.vShader = 'shaders/vertex/square.glsl';

        // Add WebGL Drawing and Layer Buttons
        seaGL.addHandler('tile-loaded',this.load);
        this.buttons.map(seaGL.button, this.input);
        this.openSD.addHandler('update-level',this.input.leveler.bind(this.input));
        seaGL.init();
    },
    load: function(callback, e) {
        if (e.image && e.tiledImage.source.segmentation) {
            callback(e);
            if ('waiting' in e.tiledImage) {
                e.tiledImage.waiting();
                delete e.tiledImage.waiting;
            }
        }
    },
    linkButtons: function(name) {
        return {
            name: name,
            onClick: this.input.waiter.bind(this.input,name)
        }
    }
}