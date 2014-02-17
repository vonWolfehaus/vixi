define(function (require) {
	var Point = function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	};
	
	Point.prototype.copy = function(p) {
		p.x = this.x;
		p.y = this.y;
	};
	
	Point.prototype.reset = function(x, y) {
		this.x = x || 0;
    	this.y = y || ( (y !== 0) ? this.x : 0 );
	};
	
	Point.prototype.clone = function() {
		return new Point(this.x, this.y);
	};
	
	Point.prototype.toString = function() {
		return '[Point (x='+this.x+' y='+this.y+')]';
	};
	
	return Point;
});
