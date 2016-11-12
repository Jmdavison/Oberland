//One big JS file

const CANVASWIDTH = 512;
const CANVASHEIGHT = 512;
const MAPCOLS = 30;
const MAPROWS = 144;
const NUMLAYERS = 3;
const TILESIZE = 32;


//interactive objects
const HOUSE = 6;

var FRIENDS = {
               FRIEZA: 101,
               PICCOLO: 102,
               BLUE_RANGER: 103,
               PINK_RANGER: 104
             };

//background objects
const TREE = 2;
const BURNT_TREE = 5;
const STREET = 3;
const CONCRETE = 4;
const GRASS = 1;

//
// Asset loader
//
var Loader = {
    images: {}
};
//this asset load loads images the async Promise function and stores them
//in the images object.
Loader.loadImage = function (key, src) {
    var img = new Image();

    var d = new Promise(function (resolve, reject) {
        img.onload = function () {
            this.images[key] = img;
            resolve(img);
        }.bind(this);

        img.onerror = function () {
            reject('Could not load image: ' + src);
        };
    }.bind(this));

    img.src = src;
    return d;
};

Loader.getImage = function (key) {
    return (key in this.images) ? this.images[key] : null;
};


/* mouse input handling */

var Mouse = {};
Mouse.click = {
  x: -1,
  y: -1,
  arrived: false,
}

//click handler
Mouse.handleClick = function (e) {
  Mouse.click.arrived = false;
  Game.hero.walking = true;
  var event =  window.event || e;
  var destX = event.offsetX + Game.camera.x;
  var destY = event.offsetY + Game.camera.y;

  Mouse.click.x = destX;
  Mouse.click.y = destY;
  }

Mouse.currentDest = function (){
//    console.log(this.click.arrived);
    if(this.click.arrived == false && this.click.x !== -1){
      return true;
    }else return false;
  }

/*
The object structure used here was taken from the simple
tilemap scrolling example from mdn.
the structure is as follows

objects: (with * are custom)
  Game
  Map
  Hero
  Enemy*
*/

//
// Game object
//
var Game = {};

Game.startFromSave = function (context, save) {
    this.ctx = context;
    this.elapsed = 0;
    this.gameTime = save.gameTime;
    this.saved = false;

    var promises = this.load();
    //this promise.all call waits for all promises
    //within function call to be resolved, then resolves
    //if all internal promises get resolved, and rejects if any
    //promises reject
    Promise.all(promises).then(function (loaded) {
        //initialize once images are loaded
        this.init(save);
        //calls render loop
        window.requestAnimationFrame(this.tick);
    }.bind(this));
};

Game.startNew = function (context) {
    this.ctx = context;
    this.elapsed = 0;
    this.gameTime = 0;
    this.saved = false;
    var promises = this.load();
    //this promise.all call waits for all promises
    //within function call to be resolved, then resolves
    //if all internal promises get resolved, and rejects if any
    //promises reject
    Promise.all(promises).then(function (loaded) {
        //initialize once images are loaded
        this.init();
        //calls render loop
        window.requestAnimationFrame(this.tick);
    }.bind(this));
};

//this is our render loop
Game.tick = function (elapsed) {
    window.requestAnimationFrame(this.tick);

    // clear previous frame
    this.ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);

    // compute delta time in seconds -- also cap it
    var delta = (elapsed - this.elapsed) / 1000.0;
    delta = Math.min(delta, 0.25); // maximum delta of 250 ms
    this.elapsed = elapsed;

    this.update(delta);
    this.render();
}.bind(Game);

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
// Map Object
//

function Map() {

  this.cols = MAPCOLS;
  this.rows = MAPROWS;
  this.tSize = TILESIZE;
  this.numLayers = NUMLAYERS;
  this.friends = {
    pinkRanger: {
              name : "pink ranger",
              image: null,
              convo: ["Hello !name, I am your friend. Bring me 5 red gems and I will defend the little shack you call home.",
                      "Ahh, I see you have the gems, Would you like me to join your team?",
                      "Good choice peasant, I will be waiting inside."],
              sourceWidth: 52,
              sourceHeight: 75,
              spriteY: 0,
              alreadyPlaced: false,
              persuaded: false,
              frameIndexes: [0,50,103,160,222,280],
              damage: [10,20,50,100],
              col: (Math.floor(Math.random() * 26) + 2)
            },
    blueRanger: {
              name : "blue ranger",
              image: null,
              convo: ["Hello !name, I am your friend. Bring me 5 red gems and I will defend the little shack you call home.",
                      "Ahh, I see you have the gems, Would you like me to join your team?",
                      "Good choice peasant, I will be waiting inside."],
              sourceWidth: 50,
              sourceHeight: 75,
              spriteY: 0,
              alreadyPlaced: false,
              persuaded: false,
              frameIndexes: [0,65,155,250],
              damage: [10,20,50,100],
              col: (Math.floor(Math.random() * 26) + 2)
            },
    frieza: {
              name : "frieza",
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
              image: null,
              convo: ["Hello !name, I am piccolo. Bring me 5 red gems and I will defend the little shack you call home.",
                      "Ahh, I see you have the gems, Would you like me to join your team?",
                      "Good choice peasant, I will be waiting inside."],
              sourceWidth: 74,
              sourceHeight: 90,
              spriteY:60,
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
//
// Camera Constructor
//

function Camera(map, width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.maxX = map.cols * map.tSize - width;
    this.maxY = map.rows * map.tSize - height;
}

Camera.SPEED = 256; // pixels per second


//camera prototype methods, this prototype call allows us to attach these methods
//to any object created using the new Camera() constructor
Camera.prototype.follow = function (sprite) {
    this.following = sprite;
    sprite.screenX = 0;
    sprite.screenY = 0;
};

Camera.prototype.update = function () {
  // assume followed sprite should be placed at the center of the screen
  // whenever possible
  this.following.screenX = this.width / 2;
  this.following.screenY = this.height / 2;

  // make the camera follow the sprite
  this.x = this.following.x - this.width / 2;
  this.y = this.following.y - this.height / 2;

  // clamp values
  this.x = Math.max(0, Math.min(this.x, this.maxX));
  this.y = Math.max(0, Math.min(this.y, this.maxY));

  // in map corners, the sprite cannot be placed in the center of the screen
  // and we have to change its screen coordinates

  // left and right sides
  if (this.following.x < this.width / 2 ||
      this.following.x > this.maxX + this.width / 2) {
      this.following.screenX = this.following.x - this.x;
  }
  // top and bottom sides
  if (this.following.y < this.height / 2 ||
      this.following.y > this.maxY + this.height / 2) {
      this.following.screenY = this.following.y - this.y;
  }
};

//Hero Constructor
function Hero(map, x, y) {
    this.name = name;
    this.map = map;
    this.x = x;
    this.y = y;
    this.width = map.tSize;
    this.height = map.tSize;

    this.velX = 0;
    this.velY = 0;
    this.image = Loader.getImage('hero');
    this.imageFlip = Loader.getImage('hero-flip');
}

Hero.SPEED = 250; // pixels per second

Hero.prototype.move = function (delta, destX, destY) {
    // move hero
    //console.log(this.x);
    var tx = destX - this.x;
    var ty = destY - this.y;
    var dist = Math.sqrt((tx * tx) + (ty * ty));
    //console.log(dist);
    if(dist >= 5){
      Mouse.click.arrived = false;
      Game.hero.walking = true;
      this.velX = (tx / dist) * Hero.SPEED * delta;
      this.velY = (ty / dist) * Hero.SPEED * delta;
    //console.log(this.velY + " " + this.velX);
        this.x += this.velX;
        this.y += this.velY;

      // clamp values
      var maxX = this.map.cols * this.map.tSize;
      var maxY = this.map.rows * this.map.tSize;
    //  this.x = Math.max(0, Math.min(this.x, maxX));
    //  this.y = Math.max(0, Math.min(this.y, maxY));
  } else  {Mouse.click.arrived = true; Game.hero.walking = false;}
};

//saves important game objects to local storage
Game.saveGame = function(){
  var saveObj = {};
  saveObj.gameTime = this.gameTime;
  saveObj.layers = this.map.layers;
  saveObj.heroX = this.hero.x;
  saveObj.heroY = this.hero.y;
  if(window.localStorage.setItem('gameSave',JSON.stringify(saveObj))){
    return true;
  }else return false;
}

//this will handle hero interactions with NPCs, Objects, and the house
Game.launchInteraction = function(){
    switch(this.map.interaction){
      case 6:
        break;
      default:
        break;
    }

};

//load friend images
Game.loadFriends = function() {
    this.map.friends.frieza.image = Loader.getImage('frieza');
    this.map.friends.piccolo.image = Loader.getImage('piccolo');
    this.map.friends.blueRanger.image = Loader.getImage('blue-ranger');
    this.map.friends.pinkRanger.image = Loader.getImage('pink-ranger');
};

//calls async loading of image assets (resolves on load)
Game.load = function () {
    return [
        Loader.loadImage('piccolo', './images/piccolo.png'),
        Loader.loadImage('frieza', './images/frieza.png'),
        Loader.loadImage('blue-ranger', './images/blue-ranger.png'),
        Loader.loadImage('pink-ranger', './images/pink-ranger.png'),
        Loader.loadImage('house', './images/house.png'),
        Loader.loadImage('tiles', './images/tiles.png'),
        Loader.loadImage('hero', './images/hero.png'),
        Loader.loadImage('hero-flip', './images/hero-flip.png')
    ];
};

//initialization function
Game.init = function (save) {
    this.map = new Map();
    if(save){
      this.map.layers = save.layers;
      this.hero = new Hero(this.map, save.heroX, save.heroY);
      this.camera = new Camera(this.map, 512, 512);
    }else{
      this.hero = new Hero(this.map, 465, 4470);
      this.camera = new Camera(this.map, 512, 512);
    }
    this.loadFriends();
    this.houseSprite = Loader.getImage('house');
    this.tileSet = Loader.getImage('tiles');
    this.camera.follow(this.hero);

    // initial draw of the map
    // underscore prefix simply means the function is intended for
    // private use only (To be used by Game and Game only)
    this._drawMap();
};

Game.update = function (delta) {
    this.gameTime += delta;
    //if 30 seconds have passed, save the game
    if(Math.floor(this.gameTime % 11) === 10 && this.saved == false){
      this.saveGame();
      console.log('save');
      this.saved = true;
    }else if(Math.floor(this.gameTime % 11) === 0 && this.saved == true){
      this.saved =false;
    }
  //  console.log(this.gameTime % 31);
    var dirx = 0;
    var diry = 0;

    //checks the click object for a new click and moves the character if so.
    if(Mouse.currentDest()){
      this.hero.move(delta, Mouse.click.x,Mouse.click.y);
    }

    if(this.map.isInteraction(this.hero.x,this.hero.y)){
      console.log('interactive unit in range! Code: ' + this.map.interaction);
    //  this.launchInteraction();
    }
    this.camera.update();
};
Game._drawMap = function () {
    this.map.layers.forEach(function (layer, index) {
        this._drawLayer(index);
    }.bind(this));
};

Game._drawLayer = function (layer) {

    //calculates which tileMap elements are within camera view
    //and renders only those.
    //
    var startCol = Math.floor(this.camera.x / this.map.tSize);
    //console.log(startCol);
    var endCol = startCol + (this.camera.width / this.map.tSize);
    var startRow = Math.floor(this.camera.y / this.map.tSize);
    var endRow = startRow + (this.camera.height / this.map.tSize);
    var offsetX = -this.camera.x + startCol * this.map.tSize;
    var offsetY = -this.camera.y + startRow * this.map.tSize;

    for (var c = startCol; c <= endCol; c++) {
        for (var r = startRow; r <= endRow; r++) {
            var tile = this.map.getTile(layer, r, c);
            var x = (c - startCol) * this.map.tSize + offsetX;
            var y = (r - startRow) * this.map.tSize + offsetY;
            switch(tile){
              case HOUSE:
                this.ctx.drawImage(
                  this.houseSprite,
                  0,
                  0,
                  77,
                  115,
                  Math.round(x) - 20,
                  Math.round(y) - 40,
                  77,
                  115
                );
                this.ctx.save();
                this.ctx.strokeStyle = "green";
                this.ctx.beginPath();
                this.ctx.arc(x+18, y+15, 58, 0, Math.PI*2);
                this.ctx.stroke();
                this.ctx.restore();
                break;
              case FRIENDS.FRIEZA:
                this.ctx.drawImage(
                  this.map.friends.frieza.image,
                  0,
                  0,
                  96,
                  96,
                  Math.round(x) - 20,
                  Math.round(y) - 20,
                  84,
                  84
                );
                this.ctx.save();
                this.ctx.strokeStyle = "green";
                this.ctx.beginPath();
                this.ctx.arc(x+18, y+15, 58, 0, Math.PI*2);
                this.ctx.stroke();
                this.ctx.restore();
                break;
            case FRIENDS.PICCOLO:
              this.ctx.drawImage(
                this.map.friends.piccolo.image,
                0,
                this.map.friends.piccolo.spriteY,
                this.map.friends.piccolo.sourceWidth,
                this.map.friends.piccolo.sourceHeight,
                Math.round(x) - 12,
                Math.round(y) - 14,
                55,
                55
              );
              this.ctx.save();
              this.ctx.strokeStyle = "green";
              this.ctx.beginPath();
              this.ctx.arc(x+18, y+15, 58, 0, Math.PI*2);
              this.ctx.stroke();
              this.ctx.restore();
              break;
            case FRIENDS.BLUE_RANGER:
              this.ctx.drawImage(
                this.map.friends.blueRanger.image,
                0,
                this.map.friends.blueRanger.spriteY,
                this.map.friends.blueRanger.sourceWidth,
                this.map.friends.blueRanger.sourceHeight,
                Math.round(x) - 12,
                Math.round(y) - 14,
                55,
                55
              );
              this.ctx.save();
              this.ctx.strokeStyle = "green";
              this.ctx.beginPath();
              this.ctx.arc(x+18, y+15, 58, 0, Math.PI*2);
              this.ctx.stroke();
              this.ctx.restore();
              break;
            case FRIENDS.PINK_RANGER:
              this.ctx.drawImage(
                this.map.friends.pinkRanger.image,
                0,
                this.map.friends.pinkRanger.spriteY,
                this.map.friends.pinkRanger.sourceWidth,
                this.map.friends.pinkRanger.sourceHeight,
                Math.round(x) - 12,
                Math.round(y) - 14,
                55,
                55
              );
              this.ctx.save();
              this.ctx.strokeStyle = "green";
              this.ctx.beginPath();
              this.ctx.arc(x+18, y+15, 58, 0, Math.PI*2);
              this.ctx.stroke();
              this.ctx.restore();
              break;
            default: // 0 => empty tile
                this.ctx.drawImage(
                    this.tileSet, // image
                    (tile - 1) * this.map.tSize, // source x
                    0, // source y
                    this.map.tSize, // source width
                    this.map.tSize, // source height
                    Math.round(x),  // target x
                    Math.round(y), // target y
                    this.map.tSize, // target width
                    this.map.tSize // target height
                );
                break;
            }
        }
    }
};

Game.render = function () {
    let i = 1;
    this._drawLayer(0);
    this._drawLayer(1);
    //draw hero
    if(Game.hero.velX < 0){
      if(Game.hero.walking === true){
        if((Game.gameTime % 1) == .25){
          if(i > 4){
            i = 1;
            i++;
          }
        }
        this.ctx.drawImage(
          this.hero.imageFlip,
          Math.floor((Game.gameTime % .4) * 10) * this.map.tSize,
          0,
          this.map.tSize,
          this.map.tSize,
          this.hero.screenX - this.hero.width / 2,
          this.hero.screenY - this.hero.height / 2,
          this.map.tSize,
          this.map.tSize
        );
      }else{
        this.ctx.drawImage(
          this.hero.imageFlip,
          0,
          0,
          this.map.tSize,
          this.map.tSize,
          this.hero.screenX - this.hero.width / 2,
          this.hero.screenY - this.hero.height / 2,
          this.map.tSize,
          this.map.tSize
        );
      }
    }else {
    if(this.hero.walking === true){
        this.ctx.drawImage(
          this.hero.image,
          Math.floor((Game.gameTime % .4) * 10) * this.map.tSize,
          0,
          this.map.tSize,
          this.map.tSize,
          this.hero.screenX - this.hero.width / 2,
          this.hero.screenY - this.hero.height / 2,
          this.map.tSize,
          this.map.tSize
        );
      }else{
        this.ctx.drawImage(
          this.hero.image,
          0,
          0,
          this.map.tSize,
          this.map.tSize,
          this.hero.screenX - this.hero.width / 2,
          this.hero.screenY - this.hero.height / 2,
          this.map.tSize,
          this.map.tSize
        );
      }
  }
    this._drawLayer(2);
};


//
// start up function
//

window.onload = function () {
  var gameStarted = false;
  var canvas = document.getElementById('canvas');
  canvas.addEventListener("click", Mouse.handleClick);
  canvas.width = CANVASWIDTH;
  canvas.height = CANVASHEIGHT;
  var context = canvas.getContext('2d');
  var gameLoaded = localStorage.getItem('gameSave') || null;
  if(gameLoaded != null){
    var save = JSON.parse(gameLoaded);
    Game.startFromSave(context,save);
  }else Game.startNew(context);
}

// function draw(){
//   var canvas = document.getElementById("canvas");
//   var ctx = canvas.getContext("2d");
//   var time = new Date();
//   ctx.save();
//   ctx.strokeStyle = 'rgba(0,0,0,0.8)';
//   ctx.clearRect(0,0,600,600);
//
//  ctx.restore();
//  window.requestAnimationFrame(draw);
// }
