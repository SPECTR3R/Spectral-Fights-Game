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

    // image properties
    this.imgLine = new Image();
    this.imgLine.src = ' ./images/line.png';
    this.imgSrtart = new Image();
    this.imgSrtart.src = ' ./images/grayFox.jpg';
    this.imgSrtart.onload = () => {
      this.loadScreen();
    };
  }

  clean() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  loadScreen() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.imgSrtart, this.x + 100, this.y + 155);
    ctx.drawImage(this.imgLine, 85, 140, 400, 1);
    ctx.drawImage(this.imgLine, 85, 200, 400, 1);
  }

  AnimateLoadScreen(color) {

    if (color.length<7) color = '#000000'

    ctx.fillStyle = '#000000';
    ctx.fillRect(110, 150, 350, 40);
    ctx.fillStyle = color;
    ctx.font = '40px Espionage';
    ctx.fillText('start game', 110, 180);
  }

  draw() {
    this.x--;
    if (this.x < -this.width) this.x = 0;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.drawImage(this.img, this.x + this.width, this.y, this.width, this.height);
  }

  gameOver() {
    clearInterval(this.interval);
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
// Listeners
canvas.addEventListener('mousedown', function (clientX) {
  let rect = canvas.getBoundingClientRect();
  clickCoordinates = [Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top)];
  console.log(clickCoordinates);
});

window.onload = () => {
  setTimeout((board.interval = setInterval(updategame, 1000 / 60)), 1000);
};

document.addEventListener('keydown', ({ keyCode }) => {
  // if (keyCode === 88) //do something;
});

// main functions

const updategame = () => {
  if ((board.state = 'load')) {
    if (frames === 0 || frames > 250) dir = dir ? false : true;
    dir ? frames-=2 : frames+=2;
    color = '#' + frames.toString(16) + frames.toString(16) + frames.toString(16);
    board.AnimateLoadScreen(color);
  }
  /*else if(board.state = 'load'){}
else if(board.state = 'load'){}*/
};
