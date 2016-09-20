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
    this.waiting = false;
    this.nexts = {
        up: this.zMap[+1][1],
        down: this.zMap[-1][1]
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
    this.waiter = function(event) {
        if (this.waiting){
            log('too much!')
            return;
        }
        var it = this.get(this.nexts[event]);
        if (it.lastDrawn.length) {
            return this[event]();
        }
        it.waiting = this[event].bind(this);
        this.waiting = true;
    }
    this.keychain.ArrowUp = this.waiter.bind(this,'up');
    this.keychain.ArrowDown = this.waiter.bind(this,'down');
}

DOJO.Input.prototype = {
    keychain: {},
    key: function(e){
        if (e.key in this.keychain) {
            this.keychain[e.key]();
        }
    },
    up: function(){
        // Show one stack up
        this.go('show', 1);
        this.slice(+1);
    },
    down: function(){
        // Hide upper stack
        this.go('hide', 0);
        this.slice(-1);
    },
    slice: function(sign){
        // Out with the old, in with the new
        this.go('lose', sign*this.buff);
        this.gain(sign*this.buff);
        this.waiting = false;
    },
    log: function() {
        console.clear();
        this.openSD.world._items.map(function(i){
            log(i.source.z);
        });
        log(' ');
    }
}