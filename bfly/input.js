//-----------------------------------
//
// J.Input - Let people control slices
// -- Called by main.js
//-----------------------------------

DOJO.Input = function(scope) {

    this.osd = scope.openSD;
    this.stack = scope.stack.init(this.osd);
    var seaGL = new openSeadragonGL(this.osd);

    var buttons = ['up','down'].map(this.button, this);
    buttons.map(seaGL.button, seaGL);
    this.osd.addViewerInputHook({
        keyDownHandler: this.key.bind(this)
    });
}

DOJO.Input.prototype = {

    key: function(e){
        e.shift = !e.shift;
        var keychain = {
            38: this.event.bind(this,'up'),
            40: this.event.bind(this,'down')
        };
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
    button: function(name) {
        return {
            name: name,
            onClick: this.event.bind(this,name)
        }
    },
    check: function(slice){
        var level = this.stack.level();
        if (slice && slice.lastDrawn.length) {
            return slice.lastDrawn[0].level >= level;
        }
    }
}