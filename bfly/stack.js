//-----------------------------------
//
// DOJO.Stack: Stack some tileSources
// (Needs DOJO.Source)
//-----------------------------------

DOJO.Stack = function(src_terms){

    // Prepare the sources
    DOJO.Source(src_terms);
    // Determine number of tiles above and below
    var range = Object.keys(new Uint8Array(this.size()));

    // Map z offset to tiledImage indices
    this.zMap = range.reduce(this.zMapper.bind(this),{});
    // Push all the starting layers together to be shown in openSeadragon
    this.zOrder = Object.keys(this.zMap).sort(this.zSorter.bind(this));
    this.source = this.zOrder.reduce(this.zSourcer.bind(this),[]);
}

DOJO.Stack.prototype = {
    buffer: 4,
    first: 10,
    preset: [
        {
            set: {},
            src: {}
        },
        {
            set: {opacity: .4},
            src: {segmentation: true}
        }
    ],
    share: DOJO.Source().share,
    size: function(){
        this.nLayers = this.preset.length;
        return this.nLayers*(this.buffer+1)-1;
    },
    make: function(zLevel, index) {
        return this.preset.map(function(lay,li){
            var source = new DOJO.Source(this.share({z:zLevel},lay.src));
            return this.share(source, this.share({index:index[li]},lay.set));
        },this);
    },
    zSourcer: function(out,lay) {
        return out.concat(this.make(+lay+this.first, [undefined,undefined]));
    },
    zSorter: function(a,b) {
        return Math.sign(this.zMap[a][0] - this.zMap[b][0]);
    },
    zMapper: function(map,i,_,range) {
        var key = i - this.buffer;
        var n = +range.slice(key-1, key||undefined);
        map[key] = [this.nLayers*n,this.nLayers*n+1];
        return map;
    }
};