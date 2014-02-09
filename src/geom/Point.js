var Point = function() {
	this.x = 0;
	this.y = 0;
};
Point.prototype.copy = function(p) {
	p.x = this.x;
	p.y = this.y;
};
Point.prototype.clone = function() {
	return new Point(this.x, this.y);
};
Point.prototype.toString = function() {
	return '[Point (x='+this.x+' y='+this.y+')]';
};
