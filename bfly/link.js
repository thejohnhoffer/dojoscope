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
                // Lose two stacks down
                var here = this.ask(0,'removeItem');
                // Show the current stack
                this.ask(1,'setItemIndex',0);
                // Gain one stack up

//                this.openSD.world._items.map(i=>log(i.source.z));
                // Get new tileSources
            }
        },
        {
            name: 'down',
            onClick: function(){

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
    ask: function(from, act, to) {
        var args = Array.prototype.slice.call(arguments).map(function(n){
              switch(isNaN(n)){
                  case false: return [2*n,2*n+1];
                  default: return n;
              }
        });
        this._run.apply(this,args);
        return this._run(args[0]);
    },
    _run: function(from,act,to){
        var w = this.openSD.world;
        switch (act) {
          case 'setItemIndex': return this._run(from).map(function(it,i){
              w.setItemIndex(it,to[i]);
          });
          case 'removeItem': return this._run(from).map(w[act],w)
          default: return from.map(w.getItemAt, w);
        }
    }
}