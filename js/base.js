const CANVASWIDTH = 512;
const CANVASHEIGHT = 512;
const MAPCOLS = 30;
const MAPROWS = 144;
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
Mouse.handleClick = function(e) {
  var event =  window.event || e;
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
  }else{
    Mouse.click.arrived = false;
    Game.hero.walking = true;
    var destX = event.offsetX + Game.camera.x;
    var destY = event.offsetY + Game.camera.y;

    Mouse.click.x = destX;
    Mouse.click.y = destY;
  }
}

Mouse.currentDest = function (){
//    console.log(this.click.arrived);
    if(this.click.arrived == false && this.click.x !== -1){
      return true;
    }else return false;
  }
