//Main JS file

var init = function () {
 window.requestAnimationFrame(draw);
}

function draw(){
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var time = new Date();
  ctx.save();
  ctx.strokeStyle = 'rgba(0,0,0,0.8)';
  ctx.clearRect(0,0,600,600);
 //  ctx.beginPath();
 //  ctx.moveTo(300,300);
 //  ctx.bezierCurveTo(
 //    10,
 //    10,
 //    -10,
 //    -10,
 //    0,
 //    1+(Math.sin(time.getSeconds())*3)
 //  );
 // ctx.stroke();
 ctx.restore();
 window.requestAnimationFrame(draw);
}
window.onload = init;
