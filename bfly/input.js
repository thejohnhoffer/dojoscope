//-----------------------------------
//
// J.Input - Let people control slices
// (Needs DOJO.Stack + openSeadragonGL)
// -- Called by DOJO.link
//-----------------------------------

DOJO.Input = function(scope) {

    var w = scope.openSD.world;
    this.zMap = scope.stack.zMap;
    this.buff = scope.stack.buffer;
    this.get = w.getItemAt.bind(w);
    this.lose = w.removeItem.bind(w);
    this.hide = w.setItemIndex.bind(w);
    this.openSD = scope.openSD;

    this.show = function(it){
        return w.setItemIndex(it, w.getItemCount()-1);
    };
    this.getZ = function(offset){
        return this.get(w.getItemCount()-1).source.z+offset;
    };
    this.gain = function(index){
        var made = scope.stack.make(this.getZ(index), this.zMap[index]);
        return made.map(scope.openSD.addTiledImage,scope.openSD);
    };
    this.go = function(func, where){
        return this.zMap[where].map(this.get).map(func,this);
    };
}

DOJO.Input.prototype = {
    up : function(){
        this.log();
        // Show new stack and lose downmost stack
        this.go(this.show, 1);
        this.go(this.lose, this.buff);
        // Gain the upmost stack
        this.gain(this.buff);
    },
    down : function(){
        this.log();
        // Hide old stack and lose the upmost stack
        this.go(this.hide, 0);
        this.go(this.lose, -this.buff);
        // Gain the downmost stack
        this.gain(-this.buff);
    },
    log: function() {
        console.clear();
        this.openSD.world._items.map(function(i){
            log(i.source.z);
        });
        log(' ');
    }
}