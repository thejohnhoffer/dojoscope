//-----------------------------------
//
// DOJO.RealTime - WebGL Annimation
// Calls DOJO.RealTime
// -- Called by main.js
//-----------------------------------


DOJO.RealTime = function(seaGL) {
    seaGL.vShader = './shaders/vertex/square.glsl';
    seaGL.fShader = './shaders/fragment/outline.glsl';
    this.seaGL = seaGL;
}

DOJO.RealTime.prototype = {
    init: function(){
        var handles = this.handles.bind(this);
        return this.seaGL.init().then(handles);
    },
    handles: function(){
        log('callback hell');
    }
}