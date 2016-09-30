//-----------------------------------
//
// J.Input - Let people control slices
// -- Called by main.js
//-----------------------------------

DOJO.Input = function(scope) {

    this.osd = scope.openSD;
    this.stack = scope.stack.init(this.osd);
    var seaGL = new openSeadragonGL(this.osd);

    var toolbar = ['up','down'].map(this.button, this);
    var keychain = toolbar.reduce(this.chain,{});
    toolbar.map(seaGL.button, seaGL);
    this.osd.addViewerInputHook({
        keyDownHandler: this.key.bind(keychain)
    });
}

DOJO.Input.prototype = {

    key: function(e){
        e.shift = !e.shift;
        var keychain = this;
        if (e.shift && e.keyCode in keychain) {
            e.preventDefaultAction = true;
            keychain[e.keyCode]();
        }
    },
    event: function(event) {
        var total = this.stack.source.length;
        var slices = this.stack.event(event);
        if (slices.every(this.check.bind(this))) {
            if (total == this.osd.world.getItemCount()) {
                return this[event](this.stack);
            }
        }
    },
    button: function(name) {
        return {
            name: name,
            onClick: this.event.bind(this,name)
        }
    },
    chain: function(o,b,i){
        var key = [38,40][i];
        o[key] = b.onClick;
        return o;
    },
    up: function(stack){
        stack.show(stack.index.up);
        stack.lose(stack.index.start);
        stack.gain(stack.zBuff - 1, stack.index.end);
    },
    down: function(stack){
        stack.show(stack.index.down);
        stack.lose(stack.index.end);
        stack.gain(1 - stack.zBuff, stack.index.start);
    },
    check: function(slice){
        var level = this.stack.level();
        if (slice && slice.lastDrawn.length) {
            return slice.lastDrawn[0].level >= level;
        }
    }
}