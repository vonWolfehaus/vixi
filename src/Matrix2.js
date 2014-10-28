/*
	@source https://github.com/CreateJS/EaselJS/blob/master/src/easeljs/geom/Matrix2D.js
*/
define(function(require) {
	/**
	 * Represents an affine transformation matrix.
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

		return this.array;//[this.a, this.b, this.tx, this.c, this.d, this.ty, 0, 0, 1];
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
	
	return Matrix2;
	
});
