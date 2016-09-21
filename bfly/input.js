//-----------------------------------
//
// J.Input - Let people control slices
// -- Called by DOJO.link
//-----------------------------------

DOJO.Input = function(scope) {

    var w = scope.openSD.world;
    this.openSD = scope.openSD;
    this.zBuff = scope.stack.zBuff;

    this.index = {
        up: scope.stack.index.up,
        down: scope.stack.index.down,
        start: scope.stack.index.start,
        end: scope.stack.index.end,
    };
    this.swap = function(to){
        var from = this.index.end;
        to.map(w.getItemAt,w).map(function(topItem){
            w.setItemIndex(topItem, w.getItemCount()-1);
        });
        from.map(w.getItemAt,w).map(function(fromItem,i){
            w.setItemIndex(fromItem, to[i]);
        })
    }
    this.lose = function(lost){
        lost.map(w.getItemAt,w).map(w.removeItem,w);
    }
    this.gain = function(offset, index){
        var zLevel = offset + w.getItemAt(w.getItemCount()-1).source.z;
        scope.stack.make(zLevel, index).map(scope.openSD.addTiledImage,scope.openSD);
    }

    this.waiter = function(event) {
        var it = w.getItemAt(this.index[event][1]);
        if (!('waiting' in this) || this.waiting == it.source.z){
            if (it.lastDrawn.length && it.lastDrawn[0].level >= this.level) {
                return this[event]();
            }
            it.waiting = this.waiter.bind(this,event);
            this.waiting = it.source.z;
        }
    }
}

DOJO.Input.prototype = {
    level: 0,
    keychain: {},
    up: function(){
        this.swap(this.index.up);
        this.lose(this.index.start);
        this.gain(this.zBuff, this.index.end);
    },
    down: function(){
        this.swap(this.index.down);
        this.lose(this.index.end);
        this.gain(-this.zBuff, this.index.start);
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