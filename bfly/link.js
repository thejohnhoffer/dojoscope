//-----------------------------------
//
// J.Link - Link webGL to OpenSeaDragon
// (Needs DOJO.Stack + openSeadragonGL)
//-----------------------------------

DOJO.Link = function(scope) {

    this.stack = scope.stack;
    this.openSD = scope.openSD;
    this.buff = this.stack.buffer;
    this.zMap = this.stack.zMap;

    // Make a link to webGL
    var seaGL = new openSeadragonGL(this.openSD);
    this.stack.source.map(this.openSD.addTiledImage,this.openSD);

    seaGL.fShader = 'shaders/fragment/outline.glsl';
    seaGL.vShader = 'shaders/vertex/square.glsl';

    // Add WebGL Drawing and Layer Buttons
    seaGL.addHandler('tile-drawing',this.draw);
    this.preset.map(seaGL.button, this);
    seaGL.init();
}
DOJO.Link.prototype = {

    _log: function() {
        this.openSD.world._items.map(i=>log(i.source.z));
        log(' ')
    },
    preset: [
        {
            name: 'up',
            onClick: function(){
                this.z = this.getZ();
                // Show new stack and lose downmost stack
                this.show(1);
                this.lose(this.buff);
                // Gain the upmost stack
                var up = this.gain(this.buff);
                up.map(this.openSD.addTiledImage,this.openSD);
            }
        },
        {
            name: 'down',
            onClick: function(){
                // Hide old stack and lose the upmost stack
                this.hide(0);
                this.lose(-this.buff);
                // Gain the downmost stack
                var down = this.gain(-this.buff)
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
    gain: function(index){
        return this.stack.make(this.getZ(index), this.zMap[index]);
    },
    getZ: function(offZ){
        var w = this.openSD.world;
        var c = w.getItemCount()-1;
        return w.getItemAt(c).source.z+offZ;
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
        var n = this.zMap[where];
        var w = this.openSD.world;
        return n.map(w.getItemAt, w);
    }
}