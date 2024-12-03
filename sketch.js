let font;
let tSize = 100; // text size
let tposX = 500; // x position of text
let tposY = 500; // y position of text
let pointCount = 1; // between 0 - 1 particle count

let speed = 90; // speed of particles
let comebackSpeed = 100; // particles behavior after interaction
let dia = 70; // interaction diameter
let randomPos = true; // each particle from a random position when true
let pointsDirection = "general"; // left, right, up, down, general
let interactionDirection = -1; // between -1 and 1. Positive pulls, negative pushes

let textPoints = [];
let words = ["this is", "a lot", "of glitter"]; // Array of words
let currentWordIndex = 0; // Index of the current word

let sonundEffect

/////Colors/////
let Partred 
let Partblue
let PartGreen 

let bgRed
let bgBlue
let bgGreen

function preload() {
  font = loadFont("AvenirNextLTPro-Demi.otf");
  soundEffect = loadSound("glitter.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  tposX= windowWidth/2 -tSize*2
  tposY= windowHeight/2
  //let bounds = font.textBounds(words, 0, 0, tSize);
  ///let offsetX = (windowWidth - bounds.w) / 2 - bounds.x;
 /// let offsetY = (windowHeight - bounds.h) / 2 - bounds.y;
  textFont(font);
  generatePoints(words[currentWordIndex]);
}

function draw() {

  background(0, 0, 0,25);
  
   // Render the text points
  for (let i = 0; i < textPoints.length; i++) {
    let v = textPoints[i];
    v.update();
    v.show();
    v.behaviors();
  }

  // Check if the current word is "of glitter"
  if (words[currentWordIndex] === "of glitter") {
    // Create a blinking effect for the "click" message
    if (frameCount % 60 < 30) {
      noStroke()
      fill(202, 227, 252,70); // White color
      textSize(25);
      textAlign(CENTER, CENTER);
      text("click on glitter", width / 2, height-100); // Positioned at the bottom center
    }
  }

  for (let i = 0; i < textPoints.length; i++) {
    let v = textPoints[i];
    v.update();
    v.show();
    v.behaviors();
  }
}

// Handle scrolling to switch words
function mouseWheel(event) {
  console.log("Mouse scrolled, delta:", event.delta);

  if (event.delta > 0) {
    currentWordIndex = (currentWordIndex + 1) % words.length; // Move to the next word
  } else {
    currentWordIndex =
      (currentWordIndex - 1 + words.length) % words.length; // Move to the previous word
  }

  console.log("New currentWordIndex:", currentWordIndex);
  console.log("Current word:", words[currentWordIndex]);

  generatePoints(words[currentWordIndex]); // Update text points based on the new word
}

// Generate points for the specified word
function generatePoints(word) {
  console.log("Generating points for:", word);
  textPoints = []; // Clear the array of points

  let points = font.textToPoints(word, tposX, tposY, tSize, {
    sampleFactor: pointCount,
  });

  for (let i = 0; i < points.length; i++) {
    let pt = points[i];
    let textPoint = new Interact(
      pt.x,
      pt.y,
      speed,
      dia,
      randomPos,
      comebackSpeed,
      pointsDirection,
      interactionDirection
    );
    textPoints.push(textPoint);
  }
 
  soundEffect.play () 
}

function Interact(x, y, m, d, t, s, di, p) {
  this.home = t ? createVector(random(width), random(height)) : createVector(x, y);
  this.pos = this.home.copy();
  this.target = createVector(x, y);

  if (di === "general") {
    this.vel = createVector();
  } else if (di === "up") {
    this.vel = createVector(0, -y);
  } else if (di === "down") {
    this.vel = createVector(0, y);
  } else if (di === "left") {
    this.vel = createVector(-x, 0);
  } else if (di === "right") {
    this.vel = createVector(x, 0);
  }

  this.acc = createVector();
  this.r = 8;
  this.maxSpeed = m;
  this.maxforce = 1;
  this.dia = d;
  this.come = s;
  this.dir = p;
}

Interact.prototype.behaviors = function () {
  let arrive = this.arrive(this.target);
  let mouse = createVector(mouseX, mouseY);
  let flee = this.flee(mouse);

  this.applyForce(arrive);
  this.applyForce(flee);
};

Interact.prototype.applyForce = function (f) {
  this.acc.add(f);
};

Interact.prototype.arrive = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();
  let speed = this.maxSpeed;
  if (d < this.come) {
    speed = map(d, 0, this.come, 0, this.maxSpeed);
  }
  desired.setMag(speed);
  let steer = p5.Vector.sub(desired, this.vel);
  return steer;
};

Interact.prototype.flee = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();

  if (d < this.dia) {
    desired.setMag(this.maxSpeed);
    desired.mult(this.dir);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  } else {
    return createVector(0, 0);
  }
};

Interact.prototype.update = function () {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
};

Interact.prototype.show = function () {
  stroke(202, 227, 252);
  strokeWeight(4);
  point(this.pos.x, this.pos.y);
};

function windowResized(){
  resizeCanvas (windowWidth, windowHeight);
}

function mousePressed() {
  // Check if the current word is "glitter"
  if (words[currentWordIndex] === "of glitter") {
    // Calculate the bounding box for the current word
    let bounds = font.textBounds(words[currentWordIndex], tposX, tposY, tSize);

    // Check if the mouse is within the bounds of the text
    if  (mouseX>width/2-tSize && mouseX<width/2+tSize
    && mouseY> height/2 -tSize && mouseY<height/2+tSize){
      // Open the link in a new tab
      window.open("https://thisissand.com/", "_blank");
    }
  }
}

