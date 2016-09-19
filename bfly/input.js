//-----------------------------------
//
// J.Input - Let people control slices
// (Needs DOJO.Stack + openSeadragonGL)
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

    this.show = function(it){
        return w.setItemIndex(it, w.getItemCount()-1);
    };
    this.go = function(func, where){
        return this.zMap[where].map(this.get).map(func,this);
    };
    this.gain = function(index){
        var z = this.get(w.getItemCount()-1).source.z+index;
        var nextSlice = scope.stack.make(z, this.zMap[index]);
        return nextSlice.map(scope.openSD.addTiledImage,scope.openSD);
    };
}

DOJO.Input.prototype = {
    up : function(){
        this.log();
        // Show one stack up
        this.go(this.show, 1);
        this.slice(+1);
    },
    down : function(){
        this.log();
        // Hide upper stack
        this.go(this.hide, 0);
        this.slice(-1);
    },
    slice : function(sign){
        // Out with the old, in with the new
        this.go(this.lose, sign*this.buff);
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