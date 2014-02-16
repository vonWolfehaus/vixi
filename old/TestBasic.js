
define(function (require) {

	// imports
	var RAF = require('../lib/RequestAnimationFrame');
	var Container = require('Container');
	var Sprite = require('Sprite');

	var TestBasic = function(canvas) {
		console.log('[TestBasic] Initializing');
		this.stageWidth = canvas.width = window.innerWidth;
		this.stageHeight = canvas.height = window.innerHeight;
		
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		
		this.sprites = [];
		this.numSprites = 20;
		
		this.stage = new Container();
		
		var spacing = 70, offX = 50, offY = 80, 
			rowX = 0, rowY = 0, rowMax = Math.floor((this.stageWidth - offX) / spacing),
			img = document.getElementById('beetle'),
			i, o;
		
		var settings = {
			regX: 25,
			regY: 25
		};
		
		/*this._merge(this.stage, {
			regX: window.innerWidth / 2,
			regY: window.innerHeight / 2
		});*/
		
		for (i = 0; i < this.numSprites; i++) {
			o = new Sprite(img);
			o.position.reset((rowX * spacing) + offX, (rowY * spacing) + offY);
			
			this._merge(o, settings);
			this.sprites[i] = o;
			this.stage.addChild(o);
			
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
			
			// this.ctx.setTransform(1, 0, 0, 1, 0, 0);
			this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
			
			// update
			for (i = 0; i < this.numSprites; i++) {
				o = this.sprites[i];
				
				o.position.x += 1;
				o.angle += 0.01;
				/*o.skewX += 0.01;
				o.skewY -= 0.01;
				o.scaleX += 0.01;
				if (o.scaleX > 2) o.scaleX = 0.5;
				o.scaleY += 0.01;
				if (o.scaleY > 2) o.scaleY = 0.5;*/
				
				if (o.position.x > this.stageWidth) {
					o.position.x = 0;
				}
			}
			
			// this.stage.scaleX += 0.01;
			// this.stage.scaleY += 0.01;
			
			this.stage.draw(this.ctx);
		},
		
		_merge: function(host, augment) {
			for (var n in augment) {
				host[n] = augment[n];
			}
		}
	};

	return TestBasic;

});
