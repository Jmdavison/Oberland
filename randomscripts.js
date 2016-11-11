
var generateMap = function(){
  var map = [];
  const xMax = 32;
  const yMax = 16;

  for(var i=0; i < yMax; i++){
    map[i] = [];
    for(var j=0; j < xMax; j++){
        if(i == 1 || j == 1) map[i][j] = 1;
        else map[i][j] = 0;
        console.log(map[i][j]);
    }
  }
}
