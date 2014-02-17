/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */
define(function(require) {
	
	// imports
	var VonPixi = require('VonPixi');
	var DisplayObject = require('DisplayObject');
	var LinkedList = require('LinkedList');
	
	/**
	 * A Container represents a collection of display objects.
	 * It is the base class of all display objects that act as a container for other objects.
	 *
	 * @class Container
	 * @extends DisplayObject
	 * @constructor
	 */
	Container = function() {
		DisplayObject.call(this);

		/**
		 * [read-only] The array of children of this container.
		 *
		 * @property children
		 * @type Array<DisplayObject>
		 * @readOnly
		 */
		this.children = new LinkedList();
	};

	// constructor
	Container.prototype = Object.create(DisplayObject.prototype);
	Container.prototype.constructor = Container;

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
	Container.prototype.addChild = function(child) {
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
		if (this.stage) {
			child.setStageReference(this.stage);
		}
		this.children.add(child);
		return child;
	};
	
	/**
	 * Removes a child from the container.
	 *
	 * @method removeChild
	 * @param child {DisplayObject} The DisplayObject to remove
	 * @return The child if it existed in this container, or null otherwise.
	 */
	Container.prototype.removeChild = function(child) {
		child.parent = null;
		if (this.stage) {
			child.stage = null;
		}
		return this.children.remove(child);
	};
	
	/**
	 * Returns true if the specified display object either is this container or is a descendent (child, grandchild, etc)
	 * of this container.
	 * @method contains
	 * @param {DisplayObject} child The DisplayObject to be checked.
	 * @return {Boolean} true if the specified display object either is this container or is a descendent.
	 **/
	Container.prototype.contains = function(child) {
		while (child) {
			if (child === this) {
				return true;
			}
			child = child.parent;
		}
		return false;
	};
	
	/*
	 * Updates the container's childrens transform for rendering
	 *
	 * @method updateTransform
	 * @private
	 */
	Container.prototype.updateTransform = function() {
		var node;
		if (!this.visible) {
			return;
		}

		DisplayObject.prototype.updateTransform.call(this);
		
		node = this.children.first;
		while (node) {
			node.obj.updateTransform();
			node = node.next;
		}
	};

	/**
	 * Retrieves the bounds of the displayObjectContainer as a rectangle object
	 *
	 * @method getBounds
	 * @return {Rectangle} the rectangular bounding area
	 */
	Container.prototype.getBounds = function(matrix) {
		var node;
		if (this.children.length === 0) {
			return VonPixi.EmptyRectangle;
		}

		// TODO the bounds have already been calculated this render session so return what we have
		if (matrix) {
			var matrixCache = this.worldTransform;
			this.worldTransform = matrix;
			this.updateTransform();
			this.worldTransform = matrixCache;
		}

		var minX = Infinity;
		var minY = Infinity;

		var maxX = -Infinity;
		var maxY = -Infinity;

		var childBounds;
		var childMaxX;
		var childMaxY;

		var childVisible = false;
		
		node = this.children.first;
		while (node) {
			if (!node.obj.visible) {
				node = node.next;
				continue;
			}

			childVisible = true;

			childBounds = node.obj.getBounds( matrix );
		 
			minX = minX < childBounds.x ? minX : childBounds.x;
			minY = minY < childBounds.y ? minY : childBounds.y;

			childMaxX = childBounds.width + childBounds.x;
			childMaxY = childBounds.height + childBounds.y;

			maxX = maxX > childMaxX ? maxX : childMaxX;
			maxY = maxY > childMaxY ? maxY : childMaxY;
			
			node = node.next;
		}

		if (!childVisible) {
			return VonPixi.EmptyRectangle;
		}

		var bounds = this._bounds;

		bounds.x = minX;
		bounds.y = minY;
		bounds.width = maxX - minX;
		bounds.height = maxY - minY;

		// TODO: store a reference so that if this function gets called again in the render cycle we do not have to recalculate
		//this._currentBounds = bounds;
	   
		return bounds;
	};

	Container.prototype.getLocalBounds = function() {
		var node;
		var matrixCache = this.worldTransform;

		this.worldTransform = identityMatrix;

		node = this.children.first;
		while (node) {
			node.obj.updateTransform();
			node = node.next;
		}

		var bounds = this.getBounds();

		this.worldTransform = matrixCache;

		return bounds;
	};

	/**
	 * Sets the container's stage reference, the stage this object is connected to
	 *
	 * @method setStageReference
	 * @param stage {Stage} the stage that the container will have as its current stage reference
	 */
	Container.prototype.setStageReference = function(stage) {
		var node;
		this.stage = stage;

		node = this.children.first;
		while (node) {
			node.obj.setStageReference(stage);
			node = node.next;
		}
	};

	/**
	 * removes the current stage reference of the container
	 *
	 * @method removeStageReference
	 */
	Container.prototype.removeStageReference = function() {
		var node = this.children.first;
		while (node) {
			node.obj.removeStageReference();
			node = node.next;
		}

		if (this._interactive) {
			this.stage.dirty = true;
		}
		
		this.stage = null;
	};

	/**
	* Renders the object using the Canvas renderer
	*
	* @method draw
	* @param ctx {Canvas Context} 
	* @private
	*/
	Container.prototype.draw = function(ctx) {
		var node;
		if (this.visible === false || this.alpha === 0) {
			return;
		}

		node = this.children.first;
		while (node) {
			node.obj.draw(ctx);
			node = node.next;
		}
	};

	return Container;

});
