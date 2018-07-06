var canvas;
var ctx;
var log;

var drawing = false;
var geoTemp;
var snapshot;
var geometry = new Array();

function init() {
    log = document.getElementById("notes");

    canvas = document.getElementById("sketch-canvas");
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    canvas.addEventListener('click', geoStartStop, false);
    canvas.addEventListener('mousemove', drag, false);
    takeSnapshot();
}

function getCoord(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left;
    var y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

function takeSnapshot() {
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapshot() {
    ctx.putImageData(snapshot, 0, 0);
}

function drawLine(position) {
    ctx.beginPath();
    ctx.moveTo(geoStartLoc.x, geoStartLoc.y);
    ctx.lineTo(position.x, position.y);
    ctx.stroke();
}

function geoStartStop(event) {
    if (drawing === true) {
      // dragging = false;
      restoreSnapshot();
      endCoord = getCoord(event);
      drawLine(endCoord);
      takeSnapshot();
      geometry.push({type: 'line', start: geoStartLoc, stop: endCoord});
      console.log(geometry);
    } else {
      drawing = true;
      geoTemp = {type: 'line', start: getCoord(event), endPoints: []}
      takeSnapshot();
    }

    geoStartLoc = getCoord(event);
}

function drag(event) {
    if (drawing === true) {
        restoreSnapshot();
        drawLine(getCoord(event));
    }
}

function escapeHandler(event) {
    drawing = false;
    restoreSnapshot();
}

window.addEventListener('load', init, false);
document.addEventListener('keyup', event => {
  if (event.keyCode == 27) {
    escapeHandler(event);
  }
});
