define(function (require) {

// ripped from easeljs
var Container = function() {
	this.uniqueId = Math.random().toString(36).slice(2) + Date.now();
	this.children = new LinkedList();
	
	// Sprite
	this.visible = true;
	this.position = new Vec2();
	this.angle = 0; // radians
	this.alpha = 1;
	this.parent = null;
	
	this.scaleX = 1;
	this.scaleY = 1;
	this.skewX = 0;
	this.skewY = 0;
	this.regX = 0;
	this.regY = 0;
	this.compositeOperation = null;
	this.sourceRect = null;
	
	// private
	this._matrix = new Matrix2();
	this._scratchPoint = new Point();
};

Container.prototype = {
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * 
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 **/
	draw: function(ctx) {
		var node, obj;
		var mtx, rect = this.sourceRect, o = this;
		
		mtx = o._matrix.identity();
		mtx.appendTransform(o.position.x, o.position.y, o.scaleX, o.scaleY, o.angle, o.skewX, o.skewY, o.regX, o.regY);
		
		ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		
		ctx.globalAlpha *= o.alpha;
		if (o.compositeOperation) {
			ctx.globalCompositeOperation = o.compositeOperation;
		}
		
		node = this.children.first;
		while (node) {
			obj = node.obj;
			if (obj.visible) {
				ctx.save();
				obj.draw(ctx);
				ctx.restore();
			}
			node = node.next;
		}
	},

	/**
	 * Adds a child to the top of the display list.
	 *
	 * <h4>Example</h4>
	 *      container.addChild(bitmapInstance);
	 *
	 *  You can also add multiple children at once:
	 *
	 *      container.addChild(bitmapInstance, shapeInstance, textInstance);
	 *
	 * @method addChild
	 * @param {DisplayObject} child The display object to add.
	 * @return {DisplayObject} The child that was added, or the last child if multiple children were added.
	 **/
	addChild: function(child) {
		var i, l = arguments.length;
		if (l > 1) {
			for (i = 0; i < l; i++) {
				this.addChild(arguments[i]);
			}
			return arguments[l-1];
		}
		if (child.parent) {
			child.parent.removeChild(child);
		}
		child.parent = this;
		this.children.add(child);
		return child;
	},

	/**
	 * Removes the specified child from the display list. Note that it is faster to use removeChildAt() if the index is
	 * already known.
	 *
	 * <h4>Example</h4>
	 *      container.removeChild(child);
	 *
	 * You can also remove multiple children:
	 *
	 *      removeChild(child1, child2, ...);
	 *
	 * Returns true if the child (or children) was removed, or false if it was not in the display list.
	 * @method removeChild
	 * @param {DisplayObject} child The child to remove.
	 * @return {Boolean} true if the child (or children) was removed, or false if it was not in the display list.
	 **/
	removeChild: function(child) {
		return this.children.remove(child);
	},
	
	/**
	 * Removes all children from the display list.
	 *
	 * <h4>Example</h4>
	 *      container.removeAlLChildren();
	 *
	 * @method removeAllChildren
	 **/
	removeAllChildren: function() {
		this.children.clear();
	},
	
	/**
	 * Performs an array sort operation on the child list.
	 *
	 * <h4>Example: Display children with a higher y in front.</h4>
	 * 
	 *      var sortFunction: function(obj1, obj2, options) {
	 *          if (obj1.y > obj2.y) { return 1; }
	 *          if (obj1.y < obj2.y) { return -1; }
	 *          return 0;
	 *      }
	 *      container.sortChildren(sortFunction);
	 *
	 * @method sortChildren
	 * @param {Function} sortFunction the function to use to sort the child list. See JavaScript's <code>Array.sort</code>
	 * documentation for details.
	 **/
	sortChildren: function(sortFunction) {
		this.children.sort(sortFunction);
	},
	
	/**
	 * Returns true if the specified display object either is this container or is a descendent (child, grandchild, etc)
	 * of this container.
	 * @method contains
	 * @param {DisplayObject} child The DisplayObject to be checked.
	 * @return {Boolean} true if the specified display object either is this container or is a descendent.
	 **/
	contains: function(child) {
		while (child) {
			if (child === this) {
				return true;
			}
			child = child.parent;
		}
		return false;
	},
	
	/**
	 * Returns an array of all display objects under the specified coordinates that are in this container's display
	 * list. This routine ignores any display objects with mouseEnabled set to false. The array will be sorted in order
	 * of visual depth, with the top-most display object at index 0. This uses shape based hit detection, and can be an
	 * expensive operation to run, so it is best to use it carefully. For example, if testing for objects under the
	 * mouse, test on tick (instead of on mousemove), and only if the mouse's position has changed.
	 * @method getObjectsUnderPoint
	 * @param {Number} x The x position in the container to test.
	 * @param {Number} y The y position in the container to test.
	 * @return {Array} An Array of DisplayObjects under the specified coordinates.
	 **/
	/*getObjectsUnderPoint: function(x, y, results) {
		var pt = this.localToGlobal(x, y);
		this._getObjectsUnderPoint(pt.x, pt.y, results);
	},*/

	/**
	 * Similar to {{#crossLink "Container/getObjectsUnderPoint()"}}{{/crossLink}}, but returns only the top-most display
	 * object. This runs significantly faster than <code>getObjectsUnderPoint()<code>, but is still an expensive
	 * operation. See {{#crossLink "Container/getObjectsUnderPoint"}}{{/crossLink}} for more information.
	 * @method getObjectUnderPoint
	 * @param {Number} x The x position in the container to test.
	 * @param {Number} y The y position in the container to test.
	 * @return {DisplayObject} The top-most display object under the specified coordinates.
	 **/
	/*getObjectUnderPoint: function(x, y) {
		var pt = this.localToGlobal(x, y);
		return this._getObjectsUnderPoint(pt.x, pt.y);
	},*/
	
	/**
	 * Docced in superclass.
	 */
	/*getBounds: function() {
		return this._getBounds(null, true);
	},*/


	/**
	 * Docced in superclass.
	 */
	/*getTransformedBounds: function() {
		return this._getBounds();
	},*/
	
	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	toString: function() {
		return "[Container (name="+  this.name +")]";
	},
	
	
	/*-------------------------------------------------------------------------------
									DISPLAY OBJECT
	-------------------------------------------------------------------------------*/
	
	getStage: function() {
		var o = this;
		while (o.parent) {
			o = o.parent;
		}
		return o;
	},
	
	localToGlobal: function(x, y) {
		var mtx = this.getConcatenatedMatrix(this._matrix);
		if (mtx == null) { return null; }
		mtx.append(1, 0, 0, 1, x, y);
		return this._scratchPoint.reset(mtx.tx, mtx.ty);
	},
	
	globalToLocal: function(x, y) {
		var mtx = this.getConcatenatedMatrix(this._matrix);
		if (mtx == null) { return null; }
		mtx.invert();
		mtx.append(1, 0, 0, 1, x, y);
		return this._scratchPoint.reset(mtx.tx, mtx.ty);
	},
	
	localToLocal: function(x, y, target) {
		var pt = this.localToGlobal(x, y);
		return target.globalToLocal(pt.x, pt.y);
	},
	
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
	
	getMatrix: function(matrix) {
		var o = this;
		return (matrix ? matrix.identity() : new Matrix2()).appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.angle, o.skewX, o.skewY, o.regX, o.regY);
	},
	
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
	
	/*-------------------------------------------------------------------------------
									PRIVATE
	-------------------------------------------------------------------------------*/
	
	/**
	 * @method _getObjectsUnderPoint
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Array} results
	 * @return {Array}
	 * @protected
	 **/
	/*_getObjectsUnderPoint: function(x, y, results) {
		
	},*/

	/**
	 * @method _getBounds
	 * @param {Matrix2D} matrix
	 * @param {Boolean} ignoreTransform If true, does not apply this object's transform.
	 * @return {Rectangle}
	 * @protected
	 **/
	/*_getBounds: function(matrix, ignoreTransform) {
		var bounds = this.DisplayObject_getBounds();
		if (bounds) { return this._transformBounds(bounds, matrix, ignoreTransform); }
		
		var minX, maxX, minY, maxY;
		var mtx = ignoreTransform ? this._matrix.identity() : this.getMatrix(this._matrix);
		if (matrix) { mtx.prependMatrix(matrix); }
		
		var l = this.children.length;
		for (var i=0; i<l; i++) {
			var child = this.children[i];
			if (!child.visible || !(bounds = child._getBounds(mtx))) { continue; }
			var x1=bounds.x, y1=bounds.y, x2=x1+bounds.width, y2=y1+bounds.height;
			if (x1 < minX || minX == null) { minX = x1; }
			if (x2 > maxX || maxX == null) { maxX = x2; }
			if (y1 < minY || minY == null) { minY = y1; }
			if (y2 > maxY || maxY == null) { maxY = y2; }
		}
		
		return (maxX == null) ? null : this._rectangle.initialize(minX, minY, maxX-minX, maxY-minY);
	}*/
};
return Container;
});
