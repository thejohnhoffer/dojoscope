//-----------------------------------
//
// J.Input - Let people control slices
// -- Called by DOJO.link
//-----------------------------------

DOJO.Input = function(scope) {

    var w = scope.openSD.world;
    this.openSD = scope.openSD;
    this.zBuff = scope.stack.zBuff;
    this.index = scope.stack.index;
    this.total = scope.stack.source.length;
    this.maxLevel = scope.stack.source[0].tileSource.maxLevel;

    this.show = function(shown){
        shown.map(w.getItemAt,w).map(function(shownItem){
            w.setItemIndex(shownItem, w.getItemCount()-1);
        });
        this.index.end.map(w.getItemAt,w).map(function(lastItem,i){
            w.setItemIndex(lastItem, shown[i]);
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
        var z = Math.max(this.openSD.viewport.getZoom(),1);
        var level = Math.min(Math.ceil(Math.log(z)/Math.LN2),this.maxLevel);
        if (it && it.lastDrawn.length && it.lastDrawn[0].level >= level) {
            if (this.total == w.getItemCount()) {
                return this[event]();
            }
        }
    }
    this.keychain['38'] = this.waiter.bind(this,'up');
    this.keychain['40'] = this.waiter.bind(this,'down');
}

DOJO.Input.prototype = {
    keychain: {},
    key: function(e){
        e.shift = !e.shift;
        var pressed = e.keyCode;
        if (e.shift && pressed in this.keychain) {
            e.preventDefaultAction = true;
            this.keychain[pressed]();
        }
    },
    up: function(){
        this.log()
        this.show(this.index.up);
        this.lose(this.index.start);
        this.gain(this.zBuff - 1, this.index.end);
    },
    down: function(){
        this.show(this.index.down);
        this.lose(this.index.end);
        this.gain(1 - this.zBuff, this.index.start);
    },
    log: function() {
        this.openSD.world._items.map(function(i){
            log(i.source.z);
        });
        log(' ');
    }
}