//-----------------------------------
//
// DOJO.Link - Link webGL to OpenSeaDragon
// (Needs DOJO.Stack + openSeadragonGL)
// -- Called by main.js
//-----------------------------------

DOJO.Link = function(scope) {

    var w = scope.openSD.world;
    this.get = w.getItemAt.bind(w);
    this.lose = w.removeItem.bind(w);
    this.hide = w.setItemIndex.bind(w);
    this.count = w.getItemCount.bind(w);
    this.show = function(it){
        return w.setItemIndex(it, this.count()-1);
    };
    this.getZ = function(offset){
        return this.get(this.count()-1).source.z+offset;
    };
    this.gain = function(index){
        var made = scope.stack.make(this.getZ(index), this.zMap[index]);
        return made.map(scope.openSD.addTiledImage,scope.openSD);
    };
    this.go = function(func, where){
        return this.zMap[where].map(this.get).map(func,this);
    };
    this.openSD = scope.openSD;
    this.zMap = scope.stack.zMap;
    this.buff = scope.stack.buffer;
}
DOJO.Link.prototype = {

    init: function(){
        // Make a link to webGL
        var seaGL = new openSeadragonGL(this.openSD);
        seaGL.fShader = 'shaders/fragment/outline.glsl';
        seaGL.vShader = 'shaders/vertex/square.glsl';

        // Add WebGL Drawing and Layer Buttons
        seaGL.addHandler('tile-drawing',this.draw);
        this.buttons.map(seaGL.button, this);
        seaGL.init();
    },
    buttons: [
        {
            name: 'up',
            onClick: function(){
                this.log();
                // Show new stack and lose downmost stack
                this.go(this.show, 1);
                this.go(this.lose, this.buff);
                // Gain the upmost stack
                this.gain(this.buff);
            }
        },
        {
            name: 'down',
            onClick: function(){
                this.log();
                // Hide old stack and lose the upmost stack
                this.go(this.hide, 0);
                this.go(this.lose, -this.buff);
                // Gain the downmost stack
                this.gain(-this.buff);
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
    log: function() {
        console.clear();
        this.openSD.world._items.map(function(i){
            log(i.source.z);
        });
        log(' ');
    }
}