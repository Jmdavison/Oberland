//Main JS file

const CANVASWIDTH = 512;
const CANVASHEIGHT = 512;
const MAPCOLS = 16;
const MAPROWS = 16;
const NUMLAYERS = 2;
const TILESIZE = 32;

const TREE = 2;
const HOUSE = 6;
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

Mouse.click = {};

Mouse.up = function (e) {
  var event =  window.event || e;
  var y = event.offsetY;
  var x = event.offsetX;

  Mouse.click = {
    x: x,
    y: y,
    used:false
  }

  }

  Mouse.isClick = function (){
    return !this.click.used;
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
            if( j == 0 || (j == rows - 1) ||  k == 0 ||  (k == cols - 1)){
              if(Math.random() * 10 <= 3){layers[i][j * cols + k] = BURNT_TREE;}
              else layers[i][j * cols  + k] = TREE;
            }else if(j >= rows - 8  && j <= rows -7) {layers[i][j*cols + k] = STREET;}
            else if(j >= rows - 6  &&  k == cols/2  ) {layers[i][j*cols + k] = CONCRETE;}
            else {layers[i][j*cols + k] = GRASS;}
            break;
          case 1:
            if((j == rows - 3 ) && (k == cols / 2 - 1  )){
              layers[i][j*cols + k] = HOUSE;
            }else {layers[i][j*cols + k] = 0;}
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

  layers: generateMap(MAPROWS,MAPCOLS,NUMLAYERS),

  getTile: function(layer, col, row) {
      return this.layers[layer][col * this.cols + row];
  },

  isUnclickable: function(x,y){
      var col = Math.floor(x / this.tSize);
      var row = Math.floor(y / this.tSize);

      for(var i=0; i<this.layers.length;i++){
        var tile = this.getTile(i, col, row);
        var unclickable = tile === TREE || tile === HOUSE || tile === BURNT_TREE;
        return unclickable;
      }
  },
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

//Hero Constructor
function Hero(map, x, y) {
    this.map = map;
    this.x = x;
    this.y = y;
    this.width = map.tSize;
    this.height = map.tSize;

    this.image = Loader.getImage('hero');
}

Hero.SPEED = 256; // pixels per second

Hero.prototype.move = function (delta, dirx, diry) {
    // move hero
    this.x += dirx * Hero.SPEED * delta;
    this.y += diry * Hero.SPEED * delta;


    // clamp values
    var maxX = this.map.cols * this.map.tSize;
    var maxY = this.map.rows * this.map.tSize;
    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
};


//calls async loading of image assets (resolves on load)
Game.load = function () {
    return [
        Loader.loadImage('house', './images/house.png'),
        Loader.loadImage('tiles', './images/tiles.png'),
        Loader.loadImage('hero', './images/hero.png'),
    ];
};

//initialization function
Game.init = function () {
    this.houseSprite = Loader.getImage('house');
    this.tileSet = Loader.getImage('tiles');
    this.hero = new Hero(map, 150, 150);
    this.camera = new Camera(map, 512, 512);
    this.camera.follow(this.hero);
    // create a canvas for each layer
    // the map() call applies the function statements for each element in
    // the iterable (the layers array)
    this.layerCanvas = map.layers.map(function () {
        var c = document.createElement('canvas');
        c.width = CANVASWIDTH;
        c.height = CANVASHEIGHT;
        return c;
    });

    // initial draw of the map
    // underscore prefix simply means the function is intended for
    // private use only (To be used by Game and Game only)
    this._drawMap();
};

Game.update = function (delta) {
    this.hasScrolled = false;
    // handle camera movement with arrow keys
    var dirx = 0;
    var diry = 0;

    if(Mouse.isClick()){
      console.log(map.isUnclickable(Mouse.click.x,Mouse.click.y));;
      Mouse.click.used = true;
    }

    if (dirx !== 0 || diry !== 0) {
        this.camera.move(delta, dirx, diry);
        this.hasScrolled = true;
    }
    this.camera.update();
};

Game._drawMap = function () {
    map.layers.forEach(function (layer, index) {
        this._drawLayer(index);
    }.bind(this));
};

Game._drawLayer = function (layer) {
    var context = this.layerCanvas[layer].getContext('2d');
    context.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);

    //calculates which tileMap elements are within camera view
    //and renders only those.

    //
    var startCol = Math.floor(this.camera.x / map.tSize);
    var endCol = startCol + (this.camera.width / map.tSize);
    var startRow = Math.floor(this.camera.y / map.tSize);
    var endRow = startRow + (this.camera.height / map.tSize);
    var offsetX = -this.camera.x + startCol * map.tSize;
    var offsetY = -this.camera.y + startRow * map.tSize;

    for (var c = startCol; c <= endCol; c++) {
        for (var r = startRow; r <= endRow; r++) {
            var tile = map.getTile(layer, c, r);
            var y = (c - startCol) * map.tSize + offsetX;
            var x = (r - startRow) * map.tSize + offsetY;
            if(tile === HOUSE){
                context.drawImage(
                  this.houseSprite,
                  0,
                  0,
                  77,
                  115,
                  Math.round(x),
                  Math.round(y),
                  77,
                  115
                );
            }else if (tile !== 0) { // 0 => empty tile
                context.drawImage(
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
            }
        }
    }
};

Game.render = function () {
    this.ctx.drawImage(this.layerCanvas[0], 0, 0);

    //draw hero
    this.ctx.drawImage(
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

    this.ctx.drawImage(this.layerCanvas[1], 0, 0);
};

//
// start up function
//

window.onload = function () {
  var canvas = document.getElementById('canvas');
  canvas.onmouseup = Mouse.up;
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
