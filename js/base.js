const CANVASWIDTH = 512;
const CANVASHEIGHT = 512;
const MAPCOLS = 64;
const MAPROWS = 750;
const NUMLAYERS = 3;
const TILESIZE = 32;

//interactive objects
const HOUSE = 6;

const ITEMS = {
              goldenNuggetPlus: 1001,
              goldenNugget:1002,
              gleamingMushroom:1003,
              purpleOrb: 1004,
              weirdClam: 1005,
              humanHeart: 1006,
              bigPill: 1007,
              slimyDrink: 1008,
              religiousObject: 1009,
              saphireGem: 1010,
              fineRuby: 1011
             };
var FRIENDS = {
               FRIEZA: 101,
               PICCOLO: 102,
               BLUE_RANGER: 103,
               PINK_RANGER: 104,
               LINK: 105
             };
var SOUNDS = {
              STEP1: "./sounds/step1.ogg",
              STEP2: "./sounds/step2.wav",
              ITEM_PICKUP: "./sounds/itemPickup.wav",
              FRIEND_UNLOCK:"./sounds/friendUnlock.wav"
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
    images: {},
    sounds: {},
    done: 0
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

Loader.loadSound = function(key, src){
  var audio = new Audio();
  var p = new Promise(function(resolve,reject){
        audio.onloadedmetadata = function(){
            console.log("done");
            this.sounds[key] = audio;
            resolve(audio);
        }.bind(this);
        audio.onerror = function(e) {
          switch (e.target.error.code) {
            case e.target.error.MEDIA_ERR_ABORTED:
              alert('You aborted the video playback.');
              break;
            case e.target.error.MEDIA_ERR_NETWORK:
              alert('A network error caused the audio download to fail.');
              break;
            case e.target.error.MEDIA_ERR_DECODE:
              alert('The audio playback was aborted due to a corruption problem or because the video used features your browser did not support.');
              break;
            case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
              alert('The video audio not be loaded, either because the server or network failed or because the format is not supported.');
              break;
            default:
              alert('An unknown error occurred.');
              break;
          }
        };
    }.bind(this));
    audio.src = src;
    audio.load();
    return p;
  };

Loader.getImage = function (key) {
    return (key in this.images) ? this.images[key] : null;
};
/*Keyboard handler*/
var Keyboard = {};

Keyboard.Q = 81;
Keyboard.ESC = 27;
Keyboard.W = 87;
Keyboard.Y = 89;
Keyboard.N = 78;

Keyboard._keys = {};

Keyboard.listenForEvents = function (keys) {
    window.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('keyup', this._onKeyUp.bind(this));

    keys.forEach(function(key) {
        this._keys[key] = false;
    }.bind(this));
  }

Keyboard._onKeyDown = function (event) {
    var keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = true;
    }
  };

Keyboard._onKeyUp = function (event) {
    var keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = false;
    }
  };

Keyboard.isDown = function (keyCode) {
    if (!keyCode in this._keys) {
        throw new Error('Keycode ' + keyCode + ' is not being listened to');
    }
    return this._keys[keyCode];
  };


/* mouse input handling */
var Mouse = {};
Mouse.click = {
  x: -1,
  y: -1,
  arrived: true,
}

//click handler
Mouse.handleDown = function(e) {
  var event =  window.event || e;
  event.preventDefault();
  if(Game.inStartMenu){
    for(var i=0; i < Game.startMenu.buttons.length; i++){
      var button = Game.startMenu.buttons[i];
      if(
         (event.offsetX >= button.x) &&
         (event.offsetX <= (button.x + button.width)) &&
         (event.offsetY >= button.y) &&
         (event.offsetY <= (button.y + button.height))
       ){button.action();}
    }
    }else if (Game.inCharacterSelect) {
    for(var i=0; i < Game.characterSelect.buttons.length; i++){
      var button = Game.characterSelect.buttons[i];
      if(
         (event.offsetX >= button.x) &&
         (event.offsetX <= (button.x + button.width)) &&
         (event.offsetY >= button.y) &&
         (event.offsetY <= (button.y + button.height))
       ){button.action();}
    }
  }else if(Game.inGame){
    if(Game.displayBackpack === true){
     var x = event.offsetX;
     var y = event.offsetY;
     if((x> 100 && x < CANVASWIDTH - 100) && (y > 100 && y < CANVASHEIGHT - 200)){
       var col = Math.floor((x-100)/Game.hero.invTileWidth);
       var row = Math.floor((y-100)/Game.hero.invTileHeight);
       var item = Game.hero.getItemFromInv(col,row);
       if(item != -1){
         Game.selectedItem = item;
       }
   }else{
     Mouse.down = true;
     Mouse.click.arrived = false;
     Game.hero.walking = true;
     var destX = event.offsetX + Game.camera.x;
     var destY = event.offsetY + Game.camera.y;
     Mouse.click.x = destX;
     Mouse.click.y = destY;
    }
  }else{
    Mouse.down = true;
    Mouse.click.arrived = false;
    Game.hero.walking = true;
    var destX = event.offsetX + Game.camera.x;
    var destY = event.offsetY + Game.camera.y;
    Mouse.click.x = destX;
    Mouse.click.y = destY;
  }
  }
};

Mouse.handleUp = function(e){
  if(Mouse.down === true){
    Mouse.down = false;
  }
}

Mouse.handleMove =  function(e){
  Mouse.currentX = e.offsetX;
  Mouse.currentY = e.offsetY;
  if(Mouse.down === true && Mouse.click.x != -1){
    Mouse.click.arrived = false;
    Game.hero.walking = true;
    var destX = e.offsetX + Game.camera.x;
    var destY = e.offsetY + Game.camera.y;
    Mouse.click.x = destX;
    Mouse.click.y = destY;
  }
};

Mouse.currentDest = function (){
  if(Mouse.down == true){
    Mouse.click.x = Mouse.currentX + Game.camera.x;
    Mouse.click.y = Mouse.currentY + Game.camera.y;
  }
//    console.log(this.click.arrived);
    if(Mouse.down || Mouse.click.arrived === false){
      return true;
    }else return false;
  };
