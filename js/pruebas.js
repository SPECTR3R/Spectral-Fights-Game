movefighter(keys) {
  // player 1
  // up -> w [87]
  // down -> s [83]
  // left -> a [65]
  // right -> d [68]

  // hero 2
  // up -> arrow up [38]
  // down -> arrow down [40]
  // left -> arrow left [37]
  // right -> arrow right [39]
  if (keys[68] && this.color) {
    if (this.velX < this.speed) {
      this.velX++;
    }
  }

  if (keys[65] && this.color) {
    if (this.velX > -this.speed) {
      this.velX--;
    }
  }

  if (keys[83] && this.color) {
    if (this.velY < this.speed) {
      this.velY++;
    }
  }

  if (keys[87] && this.color) {
    if (this.velY > -this.speed) {
      this.velY--;
    }
  }

  this.x += this.velX;
  this.velX *= friction;

  this.y += this.velY;
  this.velY *= friction;
}
