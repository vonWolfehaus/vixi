/*
	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
define(function (require) {

	var Rectangle = function(x, y, width, height) {
		this.x = x || 0;
		this.y = y || 0;
		this.width = width || 0;
		this.height = height || 0;
	};

	Rectangle.prototype.copy = function(rectangle) {
		rectangle.x = this.x;
		rectangle.y = this.y;
		rectangle.width = this.width;
		rectangle.height = this.height;
	};

	Rectangle.prototype.clone = function() {
		return new Rectangle(this.x, this.y, this.width, this.height);
	};

	Rectangle.prototype.contains = function(x, y) {
		if (this.width <= 0 || this.height <= 0) {
			return false;
		}

		var x1 = this.x;
		if (x >= x1 && x <= x1 + this.width) {
			var y1 = this.y;

			if (y >= y1 && y <= y1 + this.height) {
				return true;
			}
		}

		return false;
	};

	Rectangle.prototype.toString = function() {
		return '[Rectangle (x='+this.x+' y='+this.y+' width='+this.width+' height='+this.height+')]';
	};
	
	return Rectangle;

});
