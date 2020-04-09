const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
// Canvas class
class Board {
  constructor() {
    // Dimension properties
    this.y = 0;
    this.x = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.sound = true;
    // Animation state properties
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

// Instances
const board = new Board();

// Aux variables
let frames = 0;
let points = 0;
let clickCoordinates;
let dir = true;
let color = '#ffffff';
let waiter = false;

// Listeners
window.onload = () => {
  setTimeout((board.interval = setInterval(updategame, 1000 / 60)), 3000);
};

document.addEventListener('keydown', ({ keyCode }) => {
  // if (keyCode === 88) //do something;
});

canvas.addEventListener('mousedown', function (clientX) {
  let rect = canvas.getBoundingClientRect();
  clickCoordinates = [Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top)];
  console.log(clickCoordinates);
  if (
    board.state === 'load' &&
    clickCoordinates[0] > 80 &&
    clickCoordinates[0] < 565 &&
    clickCoordinates[1] > 120 &&
    clickCoordinates[1] < 180
  ) {
    board.state = 'instructionsPause';
    resetFrames();
  }
  if (
    board.state === 'instructionsAnimate' &&
    clickCoordinates[0] > 620 &&
    clickCoordinates[0] < 760 &&
    clickCoordinates[1] > 220 &&
    clickCoordinates[1] < 250
  ) {
    board.state = 'battlefield';
    resetFrames();
  }
  if (
    board.state === 'fight' &&
    clickCoordinates[0] > 60 &&
    clickCoordinates[0] < 135 &&
    clickCoordinates[1] > 15 &&
    clickCoordinates[1] < 50
  ) {
    ccccc
  }

  if (
    board.state === 'fight' &&
    clickCoordinates[0] > 710 &&
    clickCoordinates[0] < 800 &&
    clickCoordinates[1] > 15 &&
    clickCoordinates[1] < 50
  ) {
    board.sound = board.sound ? false : true;
    console.log(board.sound);
  }
});
// helper functions
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
  }
};
