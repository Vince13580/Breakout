document.addEventListener('DOMContentLoaded', function(){
var canvas = document.getElementById("myCanvas");
var contex = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 3.5;
var dy = -3.5;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 12;
var brickWidth = 65;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;


var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}


function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
          if(bricks[c][r].status == 1) {
            let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            contex.beginPath();
            contex.rect(brickX, brickY, brickWidth, brickHeight);
            contex.fillStyle = "#0095DD";
            contex.fill();
            contex.closePath();
          }
        }
    }
}

function drawball(){
  contex.beginPath();
  contex.arc(x, y, ballRadius, 0, Math.PI*2);
  contex.fillStyle = "#0095DD";
  contex.fill();
  contex.closePath();
}

function drawPaddle() {
    contex.beginPath();
    contex.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    contex.fillStyle = "#0095DD";
    contex.fill();
    contex.closePath();
}

function draw() {
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
  dx = 3.5;
  dy = -3.5;
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
    var relativeX = e.clientX - canvas.offsetLeft;
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
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("C'est gagné, Bravo!");
                        document.location.reload();
                    }

                }
            }
        }
    }
}
function drawScore() {
    contex.font = "16px Arial";
    contex.fillStyle = "#0095DD";
    contex.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    contex.font = "16px Arial";
    contex.fillStyle = "#0095DD";
    contex.fillText("Lives: "+lives, canvas.width-65, 20);
}

draw();



/*contex.beginPath();
contex.rect(20, 40, 50, 50);
contex.fillStyle = "#FF0000";
contex.fill();
contex.closePath();

contex.beginPath();
contex.arc(240, 160, 20, 0, Math.PI*2, false);
contex.fillStyle = "green";
contex.fill();
contex.closePath();

contex.beginPath();
contex.rect(160, 10, 100, 40);
contex.strokeStyle = "rgba(0, 0, 255, 0.5)";
contex.stroke();
contex.closePath();*/


});
