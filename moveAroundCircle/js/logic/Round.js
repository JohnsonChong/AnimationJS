'use strict'

class Stage {
	constructor(_width, _height, _stro_w) {
		this.width = _width;
		this.height = _height;
		this.centerX = this.width / 2;
		this.centerY = this.height / 2;
		this.strokeWidth = _stro_w;
	}

}
class BgRect extends Stage {
	constructor(_w, _h, _sw, _x, _y, _clr) {
		super(_w, _h, _sw)
		this.x = _x;
		this.y = _y;
		this.color = _clr;
		
	}
}
class Circle extends Stage {
	constructor(_w, _h, _sw, _radius, _slop, _clr) {
		super(_w, _h, _sw);
		this.r = _radius;
		this.slop = _slop;
		this.color = _clr;
		this.theta = 0;
	}
	setNewPosition(_angle) {
		this.x =  this.centerX + this.slop * Math.cos(_angle);
		this.y =  this.centerY + this.slop * Math.sin(_angle);
	}
}

class Line {
	constructor(_lw, _clr) {
		this.lineWidth = _lw;
		this.color = _clr;
	}
	toCmd(_moveTx, _moveTy, _lineTx, _lineTy) {
		return 	`M${_moveTx} ${_moveTy}L${_lineTx} ${_lineTy}`;
	}
}
window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webKitRequestAnimationFrame ||
	window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame || function(callback) {
		window.setTimeout(callback, 1000/60);
	};
})();

let stage = new Stage(400, 400, 0);
let bgRect = new BgRect(stage.width, stage.height, 0, 0, 0, "rgba(0,0,0,.6)");
let c = new Circle(stage.width, stage.height, 0, 10, 80, "rgba(186, 249, 105, 1)");
let lines = new Line(0, "rgba(186, 249, 105, 1)");

let paper = Raphael(document.getElementById("canvas_container"), 
	stage.width, stage.height);

var bgRectangle = paper.rect(bgRect.x, bgRect.y, bgRect.width, bgRect.height);
bgRectangle.attr({
	"fill": bgRect.color,
	"stroke-width": bgRect.strokeWidth
});
drawBtn();
function drawCircle() {
	var circle = paper.circle(c.x, c.y, c.r);
	circle.attr({
		"fill": c.color,
		"stroke-width": c.strokeWidth
	});
}
function drawLine(_moveTx, _moveTy, _lineTx, _lineTy) {
	var line =  paper.path(lines.toCmd(_moveTx, _moveTy, _lineTx, _lineTy));
	line.attr({
		stroke: lines.color
	});
}
function spinning() {
	paper.clear();
	var r = paper.rect(0, 0, stage.width, stage.height);
	r.attr({
		"fill": bgRect.color,
		"stroke-width": bgRect.strokeWidth
	});
	drawBtn();
	if (c.theta < (2*Math.PI)) {
		c.setNewPosition(c.theta);
		drawCircle();
		drawLine(stage.centerX, stage.centerY, c.x, c.y);
		c.theta += .1;
		requestAnimFrame(function(){spinning();});
	}
	else {
		//circle.remove()
		c.theta = 0;
		//if (c.theta >= 0) c.theta -= 1;
		requestAnimFrame(function(){spinning();});
	}
}

function drawBtn() {
	var rect = paper.rect(10, 10, 40, 20);
	rect.attr({
		"fill": c.color,
		"cursor": "pointer"
	});
	var txt = "Run";
	var text = paper.text(30, 20, txt);
	text.attr({
		"fill": "white",
		"font-size": 14,
		"cursor": "pointer"
	}).click(function() {
		this.attr({
			"text": "Stop"
		});
		spinning();
	});
}