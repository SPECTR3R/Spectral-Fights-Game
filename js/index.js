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
    this.gameOverMusic = new Audio('./audio/gameOverSound.mp3');
    this.gameOverMusic.volume = 0.3;

    this.sound = true;
    // Animation state
    this.state = 'load';
    this.interval = undefined;
    // Image game over
    this.imgGameOver1 = new Image();
    this.imgGameOver1.src = ' ./images/gameOver1.png';
    this.imgGameOver2 = new Image();
    this.imgGameOver2.src = ' ./images/gameOver2.png';

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
  gameOver(winner) {
    const img = winner === 'player1' ? this.imgGameOver2 : this.imgGameOver1;
    ctx.drawImage(img, 200, 200);
    this.gameOverMusic.load();
    if (this.sound) this.gameOverMusic.play();
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
    this.width = 85;
    this.height = 65;
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
    //logic properties
    this.lives = 3;
    this.facing = 'right';
    this.mode = 'normal';
    this.hot = false;
    this.shieldUp = false;
    this.swordUp = false;
    this.bullets = [];
    // Graphic properties
    this.spriteRow = 1;
    this.spriteCol = 1;
    this.img = new Image();
    this.img.src = this.costume();
    this.plataforms = [];
    this.bulletImgL = new Image();
    this.bulletImgL.src = './images/bulletImgL.png';
    this.bulletImgR = new Image();
    this.bulletImgR.src = './images/bulletImgR.png';
    this.lifeIndicatorImg = new Image();
    this.lifeIndicatorImg.src = './images/lifeIndicator.png';
  }
  // Graphic methdos
  draw() {
    ctx.drawImage(
      this.img,
      (this.spriteCol - 1) * 61,
      (this.spriteRow - 1) * 47,
      61,
      47,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  drawLives() {
    if (!this.color) {
      for (let i = 0; i < this.lives; i++) {
        ctx.drawImage(this.lifeIndicatorImg, 380 - i * 30, 33, 30, 30);
      }
    } else {
      for (let i = 0; i < this.lives; i++) {
        ctx.drawImage(this.lifeIndicatorImg, 430 + i * 30, 33, 30, 30);
      }
    }
  }

  costume() {
    return this.color ? './images/redCostume.png' : './images/blueCostume.png';
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
      this.spriteRow = 1;
      this.spriteCol = 2;
      this.facing = 'right';
      if (this.velX < this.speed) {
        this.velX++;
      }
    }
    // Left
    // fighter 1: a ->  [65]
    // fighter 2: arrow left -> [37]
    if ((keys[65] && this.color) || (keys[37] && !this.color)) {
      this.spriteRow = 2;
      this.spriteCol = 2;
      this.facing = 'left';
      if (this.velX > -this.speed) {
        this.velX--;
      }
    }
    // Down
    // fighter 1: s ->  [83]
    // fighter 2: arrow down -> [40]
    if ((keys[83] && this.color) || (keys[40] && !this.color)) {
      if (!this.hot) this.mode = 'paper';
    }

    // Melee
    // fighter 1: x ->  [88]
    // fighter 2: k -> [75]
    if ((keys[88] && this.color) || (keys[75] && !this.color)) {
      if (!this.hot) this.mode = 'scissor';
    }

    // Shoot
    // fighter 1: x ->  [67]
    // fighter 2: k -> [76]
    if ((keys[67] && this.color) || (keys[76] && !this.color)) {
      if (!this.hot) {
        this.bullets.push([this.x, this.y, this.facing]);
        this.mode = 'rock';
      }
    }

    //Movement
    this.x += this.velX;
    this.velX *= this.friction;
    //jump
    this.y += this.velY;
    this.velY += this.gravity;
    this.grounded = false;
    this.plataforms.map((platform) => {
      const direction = this.collisionCheck(this, platform);
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
  // skill methods
  normal() {
    this.hot = false;
    this.shieldUp = false;
    this.swordUp = false;
    this.spriteRow = this.facing === 'right' ? 1 : 2;
    this.spriteCol = 1;
  }
  paper() {
    let fps = 12;
    if (this.color) {
      this.shieldUp = true;
      if (this.hot === false) {
        frames1 = 0;
        this.hot = true;
      }
      this.spriteRow = this.facing === 'right' ? 7 : 8;
      if (frames1 < fps) this.spriteCol = 1;
      else if (frames1 < 1 * fps) this.spriteCol = 2;
      else if (frames1 < 10 * fps) this.spriteCol = 3;
      else if (frames1 < 20 * fps) {
        this.shieldUp = false;
        this.spriteRow = this.facing === 'right' ? 1 : 2;
        this.spriteCol = 1;
        ctx.font = '20px Metal Gear';
        ctx.fillText('hot', this.x, this.y);
      } else this.mode = 'normal';
    } else {
      this.shieldUp = true;
      if (this.hot === false) {
        frames1 = 0;
        this.hot = true;
      }
      this.spriteRow = this.facing === 'right' ? 7 : 8;
      if (frames1 < fps) this.spriteCol = 1;
      else if (frames1 < 1 * fps) this.spriteCol = 2;
      else if (frames1 < 10 * fps) this.spriteCol = 3;
      else if (frames1 < 20 * fps) {
        this.shieldUp = false;
        this.spriteRow = this.facing === 'right' ? 1 : 2;
        this.spriteCol = 1;
        ctx.font = '20px Metal Gear';
        ctx.fillText('hot', this.x, this.y);
      } else this.mode = 'normal';
    }
  }
  scissor() {
    let fps = 12;
    if (this.color) {
      this.swordUp = true;
      if (this.hot === false) {
        frames1 = 0;
        this.hot = true;
      }
      this.spriteRow = this.facing === 'right' ? 5 : 6;
      if (frames1 < fps) this.spriteCol = 1;
      else if (frames1 < 1 * fps) this.spriteCol = 2;
      else if (frames1 < 2 * fps) this.spriteCol = 3;
      else if (frames1 < 20 * fps) {
        this.swordUp = false;
        this.spriteRow = this.facing === 'right' ? 1 : 2;
        this.spriteCol = 1;
        ctx.font = '20px Metal Gear';
        ctx.fillText('hot', this.x, this.y);
      } else this.mode = 'normal';
    } else {
      this.swordUp = true;
      if (this.hot === false) {
        frames1 = 0;
        this.hot = true;
      }
      this.spriteRow = this.facing === 'right' ? 5 : 6;
      if (frames1 < fps) this.spriteCol = 1;
      else if (frames1 < 1 * fps) this.spriteCol = 2;
      else if (frames1 < 2 * fps) this.spriteCol = 3;
      else if (frames1 < 20 * fps) {
        this.swordUp = false;
        this.spriteRow = this.facing === 'right' ? 1 : 2;
        this.spriteCol = 1;
        ctx.font = '20px Metal Gear';

        ctx.fillText('hot', this.x, this.y);
      } else this.mode = 'normal';
    }
  }
  rock() {
    let fps = 12;
    if (this.color) {
      if (this.hot === false) {
        frames1 = 0;
        this.hot = true;
      }
      this.spriteRow = this.facing === 'right' ? 3 : 4;
      if (frames1 < fps) this.spriteCol = 1;
      else if (frames1 < 3 * fps) this.spriteCol = 2;
      else if (frames1 < 4 * fps) this.spriteCol = 3;
      else if (frames1 < 20 * fps) {
        this.spriteRow = this.facing === 'right' ? 1 : 2;
        this.spriteCol = 1;
        ctx.font = '20px Metal Gear';
        ctx.fillText('hot', this.x, this.y);
      } else this.mode = 'normal';
    } else {
      if (this.hot === false) {
        frames1 = 0;
        this.hot = true;
      }
      this.spriteRow = this.facing === 'right' ? 3 : 4;
      if (frames1 < fps) this.spriteCol = 1;
      else if (frames1 < 3 * fps) this.spriteCol = 2;
      else if (frames1 < 4 * fps) this.spriteCol = 3;
      else if (frames1 < 20 * fps) {
        this.spriteRow = this.facing === 'right' ? 1 : 2;
        this.spriteCol = 1;
        ctx.font = '20px Metal Gear';
        ctx.fillText('hot', this.x, this.y);
      } else this.mode = 'normal';
    }
  }
  // Colision methods
  collisionCheck(char, plat) {
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
let frames1 = 0;
let frames2 = 0;

let points = 0;
let clickCoordinates;
let dir = true;
let color = '#ffffff';
let waiter = false;
let keys = [];
// Instances
const board = new Board();
const fighter1 = new Fighter(345, 458, true);
const fighter2 = new Fighter(494, 240, false);
// platforms
// big plat
fighter1.plataforms.push(new Plataform(53, 519, 725, 8));
fighter2.plataforms.push(new Plataform(53, 519, 725, 8));
// corner left plat
fighter1.plataforms.push(new Plataform(65, 403, 80, 8));
fighter2.plataforms.push(new Plataform(65, 403, 80, 8));
// corner right plat
fighter1.plataforms.push(new Plataform(695, 403, 100, 8));
fighter2.plataforms.push(new Plataform(695, 403, 100, 8));
// center left plat
fighter1.plataforms.push(new Plataform(280, 313, 100, 8));
fighter2.plataforms.push(new Plataform(280, 313, 100, 8));
// center right plat
fighter1.plataforms.push(new Plataform(465, 313, 100, 8));
fighter2.plataforms.push(new Plataform(465, 313, 100, 8));

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
function resetFrames1() {
  frames1 = 0;
}
function resetFrames2() {
  frames2 = 0;
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
    frames++;
    if (frames===100){
      vulnerable1=true
      vulnerable2=true
    }
    frames1++;
    frames2++;

    board.animateBattlefieldScreen();
    fighter1.draw();
    fighter2.draw();
    fighter1.movefighter(keys);
    fighter2.movefighter(keys);
    fighter1.drawLives();
    fighter2.drawLives();

    if (fighter1.lives <= 0 || fighter2.y > canvas.height) {
      board.battleMusic.muted=true

      board.gameOver('player2');
    }
    if (fighter2.lives <= 0 || fighter1.y > canvas.height) {
      board.battleMusic.muted=true

      board.gameOver('player1');

    }
    if (fighter1.mode === 'normal') fighter1.normal();
    if (fighter2.mode === 'normal') fighter2.normal();
    if (fighter1.mode === 'paper') fighter1.paper();
    if (fighter2.mode === 'paper') fighter2.paper();
    if (fighter1.mode === 'scissor') fighter1.scissor();
    if (fighter2.mode === 'scissor') fighter2.scissor();
    if (fighter1.mode === 'rock') fighter1.rock();
    if (fighter2.mode === 'rock') fighter2.rock();

    if (fighter1.swordUp === true && collition(fighter1, fighter2)) {
      if (vulnerable2) {
        fighter1.lives = fighter1.lives - 1;

        vulnerable2 = false;
        resetFrames()
      }
    }

     if (fighter2.swordUp === true && collition(fighter2, fighter1)) {
      if (vulnerable1) {
        vulnerable1 = false;
                fighter2.lives = fighter2.lives - 1;

        resetFrames()
      }
    }

    fighter1.bullets.forEach((bullet, index) => {
      if (bullet[2] === 'left') {
        ctx.drawImage(fighter1.bulletImgL, bullet[0] + 50, bullet[1] + 32, 10, 10);
        bullet[0] -= 8;
      } else {
        ctx.drawImage(fighter1.bulletImgR, bullet[0] + 15, bullet[1] + 32, 10, 10);
        bullet[0] += 8;
      }
      if (
        fighter2.shieldUp === false &&
        collition(fighter2, { x: bullet[0], y: bullet[1], width: 10, height: 10 })
      ) {
        fighter1.bullets.splice(index, 1);
        fighter1.lives = fighter1.lives - 1;
      }
    });

    fighter2.bullets.forEach((bullet, index) => {
      if (bullet[2] === 'left') {
        ctx.drawImage(fighter2.bulletImgL, bullet[0] + 50, bullet[1] + 32, 10, 10);
        bullet[0] -= 8;
      } else {
        ctx.drawImage(fighter2.bulletImgR, bullet[0] + 15, bullet[1] + 32, 10, 10);
        bullet[0] += 8;
      }
      if (
        fighter1.shieldUp === false &&
        collition(fighter1, { x: bullet[0], y: bullet[1], width: 10, height: 10 })
      ) {
        fighter2.bullets.splice(index, 1);
        fighter2.lives = fighter2.lives - 1;
      }
    });
  }
};
var vulnerable1 = true;
var vulnerable2 = true;

function collition(rect1, rect2) {
  // console.log(rect1.y)
  if (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y
  ) {
    return true;
  } else false;
}
