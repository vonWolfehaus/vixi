define(function (require) {

// ripped from easeljs
var Sprite = function(imageObj) {
	this.uniqueId = Math.random().toString(36).slice(2) + Date.now();
	this.image = imageObj;
	this.visible = true;
	this.position = new Vec2();
	this.angle = 0; // radians
	this.alpha = 1;
	this.parent = null;
	
	// these are matrix transform attributes, so they should be simple values, not entire Vectors
	this.scaleX = 1;
	this.scaleY = 1;
	this.skewX = 0;
	this.skewY = 0;
	this.regX = 0;
	this.regY = 0;
	
	// https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/Compositing/Compositing.html
	this.compositeOperation = null;
	this.sourceRect = null;
	
	// private
	this._matrix = new Matrix2();
	this._scratchPoint = new Point();
};

Sprite.prototype = {

	// this isn't used internally, but probably should be?
	isVisible: function() {
		return this.visible && this.alpha > 0 && this.scaleX && this.scaleY;
	},

	draw: function(ctx, camOffsetX, camOffsetY) {
		var mtx, rect = this.sourceRect, o = this;
		
		mtx = o._matrix.identity();
		mtx.appendTransform(o.position.x, o.position.y, o.scaleX, o.scaleY, o.angle, o.skewX, o.skewY, o.regX, o.regY);
		
		// ctx.setTransform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		
		ctx.globalAlpha *= o.alpha;
		if (o.compositeOperation) {
			ctx.globalCompositeOperation = o.compositeOperation;
		}
		
		if (rect) {
			ctx.drawImage(this.image, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
		} else {
			ctx.drawImage(this.image, 0, 0);
		}
	},

	getStage: function() {
		var o = this;
		while (o.parent) {
			o = o.parent;
		}
		return o;
	},

	/**
	 * Transforms the specified x and y position from the coordinate space of the display object
	 * to the global (stage) coordinate space. For example, this could be used to position an HTML label
	 * over a specific point on a nested display object. Returns a Point instance with x and y properties
	 * correlating to the transformed coordinates on the stage.
	 *
	 * <h4>Example</h4>
	 *
	 *      displayObject.x = 300;
	 *      displayObject.y = 200;
	 *      stage.addChild(displayObject);
	 *      var point = myDisplayObject.localToGlobal(100, 100);
	 *      // Results in x=400, y=300
	 *
	 * @method localToGlobal
	 * @param {Number} x The x position in the source display object to transform.
	 * @param {Number} y The y position in the source display object to transform.
	 * @return {Point} A Point instance with x and y properties correlating to the transformed coordinates
	 * on the stage.
	 **/
	localToGlobal: function(x, y) {
		var mtx = this.getConcatenatedMatrix(this._matrix);
		if (mtx == null) { return null; }
		mtx.append(1, 0, 0, 1, x, y);
		return this._scratchPoint.reset(mtx.tx, mtx.ty);
	},
	
	/**
	 * Transforms the specified x and y position from the global (stage) coordinate space to the
	 * coordinate space of the display object. For example, this could be used to determine
	 * the current mouse position within the display object. Returns a Point instance with x and y properties
	 * correlating to the transformed position in the display object's coordinate space.
	 *
	 * <h4>Example</h4>
	 *
	 *      displayObject.x = 300;
	 *      displayObject.y = 200;
	 *      stage.addChild(displayObject);
	 *      var point = myDisplayObject.globalToLocal(100, 100);
	 *      // Results in x=-200, y=-100
	 *
	 * @method globalToLocal
	 * @param {Number} x The x position on the stage to transform.
	 * @param {Number} y The y position on the stage to transform.
	 * @return {Point} A Point instance with x and y properties correlating to the transformed position in the
	 * display object's coordinate space.
	 **/
	globalToLocal: function(x, y) {
		var mtx = this.getConcatenatedMatrix(this._matrix);
		if (mtx == null) { return null; }
		mtx.invert();
		mtx.append(1, 0, 0, 1, x, y);
		return this._scratchPoint.reset(mtx.tx, mtx.ty);
	},

	/**
	 * Transforms the specified x and y position from the coordinate space of this display object to the coordinate
	 * space of the target display object. Returns a Point instance with x and y properties correlating to the
	 * transformed position in the target's coordinate space. Effectively the same as using the following code with
	 * {{#crossLink "DisplayObject/localToGlobal"}}{{/crossLink}} and {{#crossLink "DisplayObject/globalToLocal"}}{{/crossLink}}.
	 *
	 *      var pt = this.localToGlobal(x, y);
	 *      pt = target.globalToLocal(pt.x, pt.y);
	 *
	 * @method localToLocal
	 * @param {Number} x The x position in the source display object to transform.
	 * @param {Number} y The y position on the source display object to transform.
	 * @param {DisplayObject} target The target display object to which the coordinates will be transformed.
	 * @return {Point} Returns a Point instance with x and y properties correlating to the transformed position
	 * in the target's coordinate space.
	 **/
	localToLocal: function(x, y, target) {
		var pt = this.localToGlobal(x, y);
		return target.globalToLocal(pt.x, pt.y);
	},

	/**
	 * Shortcut method to quickly set the transform properties on the display object. All parameters are optional.
	 * Omitted parameters will have the default value set.
	 *
	 * <h4>Example</h4>
	 *
	 *      displayObject.setTransform(100, 100, 2, 2);
	 *
	 * @method setTransform
	 * @param {Number} [x=0] The horizontal translation (x position) in pixels
	 * @param {Number} [y=0] The vertical translation (y position) in pixels
	 * @param {Number} [scaleX=1] The horizontal scale, as a percentage of 1
	 * @param {Number} [scaleY=1] the vertical scale, as a percentage of 1
	 * @param {Number} [angle=0] The angle, in radians
	 * @param {Number} [skewX=0] The horizontal skew factor
	 * @param {Number} [skewY=0] The vertical skew factor
	 * @param {Number} [regX=0] The horizontal registration point in pixels
	 * @param {Number} [regY=0] The vertical registration point in pixels
	 * @return {DisplayObject} Returns this instance. Useful for chaining commands.
	*/
	setTransform: function(x, y, scaleX, scaleY, angle, skewX, skewY, regX, regY) {
		this.position.x = x || 0;
		this.position.y = y || 0;
		this.scaleX = scaleX == null ? 1 : scaleX;
		this.scaleY = scaleY == null ? 1 : scaleY;
		this.angle = angle || 0;
		this.skewX = skewX || 0;
		this.skewY = skewY || 0;
		this.regX = regX || 0;
		this.regY = regY || 0;
		return this;
	},

	/**
	 * Returns a matrix based on this object's transform.
	 * @method getMatrix
	 * @param {Matrix2} matrix Optional. A Matrix2 object to populate with the calculated values. If null, a new
	 * Matrix object is returned.
	 * @return {Matrix2} A matrix representing this display object's transform.
	 **/
	getMatrix: function(matrix) {
		var o = this;
		return (matrix ? matrix.identity() : new Matrix2()).appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.angle, o.skewX, o.skewY, o.regX, o.regY);
	},

	/**
	 * Generates a concatenated Matrix2 object representing the combined transform of the display object and all of its
	 * parent Containers up to the highest level ancestor (usually the {{#crossLink "Stage"}}{{/crossLink}}). This can
	 * be used to transform positions between coordinate spaces, such as with {{#crossLink "DisplayObject/localToGlobal"}}{{/crossLink}}
	 * and {{#crossLink "DisplayObject/globalToLocal"}}{{/crossLink}}.
	 * @method getConcatenatedMatrix
	 * @param {Matrix2} [mtx] A {{#crossLink "Matrix2"}}{{/crossLink}} object to populate with the calculated values.
	 * If null, a new Matrix2 object is returned.
	 * @return {Matrix2} a concatenated Matrix2 object representing the combined transform of the display object and
	 * all of its parent Containers up to the highest level ancestor (usually the {{#crossLink "Stage"}}{{/crossLink}}).
	 **/
	getConcatenatedMatrix: function(matrix) {
		if (matrix) { matrix.identity(); }
		else { matrix = new Matrix2(); }
		var o = this;
		while (o != null) {
			matrix.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.angle, o.skewX, o.skewY, o.regX, o.regY);
			o = o.parent;
		}
		return matrix;
	},

	toString: function() {
		return "[Sprite (name="+  this.name +")]";
	},
};
return Sprite;
});
