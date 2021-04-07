/*jshint esversion: 6 */
$(document).ready(function() {

  //game parameters settings

  var canvas = $("#myCanvas")[0];
  var context = canvas.getContext("2d");
  var x = canvas.width/2;
  var y = canvas.height-30;
  var center= canvas.height/2;
  var fx = 3;
  var fy = 3;
  var dx = fx;
  var dy = fy;
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

//speed settings
  const btn = document.querySelector('#select');
  // handle click button
  btn.onclick = function () {
    const rbs = document.querySelectorAll('input[name="difficulty"]');
    let selectedValue;
    for (const rb of rbs) {
      if (rb.checked) {
        selectedValue = rb.value;
        break;
      }
    }
    if(selectedValue == 'easy'){
      if (dx >=1){
        dx = 3;
      }else {
        dx = -3;
      }
      if (dy >=1){
        dy = 3;
      }else {
        dy = -3;
      }
    }else if (selectedValue == 'medium') {
      if (dx >=1){
        dx = 4.5;
      }else {
        dx = -4.5;
      }
      if (dy >=1){
        dy = 4.5;
      }else {
        dy = -4.5;
      }

    }else if (selectedValue == 'hard') {
      if (dx >=1){
        dx = 6;
      }else {
        dx = -6;
      }
      if (dy >=1){
        dy = 6;
      }else {
        dy = -6;
      }
    }
  };

  // bricks grid generation
  var bricks = [];
  for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  //Bricks generation
  function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
      for(let r=0; r<brickRowCount; r++) {
        if(bricks[c][r].status == 1) {
          let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
          let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          context.beginPath();
          context.rect(brickX, brickY, brickWidth, brickHeight);
          context.fillStyle = "#eb6782";
          context.fill();
          context.closePath();
        }
      }
    }
  }

  //ball generation
  function drawball(){
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI*2);
    context.fillStyle = "#295ba7";
    context.fill();
    context.closePath();
  }

  //Paddle generation
  function drawPaddle() {
    context.beginPath();
    context.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    context.fillStyle = "#295ba7";
    context.fill();
    context.closePath();
  }

  //Main game function, call all the other necessary options to run the game
  function draw() {
    document.removeEventListener("click", draw, false);
    context.clearRect(0, 0, canvas.width, canvas.height);
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
        $("#boing")[0].play();
      }
      else {
        lives--;
        if(!lives) {
          document.location='lose.html';
        }
        else {
          $('#easy').prop("checked", true).trigger("click");
          x = canvas.width/2;
          y = canvas.height-30;
          dx = fx;
          dy = fy;
          paddleX = (canvas.width-paddleWidth)/2;
        }
      }
    }
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius){
      dx = -dx;
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


  //Mouse paddle control
  function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth/2;
    }
  }

  //Arrow key paddle control
  function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = false;
    }

  }
  //Collision detection, handle score and wins
  function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
      for(let r=0; r<brickRowCount; r++) {
        let b = bricks[c][r];
        if(b.status == 1) {
          if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
            dy = -dy;
            b.status = 0;
            $("#hit")[0].play();
            score++;
            if(score % 2 ==0){speedadjust();}
            if(score == brickRowCount*brickColumnCount) {
              //winmenu();
              //alert("C'est gagné, Bravo!");
              lives =3;
              document.location='victory.html';
            }

          }
        }
      }
    }
  }


  //Show score
  function drawScore() {
    context.font = "16px Impact";
    context.fillStyle = "#295ba7";
    context.fillText("Score: "+score, 20,20);
  }
  //Show how many lives the player have
  function drawLives() {
    context.font = "16px Impact";
    context.fillStyle = "#295ba7";
    context.fillText("Lives: "+lives, canvas.width-60, 20);
  }

  //Show the start menu, call draw() function to start the game, user interaction by the click allow the game to play sound
  function startmenu() {
    context.font = "90px Impact";
    context.fillStyle = "#d7c82b";
    context.textAlign ="center";
    context.fillText("BREAKOUT",x,center);
    context.font = "40px Impact";
    context.fillText("CLICK TO START A GAME",x,center +90);
    document.addEventListener("click", draw, false);
  }

  //Adjust ball speed, make it increase during a game
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

//start game when spacebar is pressed
var executed = false;
  document.body.onkeyup = function(e){
      if(e.keyCode == 32){
        if (executed == false){
        executed = true;
        $('#form').fadeOut();
        $('#instructions').fadeOut();

            draw();
      }
      }
  };

});
