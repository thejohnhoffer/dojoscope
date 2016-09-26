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
//        seaGL.addHandler('tile-drawing',this.drawing.bind(seaGL,this.unzip));
        this.openSD.addHandler('update-level',this.input.leveler.bind(this.input));
        seaGL.init();
    },
    linkButtons: function(name) {
        return {
            name: name,
            onClick: this.input.waiter.bind(this.input,name)
        }
    },
    drawing: function(unzip, callback, e) {
        if ('drawn' in e.tile) {
            return;
        }
        if(e.tiledImage.source.segmentation){
            callback = callback.bind(this,e);
            unzip.call(this.viaGL, callback, e);
        };
        e.tile.drawn = 1;
    },
    unzip: function(callback, e){

        var buffer = function(given){
             given.xhr.responseType = 'arraybuffer';
             given.url = e.tile.url;
             return 0;
        }
        var unzip = function(blob){
            var compressed = new Zlib.Inflate(new Uint8Array(blob));
            return compressed.decompress();
        }

        return this.getter.call(buffer).then(unzip).then(callback);
    }
}