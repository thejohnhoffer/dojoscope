//-----------------------------------
//
// DOJO.Link - Link webGL to OpenSeaDragon
// Calls DOJO.Input + openSeadragonGL
// -- Called by main.js
//-----------------------------------

DOJO.Link = function(scope) {

    this.input = new DOJO.Input(scope);
    window.addEventListener('keyup',this.input.key.bind(this.input));
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
        this.buttons.map(seaGL.button, this.input);
        seaGL.addHandler('tile-drawing',this.drawing.bind(seaGL,this.zip));
        this.openSD.addHandler('update-level',this.input.leveler.bind(this.input));
        seaGL.init();
    },
    linkButtons: function(name) {
        return {
            name: name,
            onClick: this.input.waiter.bind(this.input,name)
        }
    },
    drawing: function(zip, callback, e) {
        if ('drawn' in e.tile) {
            return;
        }
        if(e.tiledImage.source.segmentation){
            callback = callback.bind(this,e);
            zip.call(this, callback, e);
        };
        e.tile.drawn = 1;
    },
    zip: function(callback, e){

        var viaGL = this.viaGL;
        var buffer = function(_,bid){
             bid.responseType = 'arraybuffer';
             return 0;
        }
        var unzip = function(blob){
            var compressed = new Zlib.Inflate(new Uint8Array(blob));
            return compressed.decompress();
        }

        viaGL.getter.call(buffer,e.tile.url).then(unzip).then(callback);
    }
}