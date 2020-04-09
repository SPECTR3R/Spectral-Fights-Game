// Get canvas from DOM
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
//  classes
class Board {
  constructor() {
    // Dimension properties
    this.y = 0;
    this.x = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    // Audio properties
    this.briefingMusic = new Audio('./audio/briefingMusic.mp3');
    this.briefingMusic.volume = 0.3;
    this.buttonShootSound = new Audio('./audio/buttonShootSound.mp3');
    this.buttonShootSound.volume = 0.3;
    this.beginBlattleSound = new Audio('./audio/beginBlattleSound.mp3');
    this.beginBlattleSound.volume = 0.3;
    this.battleMusic = new Audio('./audio/battleMusic.mp3');
    this.battleMusic.volume = 0.3;

    this.sound = true;
    // Animation state
    this.state = 'load';
    this.interval = undefined;
    // Image of battlefield screen
    this.imgBattlefield = new Image();
    this.imgBattlefield.src = ' ./images/battlefieldScreenBG.svg';
    // Image of battlefield load screen
    this.imgBattlefieldLoad = new Image();
    this.imgBattlefieldLoad.src = ' ./images/battlefieldLoadScreenBG.svg';
    // Image of instructions screen
    this.imgInstruc = new Image();
    this.imgInstruc.src = ' ./images/instructionScreenBG.svg';
    // Image of start screen
    this.imgSrtart = new Image();
    this.imgSrtart.src = ' ./images/startScreenBG.svg';
    // Inmediately load start screen
    this.imgSrtart.onload = () => {
      this.animateStartScreen();
      //this.state = 'fight';
    };
  }
  // Start screen method
  animateStartScreen(color) {
    this.clean();
    ctx.drawImage(this.imgSrtart, 0, 0);
    ctx.fillStyle = color;
    ctx.font = '55px Espionage';
    ctx.fillText('start game', 80, 160);
  }
  // Instruction screen method
  animateInstructionsScreen(color) {
    this.clean();
    ctx.drawImage(this.imgInstruc, 0, 0);
    ctx.fillStyle = color;
    ctx.font = '30px Espionage';
    ctx.fillText('BEGIN', 625, 238);
  }
  // Battlefield load screen method
  animateBattlefieldLoadScreen() {
    this.clean();
    ctx.drawImage(this.imgBattlefieldLoad, 0, 0);
    ctx.fillStyle = '#ffffff';
    ctx.font = '100px Metal Gear';
    if (frames > 0 && frames <= 40) {
      ctx.fillText('3', 400, 300);
    } else if (frames > 40 && frames <= 80) {
      ctx.fillText('2', 400, 300);
    } else if (frames > 80 && frames <= 120) {
      ctx.fillText('1', 400, 300);
    } else if (frames > 120 && frames <= 160) {
      ctx.fillText('GO!', 330, 300);
    } else {
      this.state = 'fight';
      resetFrames();
    }
  }
  // Battlefield  screen methods
  animateBattlefieldScreen() {
    this.clean();
    ctx.drawImage(this.imgBattlefield, 0, 0, this.width, this.height);
  }
  // Audio methods
  buttonShoot() {
    this.buttonShootSound.load();
    if (this.sound) this.buttonShootSound.play();
  }
  briefingSound() {
    this.briefingMusic.load();
    if (this.sound) this.briefingMusic.play();
  }

  beginBlattle() {
    this.beginBlattleSound.load();
    if (this.sound) this.beginBlattleSound.play();
  }

  battleSound() {
    this.battleMusic.load();
    if (this.sound) this.battleMusic.play();
  }
  SoundOff() {
    this.briefingMusic.volume = 0;
    this.buttonShootSound.volume = 0;
    this.battleMusic.volume = 0;
    this.beginBlattleSound.volume = 0;
  }
  SoundOn() {
    this.briefingMusic.volume = 0.3;
    this.buttonShootSound.volume = 0.3;
    this.battleMusic.volume = 0.3;
    this.beginBlattleSound.volume = 0.3;
  }
  // Auxiliar methods
  clean() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  gameOver() {
    clearInterval(this.interval);
  }
  gameRestart() {}
  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
class Fighter {
  constructor(x = 300, y = 200, color = 'true') {
    // basic properties
    this.x = x;
    this.y = y;
    this.width = 65;
    this.height = 70;
    this.color = color;
    // Physical properties
    this.gravity = 0.98;
    this.speed = 5;
    this.friction = 0.8;
    this.velX = 0;
    this.velY = 0;
    this.jumping = false;
    this.jumpStrength = 8;
    this.grounded = false;
    // Graphic properties
    this.spriteRow = 0;
    this.spriteCol = 0;
    this.img = new Image();
    this.plataforms = [];
    this.img.src = this.costume();
  }

  // Graphic methdos
  draw() {
    ctx.drawImage(
      this.img,
      this.spriteCol * 45,
      this.spriteRow * 48,
      44,
      47,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  costume() {
    return this.color ? './images/red.png' : './images/red.png';
  }

  // Movement method
  movefighter(keys) {
    // Up
    // fighter 1: w ->  [87]
    // fighter 2: arrow up -> [38]
    if ((keys[87] && this.color) || (keys[38] && !this.color)) {
      if (!this.jumping) {
        this.velY = -this.jumpStrength * 2;
        this.jumping = true;
      }
    }
    // Right
    // fighter 1: d ->  [68]
    // fighter 2: arrow right -> [39]
    if ((keys[68] && this.color) || (keys[39] && !this.color)) {
      this.spriteRow = 0;
      this.spriteCol = 1;
      if (this.velX < this.speed) {
        this.velX++;
      }
    }
    // Left
    // fighter 1: a ->  [65]
    // fighter 2: arrow left -> [37]
    if ((keys[65] && this.color) || (keys[37] && !this.color)) {
      this.spriteRow = 1;
      this.spriteCol = 1;
      if (this.velX > -this.speed) {
        this.velX--;
      }
    }

    /* 
    // Down
    // fighter 1: s ->  [83]
    // fighter 2: arrow down -> [40]
    if ((keys[83] && this.color) || (keys[40] && !this.color)) {
      if (this.vel Y < this.speed) {
        this.vel Y++;
      }
    }
    */

    //movimiento
    this.x += this.velX;
    this.velX *= this.friction;
    //jump
    this.y += this.velY;

    this.velY += this.gravity;

    this.grounded = false;
    this.plataforms.map((platform) => {
      const direction = collisionCheck(this, platform);
      if (direction == 'left' || direction == 'right') {
        this.velX = 0;
      } else if (direction == 'bottom') {
        this.jumping = false;
        this.grounded = true;
      } else if (direction == 'top') {
        this.velY *= -1;
      }
    });
    if (this.grounded) {
      this.velY = 0;
    }
  }

  // Colision methdos
  crash(obstacle) {
    if (
      obstacle.x < this.x + this.width &&
      obstacle.x + obstacle.width > this.x &&
      obstacle.y < this.y + this.height &&
      obstacle.height + obstacle.y > this.y
    )
      return true;
  }
}
class Plataform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

// Aux variables
let frames = 0;
let points = 0;
let clickCoordinates;
let dir = true;
let color = '#ffffff';
let waiter = false;
let keys = [];
// Instances
const board = new Board();
const fighter1 = new Fighter(90, 250, true);
const fighter2 = new Fighter(680, 240, false);
// platforms
// big plat
fighter1.plataforms.push(new Plataform(53, 515, 725, 8));
fighter2.plataforms.push(new Plataform(53, 515, 725, 8));
// corner left plat
fighter1.plataforms.push(new Plataform(65, 399, 100, 8));
fighter2.plataforms.push(new Plataform(65, 399, 100, 8));
// corner right plat
fighter1.plataforms.push(new Plataform(675, 399, 100, 8));
fighter2.plataforms.push(new Plataform(675, 399, 100, 8));
// center left plat
fighter1.plataforms.push(new Plataform(280, 310, 100, 8));
fighter2.plataforms.push(new Plataform(280, 310, 100, 8));
// center right plat
fighter1.plataforms.push(new Plataform(465, 310, 100, 8));
fighter2.plataforms.push(new Plataform(465, 310, 100, 8));

// Event listenersd
//    Load listener
window.onload = () => {
  setTimeout((board.interval = setInterval(updategame, 1000 / 60)), 3000);
};
//    Movement listeners
document.body.addEventListener('keydown', (e) => {
  keys[e.keyCode] = true;
});
document.body.addEventListener('keyup', (e) => {
  keys[e.keyCode] = false;
});
//    Mouse listener
canvas.addEventListener('mousedown', function (clientX) {
  let rect = canvas.getBoundingClientRect();
  clickCoordinates = [Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top)];
  console.log(clickCoordinates);
  // Button start
  if (
    board.state === 'load' &&
    clickCoordinates[0] > 80 &&
    clickCoordinates[0] < 565 &&
    clickCoordinates[1] > 120 &&
    clickCoordinates[1] < 180
  ) {
    board.state = 'instructionsPause';
    resetFrames();
    board.buttonShoot();
    setTimeout(function () {
      board.briefingSound();
    }, 2000);
  }
  // Button begin
  if (
    board.state === 'instructionsAnimate' &&
    clickCoordinates[0] > 620 &&
    clickCoordinates[0] < 760 &&
    clickCoordinates[1] > 220 &&
    clickCoordinates[1] < 250
  ) {
    board.state = 'battlefield';
    resetFrames();
    board.briefingMusic.pause();
    board.beginBlattle();
    setTimeout(function () {
      board.battleSound();
    }, 3800);
  }
  // Button restart
  if (
    board.state === 'fight' &&
    clickCoordinates[0] > 60 &&
    clickCoordinates[0] < 135 &&
    clickCoordinates[1] > 15 &&
    clickCoordinates[1] < 50
  ) {
    window.location.reload();
  }
  // Button sound
  if (
    board.state === 'fight' &&
    clickCoordinates[0] > 710 &&
    clickCoordinates[0] < 800 &&
    clickCoordinates[1] > 15 &&
    clickCoordinates[1] < 50
  ) {
    board.sound = board.sound ? false : true;
    !board.sound ? board.SoundOff() : board.SoundOn();
  }
});

// Helper functions
function resetFrames() {
  frames = 0;
}
let oscilateColor = (frames) => {
  let num = Math.floor(127 * Math.cos(30 * frames) + 127);
  let color = '#' + num.toString(16) + num.toString(16) + num.toString(16);
  return color.length < 7 ? '#000000' : color;
};

// Main function
const updategame = () => {
  if (board.state === 'load') {
    frames++;
    color = oscilateColor(frames / 1000);
    board.animateStartScreen(color);
    //fighter1.draw();
  }
  if (board.state === 'instructionsPause') {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    frames++;
    if (frames > 50) {
      board.state = 'instructionsAnimate';
      frames = 0;
    }
  }
  if (board.state === 'instructionsAnimate') {
    frames++;
    color = oscilateColor(frames / 1000);
    board.animateInstructionsScreen(color);
  }
  if (board.state === 'battlefield') {
    frames++;
    board.animateBattlefieldLoadScreen();
  }
  if (board.state === 'fight') {
    board.animateBattlefieldScreen();
    fighter1.draw();
    fighter2.draw();
    fighter1.movefighter(keys);

    fighter2.movefighter(keys);
  }
};

function collisionCheck(char, plat) {
  const vectorX = char.x + char.width / 2 - (plat.x + plat.width / 2);
  const vectorY = char.y + char.height / 2 - (plat.y + plat.height / 2);

  const halfWidths = char.width / 2 + plat.width / 2;
  const halfHeights = char.height / 2 + plat.height / 2;

  let collisionDirection = null;

  if (Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights) {
    var offsetX = halfWidths - Math.abs(vectorX);
    var offsetY = halfHeights - Math.abs(vectorY);
    if (offsetX < offsetY) {
      if (vectorX > 0) {
        collisionDirection = 'left';
        char.x += offsetX;
      } else {
        collisionDirection = 'right';
        char.x -= offsetX;
      }
    } else {
      if (vectorY > 0) {
        collisionDirection = 'top';
        char.y += offsetY;
      } else {
        collisionDirection = 'bottom';
        char.y -= offsetY;
      }
    }
  }
  return collisionDirection;
}
