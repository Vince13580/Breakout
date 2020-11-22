document.addEventListener('DOMContentLoaded', function(){
var canvas = document.getElementById("myCanvas");
var contex = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var center= canvas.height/2;
var dx = 4;
var dy = -4;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = canvas.width/12.8;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 12;
var brickWidth = (canvas.width/brickColumnCount) - 14;
var brickHeight = (canvas.height/brickColumnCount) - 15;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;


var bricks = [];
for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}


function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
          if(bricks[c][r].status == 1) {
            let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            contex.beginPath();
            contex.rect(brickX, brickY, brickWidth, brickHeight);
            contex.fillStyle = "#eb6782";
            contex.fill();
            contex.closePath();
          }
        }
    }
}

function drawball(){
  contex.beginPath();
  contex.arc(x, y, ballRadius, 0, Math.PI*2);
  contex.fillStyle = "#295ba7";
  contex.fill();
  contex.closePath();
}

function drawPaddle() {
    contex.beginPath();
    contex.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    contex.fillStyle = "#295ba7";
    contex.fill();
    contex.closePath();
}

function draw() {
  document.removeEventListener("click", draw, false);
  contex.clearRect(0, 0, canvas.width, canvas.height);
  drawball();
  drawPaddle();
  drawScore();
  drawLives();
  drawBricks();
  collisionDetection();

  x += dx;
  y += dy;
  if(y + dy < ballRadius) {
    dy = -dy;
} else if(y + dy > canvas.height-ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
        document.getElementById("boing").play();
    }
    else {
      lives--;
if(!lives) {
  alert("GAME OVER");
  document.location.reload();
}
else {
  x = canvas.width/2;
  y = canvas.height-30;
  dx = 4;
  dy = -4;
  paddleX = (canvas.width-paddleWidth)/2;
}
    }
}
if(x + dx > canvas.width-ballRadius || x + dx < ballRadius){
  dx = -dx
}
if(rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width){
        paddleX = canvas.width - paddleWidth;
    }
}
else if(leftPressed) {
    paddleX -= 7;
    if (paddleX < 0){
        paddleX = 0;
    }
}
requestAnimationFrame(draw);
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }

}
function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    document.getElementById("hit").play();
                    score++;
                    if(score % 2 ==0){speedadjust();}
                    if(score == brickRowCount*brickColumnCount) {
                      document.getElementById("win").play();
                        alert("C'est gagné, Bravo!");
                        document.location.reload();
                    }

                }
            }
        }
    }
}



function drawScore() {
    contex.font = "16px Impact";
    contex.fillStyle = "#295ba7";
    contex.fillText("Score: "+score, 35, 20);
}

function drawLives() {
    contex.font = "16px Impact";
    contex.fillStyle = "#295ba7";
    contex.fillText("Lives: "+lives, canvas.width-40, 20);
}

function startmenu() {
  contex.font = "90px Impact";
  contex.fillStyle = "#d7c82b";
  contex.textAlign ="center"
  contex.fillText("BREAKOUT",x,center);
  contex.font = "40px Impact";
  contex.fillText("CLICK TO START A GAME",x,center +90);
  document.addEventListener("click", draw, false);


}
function speedadjust() {
    if (dx >=1){
      dx += 0.1;
    }else {
      dx -= 0.1;
    }

    if (dy >=1){
      dy += 0.1;
    }else {
    dy -= 0.1;
    }
}
startmenu();


});
