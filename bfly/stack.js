//-----------------------------------
//
// DOJO.Stack: Stack some tileSources
// Calls DOJO.Source
// -- Called by main.js
//-----------------------------------

DOJO.Stack = function(src_terms){

    // Setup
    var zBuff = this.zBuff;
    var nLayers = this.preset.length;
    var keys = this.range(2*zBuff-1);
    var arrows = this.arrows.bind(this);
    var join = this.join.bind(this,nLayers);
    var addFirst = this.add.bind(this.first);
    var timesLayers = this.times.bind(nLayers);
    var index = [0, zBuff-1, zBuff-2, 2*zBuff-3];
    var addRange = this.addRange.bind(this, nLayers);

    // Prepare the sources
    DOJO.Source(src_terms);
    keys.push(keys.splice(zBuff-1, 1)[0]);
    this.source = keys.map(addFirst).reduce(join,[]);
    this.index = index.map(timesLayers).map(addRange).reduce(arrows,{});
}

DOJO.Stack.prototype = {
    zBuff: 2,
    first: 0,
    preset: [
        {
            set: {},
            src: {}
        },
        {
            set: {},
            src: {segmentation: true}
        }
    ],
    init: function(osd){
        var w = osd.world;

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
            this.make(zLevel, index).map(osd.addTiledImage,osd);
        }
        this.event = function(event){
            return this.index[event].map(w.getItemAt, w);
        }
        this.level = function(){
            var z = Math.max(osd.viewport.getZoom(),1);
            var maxLevel = this.source[0].tileSource.maxLevel;
            return Math.min(Math.floor(Math.log(z)/Math.LN2), maxLevel);
        }
        return this;
    },
    share: DOJO.Source().share.bind(null),
    sourcer: function(zLevel, indices, layer, i){
        var source = new DOJO.Source(this.share(layer.src, {z:zLevel}));
        return this.share(this.share(layer.set, {index:indices[i]}), source);
    },
    make: function(zLevel, indices) {
        return this.preset.map(this.sourcer.bind(this,zLevel,indices));
    },
    join: function(nLayers, out, zLevel) {
        return out.concat(this.make(zLevel,new Array(nLayers)));
    },
    arrows: function(out,index,i) {
        out[['start','up','down','end'][i]] = index;
        return out;
    },
    range: function(end){
        return Object.keys(new Uint8Array(end)).map(Number);
    },
    addRange: function(layers,one) {
        return this.range(layers).map(this.add,one);
    },
    add: function(that) {
        return this + that;
    },
    times: function(that) {
        return this * that;
    }
};