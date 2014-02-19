/*
* Matrix2
* From http://createjs.com/ without a bunch of properties I don't use.
*/
define(function(require) {
	/**
	 * Represents an affine transformation matrix, and provides tools for constructing and concatenating matrices.
	 * @class Matrix2
	 * @param {Number} [a=1] ScaleX.
	 * @param {Number} [b=0] SkewX.
	 * @param {Number} [c=0] SkewY.
	 * @param {Number} [d=1] ScaleY.
	 * @param {Number} [tx=0] TranslateX.
	 * @param {Number} [ty=0] TranslateY.
	 * @constructor
	 **/
	var Matrix2 = function(a, b, c, d, tx, ty) {
		this.a = !a ? 1 : a;
		this.b = b || 0;
		this.c = c || 0;
		this.d = !d ? 1 : d;
		this.tx = tx || 0;
		this.ty = ty || 0;
		return this;
	};

	var PI = Math.PI;
	var TAU = PI * 2;

	/**
	 * An identity matrix, representing a null transformation.
	 * @property identity
	 * @static
	 * @type Matrix2
	 * @readonly
	 **/
	Matrix2.identity = null; // set at bottom of class definition.

	Matrix2.DEG_TO_RAD = Math.PI / 180;

	/**
	 * Concatenates the specified matrix properties with this matrix. All parameters are required.
	 * @method prepend
	 * @param {Number} a
	 * @param {Number} b
	 * @param {Number} c
	 * @param {Number} d
	 * @param {Number} tx
	 * @param {Number} ty
	 * @return {Matrix2} This matrix. Useful for chaining method calls.
	 **/
	Matrix2.prototype.prepend = function(a, b, c, d, tx, ty) {
		var a1, c1, tx1 = this.tx;
		if (a !== 1 || b !== 0 || c !== 0 || d !== 1) {
			a1 = this.a;
			c1 = this.c;
			this.a  = a1*a+this.b*c;
			this.b  = a1*b+this.b*d;
			this.c  = c1*a+this.d*c;
			this.d  = c1*b+this.d*d;
		}
		this.tx = tx1*a+this.ty*c+tx;
		this.ty = tx1*b+this.ty*d+ty;
		return this;
	};

	/**
	 * Appends the specified matrix properties with this matrix. All parameters are required.
	 * @method append
	 * @param {Number} a
	 * @param {Number} b
	 * @param {Number} c
	 * @param {Number} d
	 * @param {Number} tx
	 * @param {Number} ty
	 * @return {Matrix2} This matrix. Useful for chaining method calls.
	 **/
	Matrix2.prototype.append = function(a, b, c, d, tx, ty) {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;

		this.a  = a*a1+b*c1;
		this.b  = a*b1+b*d1;
		this.c  = c*a1+d*c1;
		this.d  = c*b1+d*d1;
		this.tx = tx*a1+ty*c1+this.tx;
		this.ty = tx*b1+ty*d1+this.ty;
		return this;
	};

	/**
	 * Prepends the specified matrix with this matrix.
	 * @method prependMatrix
	 * @param {Matrix2} matrix
	 * @return {Matrix2} This matrix. Useful for chaining method calls.
	 **/
	Matrix2.prototype.prependMatrix = function(matrix) {
		this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
		return this;
	};

	/**
	 * Appends the specified matrix with this matrix.
	 * @method appendMatrix
	 * @param {Matrix2} matrix
	 * @return {Matrix2} This matrix. Useful for chaining method calls.
	 **/
	Matrix2.prototype.appendMatrix = function(matrix) {
		this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
		return this;
	};

	/**
	 * Generates matrix properties from the specified display object transform properties, and prepends them with this matrix.
	 * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix2();
	 * mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
	 * @method prependTransform
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 * @param {Number} rotation - RADIANS
	 * @param {Number} skewX - RADIANS
	 * @param {Number} skewY - RADIANS
	 * @param {Number} regX Optional.
	 * @param {Number} regY Optional.
	 * @return {Matrix2} This matrix. Useful for chaining method calls.
	 **/
	Matrix2.prototype.prependTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
		var cos, sin;
		if (rotation % TAU) {
			cos = Math.cos(rotation);
			sin = Math.sin(rotation);
		} else {
			cos = 1;
			sin = 0;
		}

		if (regX || regY) {
			// append the registration offset:
			this.tx -= regX; this.ty -= regY;
		}
		if (skewX || skewY) {
			// TODO: can this be combined into a single prepend operation?
			this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
			this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
		} else {
			this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
		}
		return this;
	};

	/**
	 * Generates matrix properties from the specified display object transform properties, and appends them with this matrix.
	 * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix2();
	 * mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
	 * @method appendTransform
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 * @param {Number} rotation
	 * @param {Number} skewX
	 * @param {Number} skewY
	 * @param {Number} regX Optional.
	 * @param {Number} regY Optional.
	 * @return {Matrix2} This matrix. Useful for chaining method calls.
	 **/
	Matrix2.prototype.appendTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
		var cos, sin;
		if (rotation % TAU) {
			cos = Math.cos(rotation);
			sin = Math.sin(rotation);
		} else {
			cos = 1;
			sin = 0;
		}

		if (skewX || skewY) {
			// TODO: can this be combined into a single append?
			this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
			this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
		} else {
			this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
		}

		if (regX || regY) {
			// prepend the registration offset:
			this.tx -= regX*this.a+regY*this.c; 
			this.ty -= regX*this.b+regY*this.d;
		}
		return this;
	};

	/**
	 * Applies a rotation transformation to the matrix.
	 * @method rotate
	 * @param {Number} angle The angle in radians. To use degrees, multiply by <code>Math.PI/180</code>.
	 * @return {Matrix2} This matrix. Useful for chaining method calls.
	 **/
	Matrix2.prototype.rotate = function(angle) {
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);

		var a1 = this.a;
		var c1 = this.c;
		var tx1 = this.tx;

		this.a = a1*cos-this.b*sin;
		this.b = a1*sin+this.b*cos;
		this.c = c1*cos-this.d*sin;
		this.d = c1*sin+this.d*cos;
		this.tx = tx1*cos-this.ty*sin;
		this.ty = tx1*sin+this.ty*cos;
		return this;
	};

	/**
	 * Applies a skew transformation to the matrix.
	 * @method skew
	 * @param {Number} skewX The amount to skew horizontally in radians.
	 * @param {Number} skewY The amount to skew vertically in radians.
	 * @return {Matrix2} This matrix. Useful for chaining method calls.
	*/
	Matrix2.prototype.skew = function(skewX, skewY) {
		this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
		return this;
	};

	/**
	 * Applies a scale transformation to the matrix.
	 * @method scale
	 * @param {Number} x The amount to scale horizontally
	 * @param {Number} y The amount to scale vertically
	 * @return {Matrix2} This matrix. Useful for chaining method calls.
	 **/
	Matrix2.prototype.scale = function(x, y) {
		this.a *= x;
		this.d *= y;
		this.c *= x;
		this.b *= y;
		this.tx *= x;
		this.ty *= y;
		return this;
	};

	/**
	 * Translates the matrix on the x and y axes.
	 * @method translate
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Matrix2} This matrix. Useful for chaining method calls.
	 **/
	Matrix2.prototype.translate = function(x, y) {
		this.tx += x;
		this.ty += y;
		return this;
	};

	/**
	 * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
	 * @method identity
	 * @return {Matrix2} This matrix. Useful for chaining method calls.
	 **/
	Matrix2.prototype.identity = function() {
		this.a = this.d = 1;
		this.b = this.c = this.tx = this.ty = 0;
		return this;
	};

	/**
	 * Inverts the matrix, causing it to perform the opposite transformation.
	 * @method invert
	 * @return {Matrix2} This matrix. Useful for chaining method calls.
	 **/
	Matrix2.prototype.invert = function() {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;
		var tx1 = this.tx;
		var n = a1*d1-b1*c1;

		this.a = d1/n;
		this.b = -b1/n;
		this.c = -c1/n;
		this.d = a1/n;
		this.tx = (c1*this.ty-d1*tx1)/n;
		this.ty = -(a1*this.ty-b1*tx1)/n;
		return this;
	};

	/**
	 * Returns true if the matrix is an identity matrix.
	 * @method isIdentity
	 * @return {Boolean}
	 **/
	Matrix2.prototype.isIdentity = function() {
		return this.tx === 0 && this.ty === 0 && this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1;
	};

	/**
	 * Transforms a point according to this matrix.
	 * @method transformPoint
	 * @param {Number} x The x component of the point to transform.
	 * @param {Number} y The y component of the point to transform.
	 * @param {Point | Object} [pt] An object to copy the result into. If omitted a generic object with x/y properties will be returned.
	 * @return {Point} This matrix. Useful for chaining method calls.
	 **/
	Matrix2.prototype.transformPoint = function(x, y, pt) {
		pt = pt||{};
		pt.x = x*this.a+y*this.c+this.tx;
		pt.y = x*this.b+y*this.d+this.ty;
		return pt;
	};

	/**
	 * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that this these values
	 * may not match the transform properties you used to generate the matrix, though they will produce the same visual
	 * results.
	 * @method decompose
	 * @param {Object} target The object to apply the transform properties to. If null, then a new object will be returned.
	 * @return {Matrix2} This matrix. Useful for chaining method calls.
	*/
	Matrix2.prototype.decompose = function(target) {
		// TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation
		// even when scale is negative
		if (!target) {
			target = {};
		}
		target.x = this.tx;
		target.y = this.ty;
		target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
		target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);

		var skewX = Math.atan2(-this.c, this.d);
		var skewY = Math.atan2(this.b, this.a);

		if (skewX == skewY) {
			target.rotation = skewY;
			if (this.a < 0 && this.d >= 0) {
				target.rotation += (target.rotation <= 0) ? PI : -PI;
			}
			target.skewX = target.skewY = 0;
		} else {
			target.skewX = skewX;
			target.skewY = skewY;
		}
		return target;
	};

	/**
	 * Creates a pixi matrix object based on the array given as a parameter
	 *
	 * @method fromArray
	 * @param array {Array} The array that the matrix will be filled with
	 */
	Matrix2.prototype.fromArray = function(array) {
		this.a = array[0];
		this.b = array[1];
		this.c = array[3];
		this.d = array[4];
		this.tx = array[2];
		this.ty = array[5];
	};

	/**
	 * Creates an array from the current Matrix object
	 *
	 * @method toArray
	 * @param transpose {Boolean} Whether we need to transpose the matrix or not
	 * @return array {Array} the newly created array which contains the matrix
	 */
	Matrix2.prototype.toArray = function(transpose) {
		if (!this.array) this.array = new Float32Array(9);
		var array = this.array;

		if (transpose) {
			this.array[0] = this.a;
			this.array[1] = this.c;
			this.array[2] = 0;
			this.array[3] = this.b;
			this.array[4] = this.d;
			this.array[5] = 0;
			this.array[6] = this.tx;
			this.array[7] = this.ty;
			this.array[8] = 1;
		} else {
			this.array[0] = this.a;
			this.array[1] = this.b;
			this.array[2] = this.tx;
			this.array[3] = this.c;
			this.array[4] = this.d;
			this.array[5] = this.ty;
			this.array[6] = 0;
			this.array[7] = 0;
			this.array[8] = 1;
		}

		return array;//[this.a, this.b, this.tx, this.c, this.d, this.ty, 0, 0, 1];
	};

	/**
	 * Copies all properties from the specified matrix to this matrix.
	 * @method copy
	 * @param {Matrix2} matrix The matrix to copy properties from.
	 * @return {Matrix2} This matrix. Useful for chaining method calls.
	*/
	Matrix2.prototype.copy = function(matrix) {
		this.a = matrix.a;
		this.b = matrix.b;
		this.c = matrix.c;
		this.d = matrix.d;
		this.tx = matrix.tx;
		this.ty = matrix.ty;
		return this;
	};

	/**
	 * Returns a new instance with the same properties of this instance.
	 * @method clone
	 * @return {Matrix2} a clone of the Matrix2 instance.
	 **/
	Matrix2.prototype.clone = function() {
		return (new Matrix2()).copy(this);
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	Matrix2.prototype.toString = function() {
		return "[Matrix2 (a="+this.a+" b="+this.b+" c="+this.c+" d="+this.d+" tx="+this.tx+" ty="+this.ty+")]";
	};

	// this has to be populated after the class is defined:
	Matrix2.identity = new Matrix2();
	
	return Matrix2;
	
});
