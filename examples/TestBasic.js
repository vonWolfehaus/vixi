
define(function (require) {

// imports
var RAF = require('../lib/RequestAnimationFrame');
// var Container = require('Container');
var Bitmap = require('Bitmap');

var TestBasic = function(canvas) {
	console.log('[TestBasic] Initializing');
	this.stageWidth = canvas.width = window.innerWidth;
	this.stageHeight = canvas.height = window.innerHeight;
	
	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	
	this.sprites = [];
	this.numSprites = 20;
	
	// this.stage = new Container();
	// this.stage.addChild();
	
	var spacing = 70, offX = 50, offY = 50, 
		rowX = 0, rowY = 0, rowMax = Math.floor((this.stageWidth - offX) / spacing),
		img = document.getElementById('beetle'),
		i, o;
	
	var settings = {
		regX: 25,
		regY: 25
	};
	
	for (i = 0; i < this.numSprites; i++) {
		o = new Bitmap(img);
		o.position.reset((rowX * spacing) + offX, (rowY * spacing) + offY);
		
		this._merge(o, settings);
		this.sprites[i] = o;
		
		rowX++;
		if (rowX === rowMax) {
			rowX = 0;
			rowY++;
		}
	}
	
	this.raf = new RAF(this);
	this.raf.start();
	
	console.log('[TestBasic] Running');
};

TestBasic.prototype = {
	
	update: function () {
		var i, o;
		
		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
		
		// this.ctx.save();
		for (i = 0; i < this.numSprites; i++) {
			o = this.sprites[i];
			
			o.position.x += 1;
			o.angle += 0.01;
			
			this._checkBounds(o);
			
			this.ctx.save();
			o.draw(this.ctx);
			this.ctx.restore();
		}
		// this.ctx.restore();
	},
	
	_checkBounds: function(o) {
		if (o.position.x > this.stageWidth) {
			o.position.x = 0;
		}
	},
	
	_merge: function(host, augment) {
		for (var n in augment) {
			host[n] = augment[n];
		}
	}
};

return TestBasic;

});
