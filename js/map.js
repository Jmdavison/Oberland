

//really nice little snippet gotten from Stackoverflow
//grabs a random property of an oject
function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = obj[prop];
    return result;
}

//
// Map Generator Function
//
var generateMap = function (rows, cols, numLayers, friends, items) {
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
              var found=null;
               for (var x in friends){
                 if((j === friends[x].row) && (k === friends[x].col)){
                //   console.log(x + " At " + j+","+k+" with index:" + friends[x].index);
                  found = friends[x].index;
                 }
              }
              if(found != null){
                layers[i][j*cols + k] = found;
              }
              else {
                if(Math.random() < .005){
                  var item =  pickRandomProperty(items);
                  layers[i][j*cols + k] = item.index;
                  item.numPlaced++;
                  Game.itemsDown.push(item.index + "-" + item.numPlaced);
                }else layers[i][j*cols + k] = 0;
              }
            //   var rand = Math.random() * 5;
            //   if((j > rows - 15) && friends.frieza.alreadyPlaced === false && k === friends.frieza.col){
            //     layers[i][j*cols + k] = FRIENDS.FRIEZA;
            //     friends.frieza.alreadyPlaced = true;
            // }else if((j > rows - 20) && friends.piccolo.alreadyPlaced === false && k === friends.piccolo.col){
            //     layers[i][j*cols + k] = FRIENDS.PICCOLO;
            //     friends.piccolo.alreadyPlaced = true;
            //   }else if((j > rows - 25) && friends.blueRanger.alreadyPlaced === false && k === friends.blueRanger.col){
            //       layers[i][j*cols + k] = FRIENDS.BLUE_RANGER;
            //       friends.blueRanger.alreadyPlaced = true;
            //     }else if((j > rows - 50) && friends.pinkRanger.alreadyPlaced === false && k === friends.pinkRanger.col){
            //         layers[i][j*cols + k] = FRIENDS.PINK_RANGER;
            //         friends.pinkRanger.alreadyPlaced = true;
            //       }else{
            //       }
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


  // var string = "";
  // for(var i = 0; i < layers.length; i++){
  //   string += '\n \n';
  //   for(var j = 0; j < rows; j++){
  //     string += '\n';
  //     for(var k = 0; k < cols; k++){
  //       string += layers[i][j * cols + k];
  //     }
  //   }
  // }
//  console.log(string);
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
  this.itemsWidth = 16;
  this.items = {
    goldenNuggetPlus: {
      index: ITEMS.goldenNuggetPlus,
      name: "golden nugget plus+",
      comment: "it's gotta be worth something",
      spriteIndex:0,
      rarity:10,
      numPlaced:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    goldenNugget: {
      index: ITEMS.goldenNugget,
      name: "golden nugget",
      comment: "a golden nugget",
      spriteIndex:33,
      rarity:4,
      numPlaced:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    gleamingMushroom: {
      index: ITEMS.gleamingMushroom,
      name: "gleaming mushroom",
      comment: "This ought to do the trick",
      spriteIndex:33,
      rarity:4,
      numPlaced:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    purpleOrb: {
      index: ITEMS.purpleOrb,
      name:"magic purple orb",
      comment: "wow..",
      spriteIndex:64,
      rarity: 2,
      numPlaced:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    weirdClam: {
      index: ITEMS.weirdClam,
    name: "really weird clam",
    comment: "this thing is freaky",
    spriteIndex:96,
    rarity:7,
    numPlaced:0,
    col: Math.floor(Math.random() * 26) + 2
    },
    humanHeart: {
      index: ITEMS.humanHeart,
      name: "real human heart",
      comment: "thats gross",
      spriteIndex:129,
      rarity:6,
      numPlaced:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    bigPill: {
      index: ITEMS.bigPill,
      name: "big pill",
      comment: "you're gonna need some water",
      spriteIndex:145,
      rarity:3,
      numPlaced:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    slimyDrink: {
      index: ITEMS.slimyDrink,
      name: "slimy drink",
      comment: "it looks disgusting",
      spriteIndex:226,
      rarity:3,
      numPlaced:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    religiousObject: {
      index: ITEMS.religiousObject,
      name: "religious object",
      comment: "thats cool I guess",
      spriteIndex:242,
      rarity:3,
      numPlaced:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    saphireGem: {
      index: ITEMS.saphireGem,
      name: "saphire gem",
      comment: "I think that's what saphire looks like",
      spriteIndex:338,
      rarity:14,
      numPlaced:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    fineRuby: {
      index: ITEMS.fineRuby,
      name: "very fine ruby",
      comment: "truly spectacular",
      spriteIndex:388,
      rarity:16,
      numPlaced:0,
      col: Math.floor(Math.random() * 26) + 2
    },

  };
  this.friends = {
    pinkRanger: {
              index: FRIENDS.PINK_RANGER,
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
              col: (Math.floor(Math.random() * 26) + 2),
              row: (Math.floor(Math.random() * 144) + 10)
            },
    blueRanger: {
              index:FRIENDS.BLUE_RANGER,
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
              col: (Math.floor(Math.random() * 26) + 2),
              row: (Math.floor(Math.random() * 144) + 10)
            },
    frieza: {
              index:FRIENDS.FRIEZA,
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
              col: (Math.floor(Math.random() * 26) + 2),
              row: (Math.floor(Math.random() * 144) + 10)
            },
    piccolo: {
              index:FRIENDS.PICCOLO,
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
              col: (Math.floor(Math.random() * 26) + 2),
              row: (Math.floor(Math.random() * 144) + 10)
            }
  };
  this.interaction = 0;

  this.layers = generateMap(MAPROWS,MAPCOLS,NUMLAYERS,this.friends,this.items);

  this.getItem = function(index){
    for (var item in this.items)
      if(this.items[item].index === index)
        return this.items[item];
  };

  this.getFriend = function(index){
    for (var i in this.friends)
      if(this.friends[i].index === index)
        return this.friends[i];
  };

  this.getTile = function(layer, col, row) {
      return this.layers[layer][col * this.cols + row];
  };
  this.clearTile = function(layer, col, row){
    this.layers[layer][col * this.cols + row] = 0;
  }
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

      if(this.getTile(1,col, row) > 1000){
        console.log("on top of item!!");
        Game.launchInteraction(this.getTile(1,col,row));
        this.clearTile(1, col, row);
      }else{
        for(var i=0; i<this.layers.length;i++){
          var tilesAround = [
            this.getTile(i, col, row),
            this.getTile(i, col - 1, row),
            this.getTile(i, col + 1, row),
            this.getTile(i, col, row + 1),
            this.getTile(i, col, row - 1),
            this.getTile(i, col + 1, row - 1),
            this.getTile(i, col + 1, row + 1),
            this.getTile(i, col - 1, row - 1),
            this.getTile(i, col - 1, row + 1)
          ];
            for(var j = 0; j < tilesAround.length; j++){
              if(tilesAround[j] > 5 && tilesAround[j] < 1000){
                console.log("house or friend in range");
                Game.launchInteraction(tilesAround[j]);
              }
            }
          }
        }
      };
    }
