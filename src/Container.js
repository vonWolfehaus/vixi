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
	 * Adds a child to the container.
	 *
	 * @method addChild
	 * @param child {DisplayObject} The DisplayObject to add to the container
	 */
	Container.prototype.addChild = function(child) {
		this.children.add(child);
		child.parent = this;
	};
	
	/**
	 * Removes a child from the container.
	 *
	 * @method removeChild
	 * @param child {DisplayObject} The DisplayObject to remove
	 */
	Container.prototype.removeChild = function(child) {
		this.children.remove(child);
		child.parent = null;
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
		}
	};

	return Container;

});
