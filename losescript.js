/*jshint esversion: 6 */
$(document).ready(function() {
  var canvas = $("#lose")[0];
  var context = canvas.getContext("2d");
  var x = canvas.width/2;
  var y = canvas.height-30;
  var center= canvas.height/2;
  context.font = "90px Impact";
  context.fillStyle = "#d7c82b";
  context.textAlign ="center";
  context.fillText("YOU LOSE",x,center);
  context.font = "40px Impact";
  context.fillText("PRESS SPACEBAR TO RESTART A GAME",x,center +90);
  $("#losesound")[0].play();
  document.body.onkeyup = function(e){
      if(e.keyCode == 32){
        document.location= 'index.html';
      }
    };
});
