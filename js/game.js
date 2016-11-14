/*
The object structure used here was taken from the simple
tilemap scrolling example from mdn.
*/


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
function Hero(heroNum,map, x, y, inv) {
    Game.heroSelected = heroNum;
    this.map = map;
    this.x = x;
    this.y = y;
    switch(heroNum){
      case 1:
        this.width = map.tSize;
        this.height = map.tSize;
        this.flipOffset = 0;
        this.standOffset = 0;
      break;
      case 2:
        this.width = 34;
        this.height = 45;
        this.flipOffset = 74;
        this.standOffset = 33;
      break;
      case 3:
        this.width = 32;
        this.height = 44;
        this.flipOffset = 0;
        this.standOffset = 0;
        break;
      default:break;
    }
    this.velX = 0;
    this.velY = 0;
    this.image = Loader.getImage('hero'+heroNum);
    this.imageFlip = Loader.getImage('hero'+heroNum+'-flip');

    this.inventory = inv || [];
}

Hero.SPEED = 200; // pixels per second

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
  } else  {Mouse.click.arrived = true; Game.hero.walking = false;}
};

function MenuButton(ctx, name, x, y, width, height, bg, color, action) {
    this.action = action;
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    (function draw(ctx){
      var ctx = ctx;
      ctx.save();
        ctx.fillStyle = bg;
        ctx.fillRect(x,y,width,height);
        ctx.font = "18px monospace";
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          name,
          x + (width/2),
          y + (height/2)
        );
    })(ctx);
}

//
// Game object
//
var Game = {};

//passing save object to init and starting loop
Game.startFromSave = function(save) {
    this.elapsed = 0;
    this.gameTime = save.gameTime;
    this.saved = false;
    this.init(save);
    window.requestAnimationFrame(this.tick);
};

Game.startNew = function() {
    this.elapsed = 0;
    this.gameTime = 0;
    this.saved = false;
    this.init();
    window.requestAnimationFrame(this.tick);
};

//this is our render loop
Game.tick = function(elapsed) {
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

Game.startMenu = function(context, canvas) {
  //display starting UI
  this.inStartMenu = true;
  this.ctx = context;
  this.startMenu.buttons = [];
  this.bgX = CANVASWIDTH / 6;
  this.bgY = CANVASHEIGHT / 4;
  this.bgWidth = CANVASWIDTH - 2*this.bgX;
  this.bgHeight = CANVASHEIGHT - 2*this.bgY;
  this.ctx.font = "18px monospace";
  this.ctx.fillStyle = "#333";
  this.ctx.textAlign = "center";
  this.ctx.textBaseline = "middle";
  this.ctx.fillText(
    "Welcome, how would you like to start?",
    CANVASWIDTH/2,
    this.bgY
  );
  this.startMenu.buttons.push(new MenuButton(
      this.ctx,
      "Start New",
      this.bgX + (this.bgWidth / 2 - this.bgWidth/2.5),
      this.bgY + (this.bgHeight / 2 - this.bgHeight/8),
      this.bgWidth / 3,
      this.bgHeight / 4,
      "#27801c",
      "#fff",
      function(){
        Game.inStartMenu = false;
        Game.inCharacterSelect = true;
        Game.characterSelect();
      }
  ));
  if(Game.save){
    this.startMenu.buttons.push(new MenuButton(
        this.ctx,
        "Continue",
        this.bgX + (this.bgWidth / 2 + (this.bgWidth/2 - this.bgWidth/2.5)),
        this.bgY + (this.bgHeight / 2 - this.bgHeight/8),
        this.bgWidth / 3,
        this.bgHeight / 4,
        "#27801c",
        "#fff",
        function(){
          Game.inStartMenu = false;
          Game.startFromSave(Game.save);
        }
      ));
    }
  }

Game.characterSelect = function(save) {
  var imageWidth = 50;
  var hero1 = Loader.getImage("hero1");
  var hero2 = Loader.getImage("hero2");
  var hero3 = Loader.getImage("hero3");
  this.characterSelect.buttons = [];
  this.ctx.clearRect(0,0,CANVASWIDTH,CANVASHEIGHT);
  this.ctx.font = "18px monospace";
  this.ctx.fillStyle = "#333";
  this.ctx.textAlign = "center";
  this.ctx.textBaseline = "middle";
  this.ctx.fillText(
    "Please Select your character",
    CANVASWIDTH/2,
    this.bgY
  );
  this.ctx.drawImage(hero1, 0,0,32,50, (CANVASWIDTH/4)-(imageWidth/2), (this.bgY + 40) + 50, 32,50);
  this.ctx.drawImage(hero2, 0,0,32,50, 2*(CANVASWIDTH/4)-(imageWidth/2), (this.bgY + 30) + 50, 32,50);
  this.ctx.drawImage(hero3, 0,0,32,50, 3*(CANVASWIDTH/4)-(imageWidth/2), (this.bgY + 30) + 50, 32,50);
  this.characterSelect.buttons.push(new MenuButton(
        this.ctx,
        "1",
        (CANVASWIDTH/4)-(imageWidth/2),
        this.bgY + 130,
        30,
        30,
        "#27801c",
        "#fff",
        function(){
          Game.inCharacterSelect = false;
          Game.heroSelected = 1;
          Game.startNew();
        }
        ));
  this.characterSelect.buttons.push(new MenuButton(
        this.ctx,
        "2",
        2*(CANVASWIDTH/4)-(imageWidth/2),
        this.bgY + 130,
        30,
        30,
        "#27801c",
        "#fff",
        function(){
          Game.inCharacterSelect = false;
          Game.heroSelected = 2;
          Game.startNew();
        }
        ));
  this.characterSelect.buttons.push(new MenuButton(
        this.ctx,
        "3",
        3*(CANVASWIDTH/4)-(imageWidth/2),
        this.bgY + 130,
        30,
        30,
        "#27801c",
        "#fff",
        function(){
          Game.inCharacterSelect = false;
          Game.heroSelected = 3;
          Game.startNew();
        }
        ));

}

//saves important game objects to local storage
Game.saveGame = function(){
  var saveObj = {};
  saveObj.gameTime = this.gameTime;
  saveObj.layers = this.map.layers;
  saveObj.heroX = this.hero.x;
  saveObj.heroY = this.hero.y;
  saveObj.heroSelected = Game.heroSelected;
  saveObj.inventory = this.hero.inventory;
  saveObj.itemsDown = this.itemsDown;
  if(window.localStorage.setItem('gameSave',JSON.stringify(saveObj))){
    return true;
  }else return false;
}

//this will handle hero interactions with NPCs, Objects, and the house
Game.launchInteraction = function(index){
  //if the interaction is an item, add it to the inventory and show
  //a message.
  if(index >= 1000){
    var obj = this.map.getItem(index);
    this.hero.inventory.push(obj);
  // this.displayItemInfo(obj);
  }else if (index != 6){
    var obj = this.map.getFriend(index);
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
        Loader.loadImage('items', './images/items.png'),
        Loader.loadImage('hero1', './images/hero.png'),
        Loader.loadImage('hero2', './images/hero2.png'),
        Loader.loadImage('hero3', './images/hero3.png'),
        Loader.loadImage('hero1-flip', './images/hero-flip.png'),
        Loader.loadImage('hero2-flip', './images/hero2-flip.png'),
        Loader.loadImage('hero3-flip', './images/hero3-flip.png'),
    ];
};


//initialization function
Game.init = function (save) {
    this.itemsDown = [];
    this.map = new Map();
    if(save){
      this.itemsDown = save.itemsDown;
      this.map.layers = save.layers;
      this.hero = new Hero(save.heroSelected,this.map, save.heroX, save.heroY, save.inventory);
      this.camera = new Camera(this.map, 512, 512);
    }else{
      this.hero = new Hero(Game.heroSelected,this.map, 465, 4470);
      this.camera = new Camera(this.map, 512, 512);
    }
    this.map.itemsImage = Loader.getImage('items');
    this.loadFriends();
    this.houseSprite = Loader.getImage('house');
    this.tileSet = Loader.getImage('tiles');
    this.camera.follow(this.hero);
    // initial draw of the map
    // underscore prefix simply means the function is intended for
    // private use only (To be used by Game and Game only)
    this.saveGame();
    this._drawMap();
};

Game.update = function (delta) {
    this.gameTime += delta;
    //if 30 seconds have passed, save the game
    if((Math.floor(this.gameTime % 11) === 10 ) && this.saved == false){
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
            let friends = this.map.friends;
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
                  friends.frieza.image,
                  0,
                  0,
                  96,
                  96,
                  Math.round(x) - 20,
                  Math.round(y) - 20,
                  84,
                  84
                );
                break;
            case FRIENDS.PICCOLO:
              this.ctx.drawImage(
                friends.piccolo.image,
                0,
                friends.piccolo.spriteY,
                friends.piccolo.sourceWidth,
                friends.piccolo.sourceHeight,
                Math.round(x) - 12,
                Math.round(y) - 14,
                55,
                55
              );
              // this.ctx.save();
              // this.ctx.strokeStyle = "green";
              // this.ctx.beginPath();
              // this.ctx.arc(x+18, y+15, 58, 0, Math.PI*2);
              // this.ctx.stroke();
              // this.ctx.restore();
              break;
            case FRIENDS.BLUE_RANGER:
              this.ctx.drawImage(
                friends.blueRanger.image,
                friends.blueRanger.spriteX,
                friends.blueRanger.spriteY,
                friends.blueRanger.sourceWidth,
                friends.blueRanger.sourceHeight,
                Math.round(x),
                Math.round(y) - 10,
                friends.blueRanger.sourceWidth * .8,
                friends.blueRanger.sourceHeight * .8
              );
              break;
            case FRIENDS.PINK_RANGER:
              this.ctx.drawImage(
                friends.pinkRanger.image,
                friends.pinkRanger.spriteX,
                friends.pinkRanger.spriteY,
                friends.pinkRanger.sourceWidth,
                friends.pinkRanger.sourceHeight,
                Math.round(x + 2),
                Math.round(y - 14),
                this.map.friends.pinkRanger.sourceWidth * .8,
                this.map.friends.pinkRanger.sourceHeight * .8
              );
              break;
            default: // 0 => empty tile
                if(tile >= 1000){
                  //console.log(tile);
                    var item = this.map.getItem(tile);
                  //  console.log(item);
                    this.ctx.drawImage(
                      this.map.itemsImage,
                      item.spriteIndex,
                      0,
                      this.map.itemsWidth,
                      18,
                      Math.round(x),
                      Math.round(y),
                      this.map.itemsWidth,
                      18
                    );
                }else{
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
                }
                //DISPLAYS GRID FOR DEBUGGING & INTERACTION ZONES
                // this.ctx.save();
                // this.ctx.strokeStyle = "green";
                // this.ctx.beginPath();
                // this.ctx.arc(x, y, 1, 0, Math.PI*2);
                // this.ctx.stroke();
                // this.ctx.restore();
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
          Math.floor((Game.gameTime % .4) * 10) * this.hero.width,
          0,
          this.hero.width,
          this.hero.height,
          this.hero.screenX - this.hero.width / 2,
          this.hero.screenY - this.hero.height / 2,
          this.hero.width,
          this.hero.height
        );
      }else{
        this.ctx.drawImage(
          this.hero.imageFlip,
          this.hero.flipOffset,
          0,
          this.hero.width,
          this.hero.height,
          this.hero.screenX - this.hero.width / 2,
          this.hero.screenY - this.hero.height / 2,
          this.hero.width,
          this.hero.height
        );
      }
    }else {
    if(this.hero.walking === true){
        this.ctx.drawImage(
          this.hero.image,
          Math.floor((Game.gameTime % .4) * 10) * this.hero.width,
          0,
          this.hero.width,
          this.hero.height,
          this.hero.screenX - this.hero.width / 2,
          this.hero.screenY - this.hero.height / 2,
          this.hero.width,
          this.hero.height
        );
      }else{
        this.ctx.drawImage(
          this.hero.image,
          this.hero.standOffset,
          0,
          this.hero.width,
          this.hero.height,
          this.hero.screenX - this.hero.width / 2,
          this.hero.screenY - this.hero.height / 2,
          this.hero.width,
          this.hero.height
        );
      }
  }
    this._drawLayer(2);
};


//
// start up functions
//

window.onload = function () {
  var gameStarted = false;
  var gameLoaded = localStorage.getItem('gameSave') || null;
  var canvas = document.getElementById('canvas');
  canvas.addEventListener("click", Mouse.handleClick);
  canvas.width = CANVASWIDTH;
  canvas.height = CANVASHEIGHT;
  var context = canvas.getContext('2d');
  if(gameLoaded != null){
    Game.save = JSON.parse(gameLoaded);
  }
  var promises = Game.load();
  //this promise.all call waits for all promises
  //within function call to be resolved, then resolves
  //if all internal promises get resolved, and rejects if any
  //promises reject
  Promise.all(promises).then(function (loaded) {
      //initialize once images are loaded
      Game.startMenu(context, canvas);
  }.bind(this));
}
