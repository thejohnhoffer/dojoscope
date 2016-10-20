
Sourcer = function() {
    TILE = 512;
    SIZE = 520;
    return {
      minLevel: 0,
      width: SIZE,
      height: SIZE,
      tileSize: TILE,
      server: 'localhost:2001',
      datapath: '/Volumes/Lexar/Kevin',
      maxLevel: Math.ceil(Math.log2(SIZE/TILE)),
      getTileUrl: function( level, x, y ) {

          return 'http://' + this.server + '/data/?datapath=' + this.datapath + '&start=' +
              x*TILE + ',' + y*TILE + ',' + 0 + '&mip=' + (this.maxLevel - level) +
              '&size=' + TILE + ',' + TILE + ',' + 1;
      }
    }
}
//-----------------------------------
//
// http://<host>:<port>/index.html?canvas&server=<...>&datapath=<...>
//
//-----------------------------------
window.onload = function(e){

    // Open a seadragon with two layers
    var openSD = OpenSeadragon({
        tileSources: Sourcer(),
        prefixUrl: 'images/icons/',
        maxZoomPixelRatio: 8,
        id: 'via'
    });
};