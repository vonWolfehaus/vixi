/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */
define(function (require) {

	// imports
	var GS = require('GS');
	var Point = require('Point');
	var Rectangle = require('Rectangle');
	var Matrix = require('Matrix2');

	/**
	 * The base class for all objects that are rendered on the screen.
	 *
	 * @class DisplayObject
	 * @constructor
	 */
	var DisplayObject = function() {
		this.uniqueId = Math.random().toString(36).slice(2) + Date.now();
		
		/**
		 * The coordinate of the object relative to the local coordinates of the parent.
		 *
		 * @property position
		 * @type Point
		 */
		this.position = new Point();

		/**
		 * The scale factor of the object.
		 *
		 * @property scale
		 * @type Point
		 */
		this.scale = new Point(1, 1);//{x:1, y:1};

		/**
		 * The pivot point of the displayObject that it rotates around
		 *
		 * @property pivot
		 * @type Point
		 */
		this.pivot = new Point();

		/**
		 * The rotation of the object in radians.
		 *
		 * @property rotation
		 * @type Number
		 */
		this.rotation = 0;

		/**
		 * The opacity of the object.
		 *
		 * @property alpha
		 * @type Number
		 */
		this.alpha = 1;

		/**
		 * The visibility of the object.
		 *
		 * @property visible
		 * @type Boolean
		 */
		this.visible = true;

		

		/**
		 * Can this object be rendered
		 *
		 * @property renderable
		 * @type Boolean
		 */
		this.renderable = false;

		/**
		 * [read-only] The display object container that contains this display object.
		 *
		 * @property parent
		 * @type DisplayObjectContainer
		 * @readOnly
		 */
		this.parent = null;

		/**
		 * [read-only] The stage the display object is connected to, or undefined if it is not connected to the stage.
		 *
		 * @property stage
		 * @type Stage
		 * @readOnly
		 */
		this.stage = null;

		/**
		 * [read-only] The multiplied alpha of the displayObject
		 *
		 * @property worldAlpha
		 * @type Number
		 * @readOnly
		 */
		this.worldAlpha = 1;
		
		/**
		 * [read-only] Current transform of the object based on world (parent) factors
		 *
		 * @property worldTransform
		 * @type Mat2
		 * @readOnly
		 * @private
		 */
		this.worldTransform = new Matrix();
		
		// @private
		
		// cached sin rotation and cos rotation
		this._sr = 0;
		this._cr = 1;
		
		/**
		 * The original, cached bounds of the object
		 *
		 * @property _bounds
		 * @type Rectangle
		 * @private
		 */
		this._bounds = new Rectangle(0, 0, 1, 1);
		/**
		 * The most up-to-date bounds of the object
		 *
		 * @property _currentBounds
		 * @type Rectangle
		 * @private
		 */
		this._currentBounds = null;
		
		// caching variables to prevent garbage collector thrashing
		this._parentTransform = null;
		this._a00 = 0;
		this._a01 = 0;
		this._a10 = 0;
		this._a11 = 0;
		this._a02 = 0;
		this._a12 = 0;
		this._b00 = 0;
		this._b10 = 0;
	};

	/**
	 * [read-only] Indicates if the sprite is globaly visible.
	 *
	 * @property worldVisible
	 * @type Boolean
	 */
	Object.defineProperty(DisplayObject.prototype, 'worldVisible', {
		get: function() {
			var item = this;

			while (item) {
				if (!item.visible) {
					return false;
				}
				item = item.parent;
			} 

			return true;
		}
	});


	/*
	 * Updates the object transform for rendering
	 *
	 * @method updateTransform
	 * @private
	 */
	DisplayObject.prototype.updateTransform = function() {
		if (this.rotation !== this.rotationCache) {
			this.rotationCache = this.rotation;
			this._sr = Math.sin(this.rotation);
			this._cr = Math.cos(this.rotation);
		}

		this._parentTransform = this.parent.worldTransform;
		
		this._a00 = this._cr * this.scale.x;
		this._a01 = -this._sr * this.scale.y;
		this._a10 = this._sr * this.scale.x;
		this._a11 = this._cr * this.scale.y;
		this._a02 = this.position.x - this._a00 * this.pivot.x - this.pivot.y * this._a01;
		this._a12 = this.position.y - this._a11 * this.pivot.y - this.pivot.x * this._a10;
		this._b00 = this._parentTransform.a;
		this._b01 = this._parentTransform.b;
		this._b10 = this._parentTransform.c;
		this._b11 = this._parentTransform.d;

		this.worldTransform.a = this._b00 * this._a00 + this._b01 * this._a10;
		this.worldTransform.b = this._b00 * this._a01 + this._b01 * this._a11;
		this.worldTransform.tx = this._b00 * this._a02 + this._b01 * this._a12 + this._parentTransform.tx;

		this.worldTransform.c = this._b10 * this._a00 + this._b11 * this._a10;
		this.worldTransform.d = this._b10 * this._a01 + this._b11 * this._a11;
		this.worldTransform.ty = this._b10 * this._a02 + this._b11 * this._a12 + this._parentTransform.ty;

		this.worldAlpha = this.alpha * this.parent.worldAlpha;
	};

	/**
	 * Retrieves the bounds of the displayObject as a rectangle object
	 *
	 * @method getBounds
	 * @return {Rectangle} the rectangular bounding area
	 */
	DisplayObject.prototype.getBounds = function(matrix) {
		matrix = matrix;//just to get passed js hinting (and preserve inheritance)
		return GS.EmptyRectangle;
	};

	/**
	 * Retrieves the local bounds of the displayObject as a rectangle object
	 *
	 * @method getLocalBounds
	 * @return {Rectangle} the rectangular bounding area
	 */
	/*DisplayObject.prototype.getLocalBounds = function() {
		//var matrixCache = this.worldTransform;

		return this.getBounds(identityMatrix);///EmptyRectangle();
	};*/
	
	DisplayObject.prototype.setStageReference = function(stage) {
		this.stage = stage;
	};
	
	/**
	* Renders the object using the Canvas renderer
	*
	* @param renderSession {RenderSession} 
	* @private
	*/
	DisplayObject.prototype.draw = function(ctx) {
		// OVERWRITE;
		// this line is just here to pass jshinting :)
		ctx = ctx;
	};

	/**
	 * The position of the displayObject on the x axis relative to the local coordinates of the parent.
	 *
	 * @property x
	 * @type Number
	 */
	Object.defineProperty(DisplayObject.prototype, 'x', {
		get: function() {
			return  this.position.x;
		},
		set: function(value) {
			this.position.x = value;
		}
	});

	/**
	 * The position of the displayObject on the y axis relative to the local coordinates of the parent.
	 *
	 * @property y
	 * @type Number
	 */
	Object.defineProperty(DisplayObject.prototype, 'y', {
		get: function() {
			return  this.position.y;
		},
		set: function(value) {
			this.position.y = value;
		}
	});
	
	return DisplayObject;

});
