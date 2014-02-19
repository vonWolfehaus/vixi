/*
	Mat made a fine Sprite... except for all the local variable created in functions, that shit will thrash the garbage reeaaaally hard. Anyway, I stripped out masking, filters, and other things to make it lighter and faster. I recommend just going with the PIXI rendering engine and not this version unless you have your own loader and compatibility isn't an issue. Also removed WebGL support, because it doesn't exist where I go.
	
	@author Mat Groves http://matgroves.com/ @Doormat23
*/
define(function(require) {

	// imports
	var GS = require('GS');
	var DisplayObject = require('DisplayObject');
	var Point = require('Point');
	var Rectangle = require('Rectangle');
	
	/**
	 * The Sprite object is the base for all textured objects that are rendered to the screen
	 *
	 * @class Sprite
	 * @extends DisplayObject
	 * @constructor
	 * @param texture {Image} The image or canvas for this sprite
	 * @param frame {Rectangle} A rectangle defining the portion of the sprite to be drawn on screen
	 */
	var Sprite = function(image, frame) {
		// copy over the properties from DisplayObject
		DisplayObject.call(this);

		/**
		 * The anchor sets the origin point of the texture.
		 * 0,0 means the texture's origin is the top left
		 * Setting than anchor to 0.5,0.5 means the textures origin is centered
		 * Setting the anchor to 1,1 would mean the textures origin points will be the bottom right corner
		 *
		 * @property anchor
		 * @type Point
		 */
		this.anchor = new Point(0.5, 0.5);

		/**
		 * The texture that the sprite is using
		 *
		 * @property texture
		 * @type Texture
		 */
		this.texture = image;
		
		/**
		 * The width of the sprite
		 *
		 * @property _width
		 * @type Number
		 * @private
		 */
		this._width = frame ? frame.width : image.width;

		/**
		 * The height of the sprite
		 *
		 * @property _height
		 * @type Number
		 * @private
		 */
		this._height = frame ? frame.height : image.height;
		
		this.frame = frame || new Rectangle(0, 0, image.width, image.height);
		
		this.scale.x = this._width / this.frame.width;
		this.scale.y = this._height / this.frame.height;

		/**
		 * The blend mode to be applied to the sprite
		 *
		 * @property blendMode
		 * @type Number
		 * @default blendModes.NORMAL;
		 */
		this.blendMode = GS.blendModes.NORMAL;
		
		this.renderable = true;
	};

	// inherit from DisplayObject, but overwrite the constructor with ours
	Sprite.prototype = Object.create(DisplayObject.prototype);
	Sprite.prototype.constructor = Sprite;

	/**
	 * The width of the sprite, setting this will actually modify the scale to achieve the value set
	 *
	 * @property width
	 * @type Number
	 */
	Object.defineProperty(Sprite.prototype, 'width', {
		get: function() {
			return this.scale.x * this.frame.width;
		},
		set: function(value) {
			this.scale.x = value / this.frame.width;
			this._width = value;
		}
	});

	/**
	 * The height of the sprite, setting this will actually modify the scale to achieve the value set
	 *
	 * @property height
	 * @type Number
	 */
	Object.defineProperty(Sprite.prototype, 'height', {
		get: function() {
			return  this.scale.y * this.frame.height;
		},
		set: function(value) {
			this.scale.y = value / this.frame.height;
			this._height = value;
		}
	});

	/**
	* Returns the framing rectangle of the sprite as a Rectangle object
	*
	* @method getBounds
	* @param matrix {Matrix} the transformation matrix of the sprite
	* @return {Rectangle} the framing rectangle
	*/
	Sprite.prototype.getBounds = function(matrix) {
		// TODO: don't create so many fucking variables (unless you love frame hitching)
		var width = this.frame.width;
		var height = this.frame.height;

		var w0 = width * (1-this.anchor.x);
		var w1 = width * -this.anchor.x;

		var h0 = height * (1-this.anchor.y);
		var h1 = height * -this.anchor.y;

		var worldTransform = matrix || this.worldTransform ;

		var a = worldTransform.a;
		var b = worldTransform.c;
		var c = worldTransform.b;
		var d = worldTransform.d;
		var tx = worldTransform.tx;
		var ty = worldTransform.ty;

		var x1 = a * w1 + c * h1 + tx;
		var y1 = d * h1 + b * w1 + ty;

		var x2 = a * w0 + c * h1 + tx;
		var y2 = d * h1 + b * w0 + ty;

		var x3 = a * w0 + c * h0 + tx;
		var y3 = d * h0 + b * w0 + ty;

		var x4 =  a * w1 + c * h0 + tx;
		var y4 =  d * h0 + b * w1 + ty;

		var maxX = -Infinity;
		var maxY = -Infinity;

		var minX = Infinity;
		var minY = Infinity;

		minX = x1 < minX ? x1 : minX;
		minX = x2 < minX ? x2 : minX;
		minX = x3 < minX ? x3 : minX;
		minX = x4 < minX ? x4 : minX;

		minY = y1 < minY ? y1 : minY;
		minY = y2 < minY ? y2 : minY;
		minY = y3 < minY ? y3 : minY;
		minY = y4 < minY ? y4 : minY;

		maxX = x1 > maxX ? x1 : maxX;
		maxX = x2 > maxX ? x2 : maxX;
		maxX = x3 > maxX ? x3 : maxX;
		maxX = x4 > maxX ? x4 : maxX;

		maxY = y1 > maxY ? y1 : maxY;
		maxY = y2 > maxY ? y2 : maxY;
		maxY = y3 > maxY ? y3 : maxY;
		maxY = y4 > maxY ? y4 : maxY;

		var bounds = this._bounds;

		bounds.x = minX;
		bounds.width = maxX - minX;

		bounds.y = minY;
		bounds.height = maxY - minY;

		// store a reference so that if this function gets called again in the render cycle we do not have to recalculate
		this._currentBounds = bounds;

		return bounds;
	};

	/**
	* Renders the object using the Canvas renderer
	*
	* @method _renderCanvas
	* @param renderSession {RenderSession}
	* @private
	*/
	Sprite.prototype.draw = function(ctx) {
		/*if (this.blendMode !== renderSession.currentBlendMode) {
			renderSession.currentBlendMode = this.blendMode;
			ctx.globalCompositeOperation = GS.blendModes[renderSession.currentBlendMode];
		}*/
	
		ctx.globalAlpha = this.worldAlpha;

		ctx.setTransform(this.worldTransform.a, this.worldTransform.c, this.worldTransform.b, this.worldTransform.d, this.worldTransform.tx, this.worldTransform.ty);
		
		ctx.drawImage(this.texture,
				this.frame.x,
				this.frame.y,
				this.frame.width,
				this.frame.height,
				this.anchor.x * -this.frame.width,
				this.anchor.y * -this.frame.height,
				this.frame.width,
				this.frame.height
			);
	};
	
	return Sprite;

});
