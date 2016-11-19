
 //These random color generators follow the formula below
// R = Rand*(max - min + 1) + min
//in order to receive a specified range of numbers
function getRandomBgColor() {
    var r = Math.floor((Math.random() * (80-20+1))+20);
    var g = Math.floor((Math.random() * (70-30+1))+30);
    var b = Math.floor((Math.random() * (70-60+1))+60);
    var color = 'rgb('+r+','+g+','+b+')';
    return color;
}
function getRandomFgColor() {
    var r = Math.floor((Math.random() * (100-30+1))+30);
    var g = Math.floor((Math.random() * (198-140+1))+140);
    var b = g - Math.floor((Math.random() * (100-80+1))+80);
    var color = 'rgb('+r+','+g+','+b+')';
    return color;
}

function changeColors(canvas){
  document.body.style.backgroundColor = getRandomBgColor();
  canvas.style.backgroundColor = getRandomFgColor();
}
//a function that wraps text inside a width at a specified location
//gotten from stackoverflow.com
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(' ');
  var line = '';

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}


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
                    console.log(x + " At " + j+","+k+" with index:" + friends[x].index);
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
                }else layers[i][j*cols + k] = 0;
              }
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
                Math.random() * 100 < 10 && layers[i-2][j * cols + k] == GRASS &&
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

  // PRINT LAYERS ARRAY FOR DEBUGGING PURPOSES
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
  this.itemsWidth = 16;
  this.items = {
    goldenNuggetPlus: {
      index: ITEMS.goldenNuggetPlus,
      name: "special golden nugget",
      comment: "it's gotta be worth something",
      spriteIndex:0,
      rarity:10,
      numPlaced:0,
      numberOwned:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    goldenNugget: {
      index: ITEMS.goldenNugget,
      name: "golden nugget",
      comment: "a golden nugget",
      spriteIndex:33,
      rarity:4,
      numPlaced:0,
      numberOwned:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    gleamingMushroom: {
      index: ITEMS.gleamingMushroom,
      name: "gleaming mushroom",
      comment: "This ought to do the trick",
      spriteIndex:112,
      rarity:4,
      numPlaced:0,
      numberOwned:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    purpleOrb: {
      index: ITEMS.purpleOrb,
      name:"magic purple orb",
      comment: "wow..",
      spriteIndex:64,
      rarity: 2,
      numPlaced:0,
      numberOwned:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    weirdClam: {
      index: ITEMS.weirdClam,
      name: "really weird clam",
      comment: "this thing is freaky",
      spriteIndex:96,
      rarity:7,
      numPlaced:0,
      numberOwned:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    humanHeart: {
      index: ITEMS.humanHeart,
      name: "real human heart",
      comment: "that's gross",
      spriteIndex:129,
      rarity:6,
      numPlaced:0,
      numberOwned:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    bigPill: {
      index: ITEMS.bigPill,
      name: "big pill",
      comment: "that'll hurt to swallow",
      spriteIndex:145,
      rarity:3,
      numPlaced:0,
      numberOwned:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    slimyDrink: {
      index: ITEMS.slimyDrink,
      name: "slimy drink",
      comment: "it looks disgusting",
      spriteIndex:226,
      rarity:3,
      numPlaced:0,
      numberOwned:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    religiousObject: {
      index: ITEMS.religiousObject,
      name: "religious object",
      comment: "thats cool I guess",
      spriteIndex:242,
      rarity:3,
      numPlaced:0,
      numberOwned:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    saphireGem: {
      index: ITEMS.saphireGem,
      name: "saphire gem",
      comment: "I think that's what saphire looks like",
      spriteIndex:338,
      rarity:14,
      numPlaced:0,
      numberOwned:0,
      col: Math.floor(Math.random() * 26) + 2
    },
    fineRuby: {
      index: ITEMS.fineRuby,
      name: "very fine ruby",
      comment: "truly spectacular",
      spriteIndex:388,
      rarity:16,
      numPlaced:0,
      numberOwned:0,
      col: Math.floor(Math.random() * 26) + 2
    },
  };

  this.friends = {
    pinkRanger: {
              index: FRIENDS.PINK_RANGER,
              name : "pink ranger",
              image: null,
              currentConvo: 0,
              quest: null,
              convo: ["Hi! \n Bring me !num !questItems \n and I'll join your squad!",
                      "Yyou have the !questItems, I'll joing you if I can have them? (y/n)",
                      "Haha, Yes! I'm ready to do some damage!"],
              sourceWidth: 34,
              sourceHeight: 63,
              spriteX: 14,
              spriteY: 12,
              frameIndexes: [0,50,103,160,222,280],
              alreadyPlaced: false,
              persuaded:false,
              damage: [10,20,50,100],
              col: (Math.floor(Math.random() * (MAPCOLS-4)) + 4),
              row: (Math.floor(Math.random() * (MAPROWS - 1)) + 10)
            },
    blueRanger: {
              index:FRIENDS.BLUE_RANGER,
              name : "blue ranger",
              currentConvo: 0,
              image: null,
              quest: null,
              convo: ["Hello there, I'm here to help! \n Bring me !num !questItems \n and I'll make it worth your while.",
                      "Ahh, I see you have the !questItems, \n Would you like me to join your team? (y/n)",
                      "Good choice dude!, I will see you on the flip side."],
              sourceWidth: 35,
              sourceHeight: 63,
              spriteX: 10,
              spriteY: 6 ,
              alreadyPlaced: false,
              persuaded: false,
              frameIndexes: [0,65,155,250],
              damage: [10,20,50,100],
              col: (Math.floor(Math.random() * (MAPCOLS-8)) + 4),
              row: (Math.floor(Math.random() * (MAPROWS - 1)) + 10)
            },
    frieza: {
              index:FRIENDS.FRIEZA,
              name : "frieza",
              currentConvo: 0,
              image: null,
              quest: null,
              convo: ["Hello peasant, I am FRIEZA. Bring me !num !questItems and I will defend the little shack you call home.",
                      "Ahh, I see you have the !questItems, Would you like me to join your team? (y/n)",
                      "Good choice peasant, I will be waiting inside."],
              sourceWidth: 48,
              sourceHeight: 67,
              spriteX: 19,
              spriteY: 14,
              alreadyPlaced: false,
              imgLoaded: false,
              persuaded: false,
              damage: [10,20,50,100],
              col: (Math.floor(Math.random() * (MAPCOLS-8)) + 4),
              row: (Math.floor(Math.random() * (MAPROWS - 1)) + 10)
            },
    piccolo: {
              index:FRIENDS.PICCOLO,
              name : "piccolo",
              currentConvo: 0,
              image: null,
              quest: null,
              convo: ["Hello traveler, I am piccolo. \n Bring me !num !questItems and I will keep \n you safe from your\n enemies.",
                      "Ahh, I see you have the !questItems, \n  Would you like me to join your team? (y/n)",
                      "Indeed my friend! I will be waiting inside."],
              sourceWidth: 51,
              sourceHeight: 71,
              spriteY:58,
              spriteX:10,
              alreadyPlaced: false,
              persuaded: false,
              damage: [10,20,50,100],
              col: (Math.floor(Math.random() * (MAPCOLS-8)) + 4),
              row: (Math.floor(Math.random() * (MAPROWS - 1)) + 10)
            },
    link: {
              index:FRIENDS.LINK,
              name : "link",
              currentConvo: 0,
              image: null,
              quest: null,
              convo: ["I'll fire my arrows by your will. Just bring me !num !questItems",
                      "Ahh, I see you have the !questItems, \n  Would you like me to join your team? (y/n)",
                      "Thank you, I will be waiting inside."],
              sourceWidth: 36,
              sourceHeight: 60,
              spriteY:0,
              spriteX:0,
              alreadyPlaced: false,
              persuaded: false,
              damage: [10,20,50,100],
              col: (Math.floor(Math.random() * (MAPCOLS-8)) + 4),
              row: (Math.floor(Math.random() * (MAPROWS - 1)) + 10)
            }
  };
  this.interaction = 0;

  this.layers = generateMap(MAPROWS,MAPCOLS,NUMLAYERS,this.friends,this.items);

  this.getItem = function(index){
    for (var i in this.items)
      if(this.items[i].index === index)
        return this.items[i];
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
        Game.currentInteraction = this.getTile(1,col,row);
        this.clearTile(1, col, row);
        return true;
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
                Game.currentInteraction = tilesAround[j];
                return true;
              }
            }
          }
          return false;
        }
      };
  this.availableQuests = [];
  this.getQuest = function(map){
    var rand = Math.floor(Math.random()*map.availableQuests.length);
    //console.log(rand);
    var quest = map.availableQuests[rand];
    if(quest.numRequired == 0){
      map.availableQuests.splice(rand,1);
      this.getQuest();
    }else{
      map.availableQuests.splice(rand,1);
      return quest;
    }
  };
  this.loadQuests = function(map){
    for (var x in map.items){
    //  console.log("push");
      var num = Math.floor(map.items[x].numPlaced/4)
      if(map.items[x].numPlaced > 0){
        map.availableQuests.push({
          itemName: map.items[x].name,
          numRequired: map.items[x].numPlaced - num,
          index: map.items[x].index
        });
      }
    }
    for(var x in map.friends){
      map.friends[x].quest = map.getQuest(map);
    //  console.log(map.friends[x]);
      for(var i = 0; i < map.friends[x].convo.length; i++){
        map.friends[x].convo[i] = map.friends[x].convo[i].replace(/!questItem/g, map.friends[x].quest.itemName);
        map.friends[x].convo[i] = map.friends[x].convo[i].replace(/!num/g, map.friends[x].quest.numRequired);
      }
    }
  };
}
