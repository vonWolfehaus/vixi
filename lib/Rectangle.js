var Rectangle = function() {
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
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
Rectangle.prototype.toString = function() {
	return '[Rectangle (x='+this.x+' y='+this.y+' width='+this.width+' height='+this.height+')]';
};
