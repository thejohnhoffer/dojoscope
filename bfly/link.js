//-----------------------------------
//
// J.Link - Link webGL to OpenSeaDragon
// (Needs DOJO.Stack + openSeadragonGL)
//-----------------------------------

DOJO.Link = function(scope) {

    // Make a link to webGL
    var seaGL = new openSeadragonGL(scope.openSD);
    seaGL.fShader = 'shaders/fragment/outline.glsl';
    seaGL.vShader = 'shaders/vertex/square.glsl';
    this.openSD = seaGL.openSD;
    this.stack = scope.stack;
    this.buff = this.stack.buffer-1;
    this.overflow = this.buff+1;
    this.zMap = this.stack.zMap;

    // Add WebGL Drawing and Layer Buttons
    seaGL.addHandler('tile-drawing',this.draw);
    this.preset.map(seaGL.button, this);
    seaGL.init();
}
DOJO.Link.prototype = {

    _log: function() {
//        console.clear();
//        log(this.getN(1))
        this.openSD.world._items.map(i=>log(i.source.z));
        log(' ')
    },
    preset: [
        {
            name: 'up',
            onClick: function(){
                // Show the new stack
                this.show(1);
                // Lose the downmost stack
                this.lose(-this.overflow);
                // Gain the upmost stack
                var up = this.gain(this.buff,this.buff)
                up.map(this.openSD.addTiledImage,this.openSD);
            }
        },
        {
            name: 'down',
            onClick: function(){
//                this._log();
                // Hide the old Stack
                this.hide(0);
                // Lose the upmost stack
                this.lose(this.overflow);
                // Gain the downmost stack
                var down = this.gain(-this.buff,this.overflow)
                down.map(this.openSD.addTiledImage,this.openSD);
            }
        }
    ],
    draw: function(callback, e) {

        if (!('drawn' in e.tile)) {
            e.tile.drawn = true;
            if (e.tiledImage.source.segmentation) {
                callback(e);
            }
        }
    },
    gain: function(offZ,offN){
        return this.stack.slice(this.getZ(offZ),offN);
    },
    getZ: function(offZ){
        return this.get(0)[0].source.z  + offZ;
    },
    show: function(where) {
        var w = this.openSD.world;
        var c = w.getItemCount()-1;
        this.get(where).map(function(it){
            w.setItemIndex(it, c);
        });
    },
    hide: function(where) {
        var w = this.openSD.world;
        this.get(where).map(w.setItemIndex,w);
    },
    lose: function(where) {
        var w = this.openSD.world;
        this.get(where).map(w.removeItem,w);
    },
    get: function(where){
                    log(where,3)
        var n = this.zMap[where];
        var w = this.openSD.world;
        return n.map(w.getItemAt, w);
    }
}