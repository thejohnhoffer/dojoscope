//-----------------------------------
//
// DOJO.Link - Link webGL to OpenSeaDragon
// Calls DOJO.Input
// -- Called by main.js
//-----------------------------------

DOJO.Link = function(scope) {

    this.openSD = scope.openSD;
    this.input = new DOJO.Input(scope);

    this.openSD.addViewerInputHook({
        keyDownHandler: this.input.key.bind(this.input)
    });
}
DOJO.Link.prototype = {

    init: function(){
        this.buttons = ['up','down'].map(this.linkButtons,this);
        this.buttons.map(openSeadragonGL.prototype.button, this.input);
    },
    linkButtons: function(name) {
        return {
            name: name,
            onClick: this.input.waiter.bind(this.input,name)
        }
    }
}