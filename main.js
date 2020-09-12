// define variable for ball count paragraph
var para = document.getElementById("p1");
var msg = document.getElementById("p2");
var count = 0;

// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}
// define shape constructor
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
 this.exists = exists;
}
//define Ball constructor, inheriting from Shape
function Ball(x, y, velX, velY,exists, color, size){
  Shape.call(this, x, y, velX, velY, exists);

  this.color = color;
  this.size =size; 
}
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;


//draw balls on canvas
Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
  ctx.fill();
};

//updates states of ball and bouncing of the walls
Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  };

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }
  
  this.x += this.velX;
  this.y += this.velY;
};

//Add collision detection
Ball.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size &&  balls[j].exists) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
};



function EvilCircle(x, y, exists){
  Shape.call(this, x, y, 20, 20, exists);
  this.color = 'white';
  this.size = 10;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;


EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

// define EvilCircle checkBounds method

EvilCircle.prototype.checkBounds = function() {
  if((this.x + this.size) >= width) {
    this.x -= this.size;
  }

  if((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if((this.y - this.size) <= 0) {
    this.y += this.size;
  }
};

// define EvilCircle setControls method

EvilCircle.prototype.setControls = function() {
  var _this = this;
  window.onkeydown = function(e) {
    if(e.keyCode === 37) { // left
      _this.x -= _this.velX;
    } else if(e.keyCode === 39) { // right
      _this.x += _this.velX;
    } else if(e.keyCode === 38) { // up
      _this.y -= _this.velY;
    } else if(e.keyCode === 40) { // down
      _this.y += _this.velY;
    }
  };
};

// define EvilCircle collision detection

EvilCircle.prototype.collisionDetect = function() {
  for(var j = 0; j < balls.length; j++) {
    if( balls[j].exists ) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        count--;
        this.size += 1; 
        para.textContent = 'Ball count: ' + count;
      }
    }
  }
};





// define array to store balls
var balls = [];
// define loop that keeps drawing the scene constantly

var evil = new EvilCircle(random(0,width), random(0,height), true);
evil.setControls();

function loop(){
  ctx.fillStyle = 'rgb(0,0,0, 0.25)';
  ctx.fillRect(0, 0, width , height);

  while(balls.length < 25) {
    var size = random(10 , 20);
    var ball = new Ball(
      random(0+size , width - size),
      random(0+size , height-size),
      random(-7, 7),
      random(-7 , 7),
      true,
      'rgb(' + random(0, 255) + ','+ random(0, 255) + ',' + random(0, 255) +')',
      size
    );

    balls.push(ball);
    count++;
    para.textContent = 'Ball count: ' + count;
  
    }

    for(var i =0 ; i<balls.length; i++) {
      if(balls[i].exists){
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
      }
    }
    evil.draw();
    evil.checkBounds();
    evil.collisionDetect();
    
    if(count===0){
      para.textContent = "";
     msg.textContent= "You should not have eaten them all, you hungry potato. Now see ,You are so lonely";
     alert("So that ends it! I think You refresh the page.");
     return;
    }
    requestAnimationFrame(loop);
}

loop();