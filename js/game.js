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

Camera.SPEED = 100; // pixels per second


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
    this.invTileWidth = 0;
    this.invTileHeight = 0;

    this.getItemFromInv = function(col,row){
      for(var i = 0; i < this.inventory.length; i++){
        if((this.inventory[i].col == col) && (this.inventory[i].row == row)){
          return this.inventory[i];
        }
      }
      return -1;
    }

    this.checkQuestReadiness = function(index, numRequired){
      for(var i = 0; i < this.inventory.length; i++){
        if(this.inventory[i].index == index && this.inventory[i].numberOwned >= numRequired){
          return true;
        }
      }
      return false;
    }
}

Hero.SPEED = 256; // pixels per second

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
    (function _draw(ctx){
      var ctx = ctx;
      ctx.save();
        ctx.fillStyle = bg;
        ctx.fillRect(x,y,width,height);
        ctx.font = "30px PixelType";
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          name,
          x + (width/2),
          y + (height/2)+3
        );
      ctx.restore();
    })(ctx);
}

//
// Game object
//
var Game = {};

//passing save object to init and starting loop
Game.startFromSave = function(save) {
    this.inGame = true;
    this.elapsed = 0;
    this.gameTime = save.gameTime;
    this.saved = false;
    this.init(save);
    window.requestAnimationFrame(this.tick);
};

Game.startNew = function() {
    this.inGame = true;
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
  var bg = Loader.getImage("startbg");
  this.inStartMenu = true;
  this.ctx = context;
  this.startMenu.buttons = [];
  this.bgX = CANVASWIDTH / 6;
  this.bgY = CANVASHEIGHT / 4;
  this.bgWidth = CANVASWIDTH - 2*this.bgX;
  this.bgHeight = CANVASHEIGHT - 2*this.bgY;
  this.ctx.save();
  this.ctx.font = "40px PixelType";
  this.ctx.fillStyle = "#fff";
  this.ctx.textAlign = "center";
  this.ctx.textBaseline = "middle";
  this.ctx.drawImage(bg,0,0,CANVASWIDTH,CANVASHEIGHT);
  this.ctx.fillText(
    "Hey! You finally woke up,",
    CANVASWIDTH/2,
    this.bgY
  );
  this.ctx.fillText(
      "better get started now.",
      CANVASWIDTH/2,
      this.bgY + 40
    );
  this.startMenu.buttons.push(new MenuButton(
      this.ctx,
      "Start New",
      this.bgX + (this.bgWidth / 2 - this.bgWidth/2.5),
      this.bgY + (this.bgHeight / 2 - this.bgHeight/8),
      this.bgWidth / 3,
      this.bgHeight / 4,
      "#1c2480",
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
        "#1c2480",
        "#fff",
        function(){
          Game.inStartMenu = false;
          Game.inCharacterSelect = false;
          Game.startFromSave(Game.save);
        }
      ));
    }
    this.ctx.restore();
  };

Game.characterSelect = function(save) {
  var imageWidth = 50;
  var hero1 = Loader.getImage("hero1");
  var hero2 = Loader.getImage("hero2");
  var hero3 = Loader.getImage("hero3");
  this.characterSelect.buttons = [];
  this.ctx.clearRect(0,0,CANVASWIDTH,CANVASHEIGHT);
  this.ctx.save();
  this.ctx.font = "40px PixelType";
  this.ctx.fillStyle = "#333";
  this.ctx.textAlign = "center";
  this.ctx.textBaseline = "middle";
  this.ctx.fillText(
    "Please select your character",
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
  this.ctx.restore();
};

//this will handle hero interactions with NPCs, Objects, and the house
Game.launchInteraction = function(){
  //if the interaction is an item, add it to the inventory and show
  //a message.
  var index = this.currentInteraction;
  var item = this.map.getItem(index);
  var flag = false;

  if(index >= 1000){
    //BEGIN ITEM INTERACTION
     for(var i = 0; i < this.hero.inventory.length; i++){
        if(this.hero.inventory[i].index == index){
          this.hero.inventory[i].numberOwned += 1;
          flag = true;
        }
      }
      if(flag == false){
        item.numberOwned += 1;
        this.hero.inventory.push(item);
      }
    item.notif = item.name + " + 1";
    this.uiStream.push([item,this.gameTime]);
  }else if (index !== 6){
    //BEGIN CHARACTER INTERACTION
    var obj = this.map.getFriend(index);
    this.friendInteraction = [ obj, this.gameTime ];
  }
};

//saves important game objects to local storage
Game.saveGame = function(){
  var saveObj = {};
  saveObj.gameTime = this.gameTime;
  saveObj.layers = this.map.layers;
  saveObj.heroX = this.hero.x;
  saveObj.heroY = this.hero.y;
  saveObj.heroSelected = Game.heroSelected;
  saveObj.inventory = this.hero.inventory;
  saveObj.friends = this.map.friends;
  if(window.localStorage.setItem('gameSave',JSON.stringify(saveObj))){
    return true;
  }else return false;
}


//load friend images
Game.loadFriends = function() {
    this.map.friends.frieza.image = Loader.getImage('frieza');
    this.map.friends.piccolo.image = Loader.getImage('piccolo');
    this.map.friends.blueRanger.image = Loader.getImage('blue-ranger');
    this.map.friends.pinkRanger.image = Loader.getImage('pink-ranger');
    this.map.friends.link.image = Loader.getImage('link');
};

//calls async loading of image assets (resolves on load)
Game.load = function () {
     return [
        // Loader.loadSound('step1', SOUNDS.STEP1),
        // Loader.loadSound('step2', SOUNDS.STEP2),
        // Loader.loadSound('itemPickup', SOUNDS.ITEM_PICKUP),
        // Loader.loadSound('friendUnlock', SOUNDS.FRIEND_UNLOCK),
        document.fonts.load("18px PixelType"),
        Loader.loadImage('startbg', './images/bgimg.png'),
        Loader.loadImage('piccolo', './images/piccolo.png'),
        Loader.loadImage('frieza', './images/frieza.png'),
        Loader.loadImage('blue-ranger', './images/blue-ranger.png'),
        Loader.loadImage('pink-ranger', './images/pink-ranger.png'),
        Loader.loadImage('link', './images/link-nu.png'),
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
    this.controls.style.visibility = 'initial';
    this.displayBackpack = false;
    this.displayGameInfo = false;
    this.displayQuestInfo = false;
    this.friendInteraction = null;
    this.selectedItem = null;
    this.uiStream = [];
    Keyboard.listenForEvents([Keyboard.Q,Keyboard.W,Keyboard.ESC,Keyboard.Y,Keyboard.N]);
    this.map = new Map();
    if(save){
      this.itemsDown = save.itemsDown;
      this.map.layers = save.layers;
      this.map.friends = save.friends;
      this.hero = new Hero(save.heroSelected,this.map, save.heroX, save.heroY, save.inventory);
      this.camera = new Camera(this.map, 512, 512);
    }else{
      this.hero = new Hero(Game.heroSelected,this.map, (MAPCOLS*TILESIZE)/2, (MAPROWS*TILESIZE) - 150);
      this.camera = new Camera(this.map, 512, 512);
      this.map.loadQuests(this.map);
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
      this.saved = true;
    }else if(Math.floor(this.gameTime % 11) === 0 && this.saved == true){
      this.saved =false;
    }else if(Math.floor(this.gameTime % 30) === 0){changeColors(canvas);}
    //if key is held display appropriate info
    if(Keyboard.isDown(Keyboard.Q)){this.displayBackpack = true;}
    else if (Keyboard.isDown(Keyboard.ESC)){this.displayGameInfo = true;}
    else if(Keyboard.isDown(Keyboard.W)){this.displayQuestInfo = true;}
    else {
      this.displayBackpack = false;
      this.displayGameInfo = false;
      this.displayQuestInfo = false;
    }
    //checks the click object for a new click and moves the character if so.
    if(Mouse.currentDest()){
      this.hero.move(delta, Mouse.click.x,Mouse.click.y);
    }

    if(this.map.isInteraction(this.hero.x,this.hero.y)){
    //  console.log('interactive unit in range! Code: ' + this.map.interaction);
        Game.launchInteraction();
    }
    this.camera.update();
};

Game._displayFriendUnlockedCelebration = function(friend,timeStart){
  var since = this.gameTime - timeStart;
  this.ctx.save();
  this.ctx.font = '38px PixelType';
  this.ctx.fillStyle = "white";
  this.ctx.textAlign = "center";
  this.ctx.textBaseline = "middle";
  this.ctx.fillText(friend.name + " UNLOCKED!",CANVASWIDTH/2,CANVASHEIGHT/2);
  this.ctx.restore();
};

Game._displayGameInfo = function(){
    var height  = CANVASHEIGHT-200;
    var width   = CANVASWIDTH -200;
    this.ctx.save();

      this.ctx.fillStyle = "#d1c27f";
      this.ctx.fillRect(100,100,width,height);
      this.ctx.strokeStyle = "#16150e";
      this.ctx.lineWidth = 5;
      this.ctx.strokeRect(100,100,width,height);
      this.ctx.fillStyle="#16150e";
      this.ctx.font="22px PixelType";
      var text = "Welcome to Oberland, Wisconsin. Where you've found yourself alone, wonderring your small suburban neighborhood -- Just like you always do. Collect items and bring them to those who you know best.";
       wrapText(this.ctx,text,110,125,width-5,15);
      // var text = "During the day, you will find need to defend your house from the endless waves of normies. Position the friends that you've unlocked and theyll attack each visitor that approaches.";
      //wrapText(this.ctx,text,110,230,width -5,15);
      var text = "Created by Jacob Davison, for COSC 231 at Eastern Michigan University. Educational purposes only.";
      this.ctx.font = "18px PixelType";
      wrapText(this.ctx,text,110,height+50,width -5,15);
    this.ctx.restore();
};
Game._displayQuestInfo = function(){
    var height  = CANVASHEIGHT-200;
    var width   = CANVASWIDTH -200;
    this.ctx.save();
      this.ctx.fillStyle = "#d1c27f";
      this.ctx.fillRect(100,100,width,height);
      this.ctx.strokeStyle = "#16150e";
      this.ctx.lineWidth = 5;
      this.ctx.strokeRect(100,100,width,height);
      this.ctx.fillStyle="#16150e";
      this.ctx.font="48px PixelType";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      var text = "Quest Log";
      wrapText(this.ctx,text,CANVASWIDTH/2,125,width-5,15);
      this.ctx.font="36px PixelType";
      var count = 0;
      for(x in this.map.friends){
        text = x;
        if(this.map.friends[x].persuaded === true){
          this.ctx.fillStyle="green";
          wrapText(this.ctx,text,CANVASWIDTH/2,155+(30*count),width-5,15);
        }else{
          this.ctx.save();
          this.ctx.fillStyle="#474d56";
          wrapText(this.ctx,text,CANVASWIDTH/2,155+(50*count),width-5,15);
          this.ctx.font = '24px PixelType';
          var item = this.map.getItem(this.map.friends[x].quest.index);
          var needed  = this.map.friends[x].quest.numRequired - item.numberOwned;
          text = this.map.friends[x].quest.itemName + " -- " + needed + " needed";
          wrapText(this.ctx,text,CANVASWIDTH/2,175+(50*count),width-5,15);
          this.ctx.restore();
        }
        count++;
      }
    this.ctx.restore();
};
Game._displayBackpack = function(){
    var height  = CANVASHEIGHT-200;
    var width   = CANVASWIDTH -200;
    var cols = 4;
    itemWidth = (width - 10) / cols;
    itemHeight = (height - 10) / cols;

    this.ctx.save();
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "30px PixelType";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(
      "INVENTORY",
      CANVASWIDTH/2,
      90
    );
    this.ctx.restore();
    this.ctx.save();
    this.ctx.fillStyle = "#4c3606";
    this.ctx.fillRect(100,100,width,height);
    this.ctx.strokeStyle = "#16150e";
    this.ctx.lineWidth = 5;
    this.ctx.strokeRect(100,100,width,height);
    this.hero.invTileWidth = itemWidth;
    this.hero.invTileHeight = itemHeight;
    var inv = this.hero.inventory;
    var rows = Math.ceil(inv.length / cols);
    var color = "rgb(242, 214, 155, .8)";
    this.ctx.strokeStyle = color;
    var rowCount = 0;
    for(var i = 0; i < inv.length; i++){
          var colCount = i % (cols);
          if(i % cols == 0 && i != 0){rowCount++;}
          this.hero.inventory[i].col = colCount;
          this.hero.inventory[i].row = rowCount;
          if(inv[i] == this.selectedItem || (this.selectedItem == false && i == 0)){
            this.selectedItem = inv[i];
            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth = 1;
          }
          else{
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 1;}
          this.ctx.strokeRect(105+(colCount*itemWidth), 105+(rowCount*itemHeight), itemWidth-2, itemHeight-2);
          this.ctx.fillStyle = color;
          this.ctx.drawImage(
            this.map.itemsImage,
             inv[i].spriteIndex,
             0,
             this.map.itemsWidth,
             this.map.itemsWidth,
             105+(colCount*itemWidth)+10,
             105+(rowCount*itemHeight)+10,
             itemWidth/2,
             itemHeight/2
           );
        this.ctx.font = "16px PixelType";
        this.ctx.fillStyle = "white";
        wrapText(
          this.ctx,
          inv[i].name + " x " + inv[i].numberOwned,
          105+(colCount*itemWidth)+3,
          105+(rowCount*itemHeight)+itemHeight-18,
          itemWidth - 4,
          10
        );
    }
    if(this.selectedItem != null){
      this.ctx.strokeStyle = "white";
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(105,height+30,width-10,70);
      this.ctx.drawImage(
        this.map.itemsImage,
        this.selectedItem.spriteIndex,
        0,
        this.map.itemsWidth,
        this.map.itemsWidth,
        110,
        height+30,
        itemWidth/2,
        itemHeight/2
      );
      wrapText(
        this.ctx,
        this.selectedItem.name,
        110,
        height+80,
        itemWidth - 4,
        10
      );
      this.ctx.font = "24px PixelType";
      wrapText(
        this.ctx,
        this.selectedItem.comment,
        110+itemWidth+15,
        height+60,
        width - itemWidth*2,
        15
      );
      this.ctx.font = "40px PixelType";
      this.ctx.fillText("x "+this.selectedItem.numberOwned,width + 55,height+70);
    }
    this.ctx.restore();
};

Game._displayFriendInteraction = function(){
  if(this.friendInteraction != null){
    var since = this.gameTime - this.friendInteraction[1];
    var friend = this.friendInteraction[0];
    var item = this.map.getItem(friend.quest.index);
    this.ctx.save();
    if(this.hero.checkQuestReadiness(friend.quest.index,friend.quest.numRequired) == true && (friend.persuaded == false)){
      friend.currentConvo = 1;
      this.ctx.strokeStyle = "yellow";
      if(Keyboard.isDown(Keyboard.Y)){
        friend.persuaded = true;
        friend.currentConvo = 2;
        this.recentUnlock = {friend: friend,
                              time: this.gameTime};
        //this.hero.removeItemFromInv();
        this._displayFriendUnlockedCelebration(friend,this.gameTime);
      }
    }else{this.ctx.strokeStyle = "#1C1200";}
      this.ctx.fillStyle = "#BDA26E";
      this.ctx.fillRect(friend.x-100,friend.y-(friend.sourceHeight*1.4), 200, 50);
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(friend.x-100,friend.y-(friend.sourceHeight*1.4), 200 , 50);
      this.ctx.fillStyle = "#1C1200";
      this.ctx.font="18px PixelType";
      wrapText(this.ctx,friend.convo[friend.currentConvo],friend.x-93,friend.y-(friend.sourceHeight*1.2),190,10);
    this.ctx.restore();
    if(since > 1 ){
      this.friendInteraction = null;
    }
  }
};

Game._displayUI = function(){
    this.ctx.save();
    this.ctx.fillStyle = "white";
    this.ctx.font = "24px PixelType";
    this.ctx.strokeStyle = "#BC4E48";
    if(this.uiStream.length > 0){
      for(var i = 0; i < this.uiStream.length; i++){
        var timeSince = this.gameTime - this.uiStream[i][1];
        //console.log(timeSince);
        this.ctx.strokeText(this.uiStream[i][0].notif,5,(CANVASHEIGHT-10)-(i*15));
        this.ctx.fillText(this.uiStream[i][0].notif,5,((CANVASHEIGHT-10)-(i*15)));

        if(timeSince > 4){
        this.uiStream.shift();
        }
      }
    }
    this.ctx.restore();
};

Game._drawHero = function(){
    //draw hero
    if(Game.hero.velX < 0){
      if(Game.hero.walking === true){
        this.ctx.drawImage(
          this.hero.imageFlip,
          Math.floor((Game.gameTime % .4) * 10) * this.hero.width,
          0,
          this.hero.width,
          this.hero.height,
          this.hero.screenX - this.hero.width / 2,
          this.hero.screenY - this.hero.height + 10,
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
          this.hero.screenY - this.hero.height + 10,
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
          this.hero.screenY - this.hero.height + 10,
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
          this.hero.screenY - this.hero.height + 10,
          this.hero.width,
          this.hero.height
        );
      }
    }
  };

Game._drawFriend = function(friend,x,y){
  friend.x = x;
  friend.y = y;
      this.ctx.drawImage(
        friend.image,
        friend.spriteX,
        friend.spriteY,
        friend.sourceWidth,
        friend.sourceHeight,
        x - friend.sourceWidth/4,
        y - friend.sourceHeight/2,
        friend.sourceWidth,
        friend.sourceHeight
      );
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
            var friends = this.map.friends;
          //  console.log(tile);
            if(tile === HOUSE){
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
              }else if(tile >= 100 && tile < 1000){
                var friend = this.map.getFriend(tile);
              //  console.log(friend);
                this._drawFriend(friend, Math.floor(x),Math.floor(y));
            }else if(tile >= 1000){
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

                    //  DISPLAYS GRID FOR DEBUGGING & INTERACTION ZONES
                      // this.ctx.save();
                      // this.ctx.strokeStyle = "green";
                      // this.ctx.beginPath();
                      // this.ctx.arc(x, y, 1, 0, Math.PI*2);
                      // this.ctx.stroke();
                      // this.ctx.restore()
                }
              }
            };

Game.render = function () {
    let i = 1;
    this._drawLayer(0);
    this._drawLayer(1);
    this._drawHero();
    this._drawLayer(2);
    this._displayUI();
    this._displayFriendInteraction();
    if(this.displayGameInfo === true){
      this._displayGameInfo();
    }else if(this.displayBackpack === true) {
      this._displayBackpack();
    }else if(this.displayQuestInfo === true){
      this._displayQuestInfo();
    }
    if(this.recentUnlock){
      var since = this.gameTime - this.recentUnlock.time;
      if(since < 3){
        this._displayFriendUnlockedCelebration(this.recentUnlock.friend);
      }else{this.recentUnlock = null;}
    }
};

//
// start up functions
//

window.onload = function () {
  var gameStarted = false;
  var gameLoaded = localStorage.getItem('gameSave') || null;
  var canvas = document.getElementById('canvas');
  var wrapper = document.querySelector('.wrapper');
  var loading = document.querySelector('.loading');
  Game.controls = document.querySelector('.controls');
  changeColors(canvas);
  canvas.addEventListener("mousedown", Mouse.handleDown);
  canvas.addEventListener("mouseup", Mouse.handleUp);
  canvas.addEventListener("mousemove", Mouse.handleMove);
  canvas.width = CANVASWIDTH;
  canvas.height = CANVASHEIGHT;
  Game.sounds = [];
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
      this.wrapper.removeChild(loading);
      //initialize once images are loaded
      Game.startMenu(context, canvas);
  }.bind(this));
}
