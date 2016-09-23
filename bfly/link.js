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
    drawing: function(zip, _, e) {
        if ('drawn' in e.tile) {
            return;
        }
        e.tile.drawn = 1;
//        var input = e.rendered.canvas;
        if(e.tiledImage.source.segmentation){
            zip(e.tile.url,this.viaGL).then(function(result){
                var input = e.rendered.canvas;
                e.rendered.drawImage(result, 0, 0, input.width, input.height);
            });
        };
    },
    zip: function(url,viaGL){

        var getter = function(where) {
            return new Promise(function(done){
                var bid = new XMLHttpRequest();
                var win = function(){
                    if (bid.status == 200) {
                        return done(bid.response);
                    }
                    return done(where);
                };
                bid.onerror = bid.onload = win;
                bid.responseType = 'arraybuffer';
                bid.open('GET', where, true);
                bid.send();
            });
        }

        var unzipper = function(blob){
            var compressed = new Zlib.Inflate(new Uint8Array(blob));
            return compressed.decompress();
        }

        return getter(url).then(unzipper).then(function(raw){
            return viaGL.toCanvas(raw);
        }.bind(this));
    }
}