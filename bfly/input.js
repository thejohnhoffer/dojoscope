//-----------------------------------
//
// J.Input - Let people control slices
// -- Called by DOJO.link
//-----------------------------------

DOJO.Input = function(scope) {

    var w = scope.openSD.world;
    this.openSD = scope.openSD;
    this.zMap = scope.stack.zMap;
    this.buff = scope.stack.buffer;
    this.get = w.getItemAt.bind(w);
    this.lose = w.removeItem.bind(w);
    this.hide = w.setItemIndex.bind(w);

    this.test = function(it) {
      log(it.source.tileExists(0, 0, 0))
    }
    this.show = function(it){
        return w.setItemIndex(it, w.getItemCount()-1);
    }
    this.go = function(func, where){
        return this.zMap[where].map(this.get).map(this[func],this);
    }
    this.gain = function(index){
        var z = this.get(w.getItemCount()-1).source.z+index;
        var nextSlice = scope.stack.make(z, this.zMap[index]);
        return nextSlice.map(scope.openSD.addTiledImage,scope.openSD);
    }
}

DOJO.Input.prototype = {
    up : function(){
        this.go('test', 1);
        // Show one stack up
        this.go('show', 1);
        this.slice(+1);
    },
    down : function(){
        // Hide upper stack
        this.go('hide', 0);
        this.slice(-1);
    },
    slice : function(sign){
        // Out with the old, in with the new
        this.go('lose', sign*this.buff);
        this.gain(sign*this.buff);
    },
    log: function() {
        console.clear();
        this.openSD.world._items.map(function(i){
            log(i.source.z);
        });
        log(' ');
    }
}