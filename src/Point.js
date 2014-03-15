/*
	I think there's only a few places where these functions are actually used. I hope at some point you could simply replace this class with your own Vector2 class, or even an {x, y} literal.
	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
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
