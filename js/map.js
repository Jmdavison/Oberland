//
// Map Generator Function
//
var generateMap = function (rows, cols, numLayers,friends) {
  var layers = new Array();
  for (var i = 0; i < numLayers; i++){
    layers[i] = new Array();
    for (var j=0; j < rows; j++){
      for (var k=0; k < cols; k++){
        //start switch for layers
        switch(i){
          //generate first layer
          case 0:
          //make sure we have trees around the border, besides where we have streets
            if(j >= rows - 8  && j <= rows -7) {layers[i][j*cols + k] = STREET;}
              //create the driveway
            else if(j >= rows - 6  &&  k == cols/2  ) {layers[i][j*cols + k] = CONCRETE;}
              //drop drop friends randomly
            else {layers[i][j*cols + k] = GRASS;}
            break;
          //generate objects and friends layer
          case 1:
            if(j < rows - 10){
              if((j > rows - 15) && friends.frieza.alreadyPlaced === false && k === friends.frieza.col){
                layers[i][j*cols + k] = FRIENDS.FRIEZA;
                friends.frieza.alreadyPlaced = true;
            }else if((j > rows - 20) && friends.piccolo.alreadyPlaced === false && k === friends.piccolo.col){
                layers[i][j*cols + k] = FRIENDS.PICCOLO;
                friends.piccolo.alreadyPlaced = true;
              }else if((j > rows - 25) && friends.blueRanger.alreadyPlaced === false && k === friends.blueRanger.col){
                  layers[i][j*cols + k] = FRIENDS.BLUE_RANGER;
                  friends.blueRanger.alreadyPlaced = true;
                }else if((j > rows - 50) && friends.pinkRanger.alreadyPlaced === false && k === friends.pinkRanger.col){
                    layers[i][j*cols + k] = FRIENDS.PINK_RANGER;
                    friends.pinkRanger.alreadyPlaced = true;
                  }else layers[i][j*cols + k] = 0;
            }else layers[i][j*cols + k] = 0;
            break;
          //generate third layer
          case 2:
            if(( j == 0 || ((j == rows - 1) && !(k >= cols / 2 - 1 && k <= cols/2 + 1)) ||  k == 0 ||  (k == cols - 1)) &&
                (!(j >= rows - 8  && j <= rows -7) && layers[i-2][j * cols + k] == GRASS)){
              //randomly place burnt trees
              if(Math.random() * 10 <= 3){layers[i][j * cols + k] = BURNT_TREE;}
              else layers[i][j * cols  + k] = TREE;
            }else if((j == rows - 2) && (k == cols / 2  )){
                //create house
                layers[i][j*cols + k] = HOUSE;
              }else if(
                Math.random() * 100 < 3 && layers[i-2][j * cols + k] == GRASS &&
                layers[i-1][j * cols + k] == 0
              ){
                if(Math.random() * 10 <= 3){layers[i][j * cols + k] = BURNT_TREE;}
                else layers[i][j * cols  + k] = TREE;
              }else{
                layers[i][j*cols + k] = 0;
              }
            break;
          default: break;
        }
      }
    }
  }


  var string = "";
  for(var i = 0; i < layers.length; i++){
    string += '\n \n';
    for(var j = 0; j < rows; j++){
      string += '\n';
      for(var k = 0; k < cols; k++){
        string += layers[i][j * cols + k];
      }
    }
  }
  console.log(string);
  return layers;
}

//
// Map Constructor
//

function Map() {

  this.cols = MAPCOLS;
  this.rows = MAPROWS;
  this.tSize = TILESIZE;
  this.numLayers = NUMLAYERS;
  this.itemsImage = null;
  this.items = {
    goldenNuggetPlus: {
      name: "golden nugget",
      spriteIndex:0,
      rarity:10,
      col: Math.floor(Math.random() * 26) + 2
    },
    goldenNugget: {
      name: "golden nugget",
      spriteIndex:33,
      rarity:4,
      col: Math.floor(Math.random() * 26) + 2
    },
    sleamingMushroom: {
      name: "gleaming mushroom",
      spriteIndex:33,
      rarity:4,
      col: Math.floor(Math.random() * 26) + 2
    }
  };
  this.friends = {
    pinkRanger: {
              name : "pink ranger",
              image: null,
              currentConvo: 0,
              convo: ["Hello !name, I am your friend. Bring me 5 red gems and I will defend the little shack you call home.",
                      "Ahh, I see you have the gems, Would you like me to join your team?",
                      "Good choice peasant, I will be waiting inside."],
              sourceWidth: 34,
              sourceHeight: 63,
              spriteX: 14,
              spriteY: 12,
              alreadyPlaced: false,
              persuaded: false,
              frameIndexes: [0,50,103,160,222,280],
              damage: [10,20,50,100],
              col: (Math.floor(Math.random() * 26) + 2)
            },
    blueRanger: {
              name : "blue ranger",
              currentConvo: 0,
              image: null,
              convo: ["Hello !name, I am your friend. Bring me 5 red gems and I will defend the little shack you call home.",
                      "Ahh, I see you have the gems, Would you like me to join your team?",
                      "Good choice peasant, I will be waiting inside."],
              sourceWidth: 35,
              sourceHeight: 63,
              spriteX: 10,
              spriteY: 6 ,
              alreadyPlaced: false,
              persuaded: false,
              frameIndexes: [0,65,155,250],
              damage: [10,20,50,100],
              col: (Math.floor(Math.random() * 26) + 2)
            },
    frieza: {
              name : "frieza",
              currentConvo: 0,
              image: null,
              convo: ["Hello !name, I am FRIEZA. Bring me 5 red gems and I will defend the little shack you call home.",
                      "Ahh, I see you have the gems, Would you like me to join your team?",
                      "Good choice peasant, I will be waiting inside."],
              sourceWidth: 96,
              sourceHeight: 96,
              alreadyPlaced: false,
              imgLoaded: false,
              persuaded: false,
              damage: [10,20,50,100],
              col: (Math.floor(Math.random() * 26) + 2)
            },
    piccolo: {
              name : "piccolo",
              currentConvo: 0,
              image: null,
              convo: ["Hello !name, I am piccolo. Bring me 5 red gems and I will defend the little shack you call home.",
                      "Ahh, I see you have the gems, Would you like me to join your team?",
                      "Good choice peasant, I will be waiting inside."],
              sourceWidth: 74,
              sourceHeight: 90,
              spriteY:60,
              spriteX:0,
              alreadyPlaced: false,
              persuaded: false,
              damage: [10,20,50,100],
              col: (Math.floor(Math.random() * 26) + 2)
            }
  };
  this.interaction = 0;

  this.layers = generateMap(MAPROWS,MAPCOLS,NUMLAYERS,this.friends);

  this.getTile = function(layer, col, row) {
      return this.layers[layer][col * this.cols + row];
  };
  this.getCol = function (x) {
    return Math.floor(x / this.tSize);
  };
  this.getRow = function (y) {
    return Math.floor(y / this.tSize);
  };
  this.getX = function (col) {
    return col * this.tSize;
  };
  this.getY = function (row) {
    return row * this.tSize;
  };
  this.isInteraction = function(x,y){
    //takes x,y coordinates from the mouse function and checks if the tile is clickable
      var col = this.getCol(y);
      var row = this.getRow(x);

      for(var i=0; i<this.layers.length;i++){
          if(this.getTile(i, col, row) > 5 ){
            this.interaction = this.getTile(i, col, row);
            return true;
          }if(this.getTile(i, col - 1, row) > 5 ){
            this.interaction = this.getTile(i, col - 1, row);
            return true;
          }if(this.getTile(i, col + 1, row) > 5 ){
            this.interaction = this.getTile(i, col + 1, row);
            return true;
          }if(this.getTile(i, col, row + 1) > 5 ){
            this.interaction = this.getTile(i, col, row + 1);
            return true;
          }if(this.getTile(i, col, row - 1) > 5 ){
            this.interaction = this.getTile(i, col, row - 1);
            return true;
          }if(this.getTile(i, col + 1, row - 1) > 5 ){
            this.interaction = this.getTile(i, col + 1, row - 1);
            return true;
          }if(this.getTile(i, col + 1, row + 1) > 5 ){
            this.interaction = this.getTile(i, col + 1, row + 1);
            return true;
          }if(this.getTile(i, col - 1, row - 1) > 5 ){
            this.interaction = this.getTile(i, col - 1, row - 1);
            return true;
          }if(this.getTile(i, col - 1, row + 1) > 5 ){
            this.interaction = this.getTile(i, col - 1, row + 1);
            return true;
          }
        }
      };
    }
