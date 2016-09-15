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

    // Add WebGL Drawing and Layer Buttons
    seaGL.addHandler('tile-drawing',this.draw);
    this.preset.map(seaGL.button, this);
    seaGL.init();
}
DOJO.Link.prototype = {

    preset: [
        {
            name: 'up',
            onClick: function(){

                // Lose the downmost stack
                this.ask(0,'removeItem');
                // Show the current stack
                this.ask(1,'setItemIndex',0);
                // Gain the upmost stack
                var up = this.stack.slice(this.getZ(1),this.getN(-1))
                up.map(this.openSD.addTiledImage,this.openSD);
            }
        },
        {
            name: 'down',
            onClick: function(){
                // Lose the upmost stack
                this.ask(1,'removeItem');
                // Show the current stack
                this.ask(1,'setItemIndex',0);
                // Gain the downmost stack
                var down = this.stack.slice(this.getZ(-1),this.getN(-2));
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
    getN: function(offN){
        return this.openSD.world.getItemCount()/this.stack.n + (offN || 0);
    },
    getZ: function(offZ,offN,layer){
        return this.ask(this.getN(offN)-1)[layer || 0].source.z  + (offZ || 0);
    },
    ask: function(from, act, to) {
        var args = Array.prototype.slice.call(arguments).map(function(n){
              switch(isNaN(n)){
                  case false: return this.stack.layout(n);
                  default: return n;
              }
        },this);
        return this._run.apply(this,args);
    },
    _log: function() {
        console.clear();
        this.openSD.world._items.map(i=>log(i.source.z));
        log([this.getZ(-1),this.getN(-2)])
    },
    _run: function(from,act,to){
        var w = this.openSD.world;
        switch (act) {
          case 'setItemIndex': return this._run(from).map(function(it,i){
              w.setItemIndex(it,to[i]);
          });
          case 'removeItem': return this._run(from).map(w[act],w);
          default: return from.map(w.getItemAt, w);
        }
    }
}