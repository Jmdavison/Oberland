//One big JS file

const CANVASWIDTH = 512;
const CANVASHEIGHT = 512;
<<<<<<< HEAD
const MAPCOLS = 30;
=======
const MAPCOLS = 32;
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
const MAPROWS = 144;
const NUMLAYERS = 2;
const TILESIZE = 32;

<<<<<<< HEAD

//interactive objects
const HOUSE = 6;

//enemies
const FRIEZA = 101;

//background objects
const TREE = 2;
=======
const TREE = 2;
const HOUSE = 6;
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
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
<<<<<<< HEAD
=======

>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
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

<<<<<<< HEAD
//click handler
Mouse.handleClick = function (e) {
  Mouse.click.arrived = false;
  Game.hero.walking = true;
  var event =  window.event || e;
  var destX = event.offsetX + Game.camera.x;
  var destY = event.offsetY + Game.camera.y;
=======

Mouse.handleClick = function (e) {
  Mouse.click.arrived = false;
  Game.hero.walking = true;
  console.log('click');
  var event =  window.event || e;
  var destX = event.offsetX + Game.camera.x;
  var destY = event.offsetY + Game.camera.y;
  var y = event.offsetY;
  var x = event.offsetX;
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559

  Mouse.click.x = destX;
  Mouse.click.y = destY;
  }

<<<<<<< HEAD
Mouse.currentDest = function (){
=======
Mouse.isClick = function (){
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
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

Game.run = function (context) {
    this.ctx = context;
    this.elapsed = 0;
    this.gameTime = 0;
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

var generateMap = function (rows, cols, numLayers) {
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
<<<<<<< HEAD
            if(j >= rows - 8  && j <= rows -7) {layers[i][j*cols + k] = STREET;}
              //create the driveway
            else if(j >= rows - 6  &&  k == cols/2  ) {layers[i][j*cols + k] = CONCRETE;}
              //create grass
              else if(Math.random() * 1000 < 5){
                layers[i][j*cols + k] = 101;
              } else {layers[i][j*cols + k] = GRASS;}
            break;
          //generate second layer
          case 1:
          if(( j == 0 || (j == rows - 1) ||  k == 0 ||  (k == cols - 1)) &&
              (!(j >= rows - 8  && j <= rows -7) && !(k >= cols / 2 - 1 && k <= cols/2))){
            //randomly place burnt trees
            if(Math.random() * 10 <= 3){layers[i][j * cols + k] = BURNT_TREE;}
            else layers[i][j * cols  + k] = TREE;
            //create the street
          }else if((j == rows - 2) && (k == cols / 2  )){
              //create house
=======
            if(( j == 0 || (j == rows - 1) ||  k == 0 ||  (k == cols - 1)) && !(j >= rows - 8  && j <= rows -7) ){
              //randomly place burnt trees
              if(Math.random() * 10 <= 3){layers[i][j * cols + k] = BURNT_TREE;}
              else layers[i][j * cols  + k] = TREE;
              //create the street
            }else if(j >= rows - 8  && j <= rows -7) {layers[i][j*cols + k] = STREET;}
              //create the driveway
            else if(j >= rows - 6  &&  k == cols/2  ) {layers[i][j*cols + k] = CONCRETE;}
              //create grass
            else {layers[i][j*cols + k] = GRASS;}
            break;
          //generate second layer
          case 1:
          //create house
            if((j > rows - 3 && j < rows - 1) && (k > cols / 2 - 1 && k < cols / 2 + 1  )){
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
              layers[i][j*cols + k] = HOUSE;
            }else if(Math.random() * 100 < 3 && layers[i-1][j * cols + k] == GRASS){
              if(Math.random() * 10 <= 3){layers[i][j * cols + k] = BURNT_TREE;}
              else layers[i][j * cols  + k] = TREE;
<<<<<<< HEAD
            }else{
              layers[i][j*cols + k] = 0;
            }
=======
            }else {layers[i][j*cols + k] = 0;}
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
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

var map = {

  cols : MAPCOLS,
  rows : MAPROWS,
  tSize : TILESIZE,
  numLayers : NUMLAYERS,
<<<<<<< HEAD
  tiles: [],
=======
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559

  layers: generateMap(MAPROWS,MAPCOLS,NUMLAYERS),

  getTile: function(layer, col, row) {
      return this.layers[layer][col * this.cols + row];
  },
<<<<<<< HEAD
=======

  isUnclickable: function(x,y){
    //takes x,y coordinates from the mouse function and checks if the tile is clickable
      var col = Math.floor(x / this.tSize);
      var row = Math.floor(y / this.tSize);
      var found = false;

      for(var i=0; i<this.layers.length;i++){
        var tile = this.getTile(i, col, row);
        found = tile === TREE || tile === HOUSE || tile === BURNT_TREE;
        return found;
        }
      //return unclickable;
  },
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
  getCol: function (x) {
    return Math.floor(x / this.tSize);
  },
  getRow: function (y) {
    return Math.floor(y / this.tSize);
  },
  getX: function (col) {
    return col * this.tSize;
  },
  getY: function (row) {
    return row * this.tSize;
<<<<<<< HEAD
  },
  isInteraction: function(x,y){
    //takes x,y coordinates from the mouse function and checks if the tile is clickable
      var col = this.getCol(y);
      var row = this.getRow(x);
      this.tiles = [];

      for(var i=0; i<this.layers.length;i++){
        if(
            this.getTile(i, col - 1, row) > 5 ||
            this.getTile(i, col + 1, row) > 5 ||
            this.getTile(i, col, row + 1) > 5 ||
            this.getTile(i, col, row - 1) > 5 ||
            this.getTile(i, col + 1, row - 1) > 5 ||
            this.getTile(i, col + 1, row + 1) > 5 ||
            this.getTile(i, col - 1, row - 1) > 5 ||
            this.getTile(i, col - 1, row + 1) > 5
          ){
          this.tiles[i] = this.getTile(i, col, row);
          return true;
        }
    }
=======
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
  }
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

<<<<<<< HEAD
//Friend Constructor
function Friend(map, x, y){
  this.map = map;
  this.x = x;
  this.y = y;
  this.width = map.tSize;
  this.height = map.tSize;

  this.image = Loader.getImage('hero');

}

=======
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
//Hero Constructor
function Hero(map, x, y) {
    this.map = map;
    this.x = x;
    this.y = y;
    this.width = map.tSize;
    this.height = map.tSize;

    this.velX = 0;
    this.velY = 0;
    this.image = Loader.getImage('hero');
<<<<<<< HEAD
    this.imageFlip = Loader.getImage('hero-flip');
=======
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
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
<<<<<<< HEAD
    //console.log(this.velY + " " + this.velX);
=======
      console.log(this.velY + " " + this.velX);
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
        this.x += this.velX;
        this.y += this.velY;

      // clamp values
      var maxX = this.map.cols * this.map.tSize;
      var maxY = this.map.rows * this.map.tSize;
    //  this.x = Math.max(0, Math.min(this.x, maxX));
    //  this.y = Math.max(0, Math.min(this.y, maxY));
  } else  {Mouse.click.arrived = true; Game.hero.walking = false; console.log('arrived'); }
};

<<<<<<< HEAD

//calls async loading of image assets (resolves on load)
Game.load = function () {
    return [
        Loader.loadImage('frieza', './images/frieza.png'),
        Loader.loadImage('house', './images/house.png'),
        Loader.loadImage('tiles', './images/tiles.png'),
        Loader.loadImage('hero', './images/hero.png'),
        Loader.loadImage('hero-flip', './images/hero-flip')
=======
//calls async loading of image assets (resolves on load)
Game.load = function () {
    return [
        Loader.loadImage('house', './images/house.png'),
        Loader.loadImage('tiles', './images/tiles.png'),
        Loader.loadImage('hero', './images/hero.png'),
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
    ];
};

//initialization function
Game.init = function () {
<<<<<<< HEAD
    this.frieza.image = Loader.getImage('frieza');
    this.houseSprite = Loader.getImage('house');
    this.tileSet = Loader.getImage('tiles');
    this.hero = new Hero(map, 465, 4470);
=======
    this.houseSprite = Loader.getImage('house');
    this.tileSet = Loader.getImage('tiles');
    this.hero = new Hero(map, 488, 4521);
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
    this.camera = new Camera(map, 512, 512);
    this.camera.follow(this.hero);

    // initial draw of the map
    // underscore prefix simply means the function is intended for
    // private use only (To be used by Game and Game only)
    this._drawMap();
};

Game.update = function (delta) {
<<<<<<< HEAD
=======
  //  this.hasScrolled = false;
    // handle camera movement with arrow keys
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
    Game.gameTime += delta;
    var dirx = 0;
    var diry = 0;

<<<<<<< HEAD
    //checks the click object for a new click and moves the character if so.
    if(Mouse.currentDest()){
      this.hero.move(delta, Mouse.click.x,Mouse.click.y);
    }

    if(map.isInteraction(this.hero.x,this.hero.y)){
      console.log('interactive unit in range!');
    }
    this.camera.update();
};
=======
    if(Mouse.isClick()){
      this.hero.move(delta, Mouse.click.x,Mouse.click.y);
    //  this.hasScrolled = true;
    }
    this.camera.update();
};

>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
Game._drawMap = function () {
    map.layers.forEach(function (layer, index) {
        this._drawLayer(index);
    }.bind(this));
};

Game._drawLayer = function (layer) {

    //calculates which tileMap elements are within camera view
    //and renders only those.
<<<<<<< HEAD
=======

>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
    //
    var startCol = Math.floor(this.camera.x / map.tSize);
    //console.log(startCol);
    var endCol = startCol + (this.camera.width / map.tSize);
    var startRow = Math.floor(this.camera.y / map.tSize);
    var endRow = startRow + (this.camera.height / map.tSize);
    var offsetX = -this.camera.x + startCol * map.tSize;
    var offsetY = -this.camera.y + startRow * map.tSize;

    for (var c = startCol; c <= endCol; c++) {
        for (var r = startRow; r <= endRow; r++) {
            var tile = map.getTile(layer, r, c);
            var x = (c - startCol) * map.tSize + offsetX;
            var y = (r - startRow) * map.tSize + offsetY;
<<<<<<< HEAD
            switch(tile){
              case 6:
=======
            if(tile === HOUSE){
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
                this.ctx.drawImage(
                  this.houseSprite,
                  0,
                  0,
                  77,
                  115,
<<<<<<< HEAD
                  Math.round(x) - 35,
                  Math.round(y) - 40,
                  77,
                  115
                );
                break;
              case 101:
              this.ctx.drawImage(
                this.frieza.image,
                0,
                0,
                77,
                115,
                Math.round(x) - 35,
                Math.round(y) - 40,
                77,
                115
              );
              break;
              default: // 0 => empty tile
=======
                  Math.round(x),
                  Math.round(y),
                  77,
                  115
                );
            }else if (tile !== 0) { // 0 => empty tile
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
                this.ctx.drawImage(
                    this.tileSet, // image
                    (tile - 1) * map.tSize, // source x
                    0, // source y
                    map.tSize, // source width
                    map.tSize, // source height
                    Math.round(x),  // target x
                    Math.round(y), // target y
                    map.tSize, // target width
                    map.tSize // target height
                );
<<<<<<< HEAD
                break;
=======
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
            }
        }
    }
};

Game.render = function () {
    let i = 1;
    this._drawLayer(0);
    //draw hero
<<<<<<< HEAD
    if(Game.hero.velX < 0){
      if(Game.gameTime % 2 > 1){
        if(i > 4){
          i = 1;
          console.log(i);
          i++;
        }
      }
      this.ctx.drawImage(
        this.hero.imageFlip,
=======
    if(Game.hero.walking === true){
      console.log("walking");
      if(i >= 5){i = 1;}
        this.ctx.drawImage(
        this.hero.image,
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
        (i - 1) * map.tSize,
        0,
        map.tSize,
        map.tSize,
        this.hero.screenX - this.hero.width / 2,
        this.hero.screenY - this.hero.height / 2,
        map.tSize,
        map.tSize
      );
<<<<<<< HEAD
=======
      i++;
>>>>>>> ef72b4344cf5ae98273f8b3f46b8fe3ee6c6b559
    }else this.ctx.drawImage(
      this.hero.image,
      0,
      0,
      map.tSize,
      map.tSize,
      this.hero.screenX - this.hero.width / 2,
      this.hero.screenY - this.hero.height / 2,
      map.tSize,
      map.tSize
    );
    this._drawLayer(1);
};


//
// start up function
//

window.onload = function () {
  var canvas = document.getElementById('canvas');
  canvas.addEventListener("click", Mouse.handleClick);
  canvas.width = CANVASWIDTH;
  canvas.height = CANVASHEIGHT;
  var context = canvas.getContext('2d');
  Game.run(context);
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
