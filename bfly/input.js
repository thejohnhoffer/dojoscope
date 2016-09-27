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
        start: scope.stack.index[0],
        up: scope.stack.index[1],
        down: scope.stack.index[2],
        end: scope.stack.index[3],
    };
    this.swap = function(to){
        var from = this.index.end;
        to.map(w.getItemAt,w).map(function(topItem){
            w.setItemIndex(topItem, w.getItemCount()-1);
        });
        from.map(w.getItemAt,w).map(function(fromItem,i){
            w.setItemIndex(fromItem, to[i]);
        });
    }
    this.lose = function(lost){
        lost.map(w.getItemAt,w).map(w.removeItem,w);
    }
    this.gain = function(offset, index){
        var zLevel = offset + w.getItemAt(w.getItemCount()-1).source.z;
        scope.stack.make(zLevel, index).map(scope.openSD.addTiledImage,scope.openSD);
    }

    this.waiter = function(event) {
        var it = w.getItemAt(this.index[event].slice(-1));
        if (it.lastDrawn.length && it.lastDrawn[0].level >= this.level) {
            return this[event]();
        }
    }
    this.keychain['39'] = this.waiter.bind(this,'up');
    this.keychain['37'] = this.waiter.bind(this,'down');
}

DOJO.Input.prototype = {
    level: 0,
    keychain: {},
    key: function(e){
        var pressed = e.keyCode;
        if (e.shift && pressed in this.keychain) {
            e.preventDefaultAction = true;
            this.keychain[pressed]();
        }
    },
    up: function(){
        this.swap(this.index.up);
        this.lose(this.index.start);
        this.gain(this.zBuff - 1, this.index.end);
    },
    down: function(){
        this.swap(this.index.down);
        this.lose(this.index.end);
        this.gain(1 - this.zBuff, this.index.start);
    },
    leveler: function(e){
      this.level = e.level;
    },
    log: function() {
        this.openSD.world._items.map(function(i){
            log(i.source.z);
        });
        log(' ');
    }
}