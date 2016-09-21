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
    this.total = scope.stack.total;
    this.nexts = {
        up: this.zMap[+1][1],
        down: this.zMap[-1][1]
    };
    this.get = w.getItemAt.bind(w);
    this.lose = w.removeItem.bind(w);
    this.hide = w.setItemIndex.bind(w);
    this.count = w.getItemCount.bind(w);
    this.show = function(it){
        return w.setItemIndex(it, this.count()-1);
    }
    this.go = function(func, where){
        return this.zMap[where].map(this.get).map(this[func],this);
    }
    this.gain = function(index){
        var z = this.get(this.count()-1).source.z+index;
        var nextSlice = scope.stack.make(z, this.zMap[index]);
        return nextSlice.map(scope.openSD.addTiledImage,scope.openSD);
    }
    this.waiter = function(event) {
        var it = this.get(this.nexts[event]);
        if (!('waiting' in this) || this.waiting == it.source.z){
            if (it.lastDrawn.length && it.lastDrawn[0].level >= this.level) {
                return this[event]();
            }
            it.waiting = this.waiter.bind(this,event);
            this.waiting = it.source.z;
        }
    }
    this.keychain.ArrowUp = this.waiter.bind(this,'up');
    this.keychain.ArrowDown = this.waiter.bind(this,'down');
}

DOJO.Input.prototype = {
    level: 0,
    keychain: {},
    key: function(e){
        if (e.key in this.keychain) {
            this.keychain[e.key]();
        }
    },
    up: function(){
        this.go('show', 1);
        this.go('lose', 0);
    },
    down: function(){

        this.go('hide', 0);
        this.go('lose',-1);
    },
    slice: function(sign){
        // Out with the old, in with the new
        this.go('lose', sign*this.buff);
        this.gain(sign*this.buff);
        delete this.waiting;
    },
    leveler: function(e){
      this.level = e.level;
    },
    log: function() {
        console.clear();
        this.openSD.world._items.map(function(i){
            log(i.source.z);
        });
        log(' ');
    }
}