const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

class Board {
  constructor() {
    // Dimension properties
    this.y = 0;
    this.x = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.speed = 1;
    // Animation state properties
    this.state = 'load';
    this.interval = undefined;
    // Image of battlefield screen
    this.imgBattlefield = new Image();
    this.imgBattlefield.src = ' ./images/battlefieldBG.jpg';
    // Image of instructions screen
    this.imgInstruc = new Image();
    this.imgInstruc.src = ' ./images/instructionScreenBG.svg';
    // Image of start screen
    this.imgSrtart = new Image();
    this.imgSrtart.src = ' ./images/startScreenBG.svg';
    // Inmediately load start screen
    this.imgSrtart.onload = () => {
      this.startScreen();
    };
  }

  // Start screen methods
  startScreen() {
    this.clean();
    ctx.drawImage(this.imgSrtart, 0, 0);
  }
  animateStartScreen(color) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(66, 125, 500, 46);
    ctx.fillStyle = color;
    ctx.font = '55px Espionage';
    ctx.fillText('start game', 80, 160);
  }
  // Instruction screen methods
  instructionsScreen() {
    this.clean();
    ctx.drawImage(this.imgInstruc, 0, 0);
  }
  animateInstructionsScreen(color) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(620, 218, 140, 22);
    ctx.fillStyle = color;
    ctx.font = '30px Espionage';
    ctx.fillText('BEGIN', 625, 238);
  }
  // Battlefield load screen methods
  battlefieldLoadScreen() {
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
  gameRestart() {
  }
  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}

// Instances
const board = new Board(canvas);

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
    board.state = 'instructions';
    frames = 0;
  }
  if (
    board.state === 'instructionsAnimate' &&
    clickCoordinates[0] > 620 &&
    clickCoordinates[0] < 760 &&
    clickCoordinates[1] > 220 &&
    clickCoordinates[1] < 250
  ) {
    board.state = 'battlefield';
    frames = 0;
  }
});

let oscilateColor = (frames) => {
  let num = Math.floor(127 * Math.cos(30 * frames) + 127);
  let color = '#' + num.toString(16) + num.toString(16) + num.toString(16);
  return color.length < 7 ? '#000000' : color;
};

// Main functions

const updategame = () => {
  if (board.state === 'load') {
    frames += 0.001;
    color = oscilateColor(frames);
    board.animateStartScreen(color);
  }
  if (board.state === 'instructions') {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    frames++;
    if (frames > 50) {
      board.instructionsScreen();
      board.state = 'instructionsAnimate';
      frames = 0;
      dir = true;
    }
  }
  if (board.state === 'instructionsAnimate') {
    frames += 0.001;
    color = oscilateColor(frames);
    board.animateInstructionsScreen(color);
  }
  if (board.state === 'battlefield') {
    board.battlefieldLoadScreen();
  }
};
