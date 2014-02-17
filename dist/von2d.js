
var von2d = {};
von2d['Rectangle'] = function (require) {
    var Rectangle = function (x, y, width, height) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
    };
    Rectangle.prototype.copy = function (rectangle) {
        rectangle.x = this.x;
        rectangle.y = this.y;
        rectangle.width = this.width;
        rectangle.height = this.height;
    };
    Rectangle.prototype.clone = function () {
        return new Rectangle(this.x, this.y, this.width, this.height);
    };
    Rectangle.prototype.contains = function (x, y) {
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
    Rectangle.prototype.toString = function () {
        return '[Rectangle (x=' + this.x + ' y=' + this.y + ' width=' + this.width + ' height=' + this.height + ')]';
    };
    return Rectangle;
}({});
von2d['VonPixi'] = function (require, Rectangle) {
    var Rectangle = Rectangle;
    var VonPixi = {
            blendModes: {
                NORMAL: 0,
                ADD: 1,
                MULTIPLY: 2,
                SCREEN: 3,
                OVERLAY: 4,
                DARKEN: 5,
                LIGHTEN: 6,
                COLOR_DODGE: 7,
                COLOR_BURN: 8,
                HARD_LIGHT: 9,
                SOFT_LIGHT: 10,
                DIFFERENCE: 11,
                EXCLUSION: 12,
                HUE: 13,
                SATURATION: 14,
                COLOR: 15,
                LUMINOSITY: 16
            },
            blendModesCanvas: [],
            scaleModes: {
                DEFAULT: 0,
                LINEAR: 0,
                NEAREST: 1
            },
            EmptyRectangle: new Rectangle()
        };
    return VonPixi;
}({}, von2d['Rectangle']);
von2d['Point'] = function (require) {
    var Point = function (x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };
    Point.prototype.copy = function (p) {
        p.x = this.x;
        p.y = this.y;
    };
    Point.prototype.reset = function (x, y) {
        this.x = x || 0;
        this.y = y || (y !== 0 ? this.x : 0);
    };
    Point.prototype.clone = function () {
        return new Point(this.x, this.y);
    };
    Point.prototype.toString = function () {
        return '[Point (x=' + this.x + ' y=' + this.y + ')]';
    };
    return Point;
}({});
/*
* Matrix2
* From http://createjs.com/ without a bunch of properties I don't use.
*/
von2d['Matrix2'] = function (require) {
    var Matrix2 = function (a, b, c, d, tx, ty) {
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
    Matrix2.identity = null;
    Matrix2.DEG_TO_RAD = Math.PI / 180;
    Matrix2.prototype.prepend = function (a, b, c, d, tx, ty) {
        var a1, c1, tx1 = this.tx;
        if (a !== 1 || b !== 0 || c !== 0 || d !== 1) {
            a1 = this.a;
            c1 = this.c;
            this.a = a1 * a + this.b * c;
            this.b = a1 * b + this.b * d;
            this.c = c1 * a + this.d * c;
            this.d = c1 * b + this.d * d;
        }
        this.tx = tx1 * a + this.ty * c + tx;
        this.ty = tx1 * b + this.ty * d + ty;
        return this;
    };
    Matrix2.prototype.append = function (a, b, c, d, tx, ty) {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        this.a = a * a1 + b * c1;
        this.b = a * b1 + b * d1;
        this.c = c * a1 + d * c1;
        this.d = c * b1 + d * d1;
        this.tx = tx * a1 + ty * c1 + this.tx;
        this.ty = tx * b1 + ty * d1 + this.ty;
        return this;
    };
    Matrix2.prototype.prependMatrix = function (matrix) {
        this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        return this;
    };
    Matrix2.prototype.appendMatrix = function (matrix) {
        this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        return this;
    };
    Matrix2.prototype.prependTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        var cos, sin;
        if (rotation % TAU) {
            cos = Math.cos(rotation);
            sin = Math.sin(rotation);
        } else {
            cos = 1;
            sin = 0;
        }
        if (regX || regY) {
            this.tx -= regX;
            this.ty -= regY;
        }
        if (skewX || skewY) {
            this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
            this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
        } else {
            this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
        }
        return this;
    };
    Matrix2.prototype.appendTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        var cos, sin;
        if (rotation % TAU) {
            cos = Math.cos(rotation);
            sin = Math.sin(rotation);
        } else {
            cos = 1;
            sin = 0;
        }
        if (skewX || skewY) {
            this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
        } else {
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
        }
        if (regX || regY) {
            this.tx -= regX * this.a + regY * this.c;
            this.ty -= regX * this.b + regY * this.d;
        }
        return this;
    };
    Matrix2.prototype.rotate = function (angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var a1 = this.a;
        var c1 = this.c;
        var tx1 = this.tx;
        this.a = a1 * cos - this.b * sin;
        this.b = a1 * sin + this.b * cos;
        this.c = c1 * cos - this.d * sin;
        this.d = c1 * sin + this.d * cos;
        this.tx = tx1 * cos - this.ty * sin;
        this.ty = tx1 * sin + this.ty * cos;
        return this;
    };
    Matrix2.prototype.skew = function (skewX, skewY) {
        this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
        return this;
    };
    Matrix2.prototype.scale = function (x, y) {
        this.a *= x;
        this.d *= y;
        this.c *= x;
        this.b *= y;
        this.tx *= x;
        this.ty *= y;
        return this;
    };
    Matrix2.prototype.translate = function (x, y) {
        this.tx += x;
        this.ty += y;
        return this;
    };
    Matrix2.prototype.identity = function () {
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        return this;
    };
    Matrix2.prototype.invert = function () {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        var tx1 = this.tx;
        var n = a1 * d1 - b1 * c1;
        this.a = d1 / n;
        this.b = -b1 / n;
        this.c = -c1 / n;
        this.d = a1 / n;
        this.tx = (c1 * this.ty - d1 * tx1) / n;
        this.ty = -(a1 * this.ty - b1 * tx1) / n;
        return this;
    };
    Matrix2.prototype.isIdentity = function () {
        return this.tx === 0 && this.ty === 0 && this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1;
    };
    Matrix2.prototype.transformPoint = function (x, y, pt) {
        pt = pt || {};
        pt.x = x * this.a + y * this.c + this.tx;
        pt.y = x * this.b + y * this.d + this.ty;
        return pt;
    };
    Matrix2.prototype.decompose = function (target) {
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
                target.rotation += target.rotation <= 0 ? PI : -PI;
            }
            target.skewX = target.skewY = 0;
        } else {
            target.skewX = skewX;
            target.skewY = skewY;
        }
        return target;
    };
    Matrix2.prototype.fromArray = function (array) {
        this.a = array[0];
        this.b = array[1];
        this.c = array[3];
        this.d = array[4];
        this.tx = array[2];
        this.ty = array[5];
    };
    Matrix2.prototype.toArray = function (transpose) {
        if (!this.array)
            this.array = new Float32Array(9);
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
        return array;
    };
    Matrix2.prototype.copy = function (matrix) {
        this.a = matrix.a;
        this.b = matrix.b;
        this.c = matrix.c;
        this.d = matrix.d;
        this.tx = matrix.tx;
        this.ty = matrix.ty;
        return this;
    };
    Matrix2.prototype.clone = function () {
        return new Matrix2().copy(this);
    };
    Matrix2.prototype.toString = function () {
        return '[Matrix2 (a=' + this.a + ' b=' + this.b + ' c=' + this.c + ' d=' + this.d + ' tx=' + this.tx + ' ty=' + this.ty + ')]';
    };
    Matrix2.identity = new Matrix2();
    return Matrix2;
}({});
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */
von2d['DisplayObject'] = function (require, VonPixi, Point, Rectangle, Matrix2) {
    var VonPixi = VonPixi;
    var Point = Point;
    var Rectangle = Rectangle;
    var Matrix = Matrix2;
    var DisplayObject = function () {
        this.uniqueId = Math.random().toString(36).slice(2) + Date.now();
        this.position = new Point();
        this.scale = new Point(1, 1);
        this.pivot = new Point();
        this.rotation = 0;
        this.alpha = 1;
        this.visible = true;
        this.renderable = false;
        this.parent = null;
        this.stage = null;
        this.worldAlpha = 1;
        this.worldTransform = new Matrix();
        this._sr = 0;
        this._cr = 1;
        this._bounds = new Rectangle(0, 0, 1, 1);
        this._currentBounds = null;
        this._parentTransform = null;
        this._a00 = 0;
        this._a01 = 0;
        this._a10 = 0;
        this._a11 = 0;
        this._a02 = 0;
        this._a12 = 0;
        this._b00 = 0;
        this._b10 = 0;
    };
    Object.defineProperty(DisplayObject.prototype, 'worldVisible', {
        get: function () {
            var item = this;
            while (item) {
                if (!item.visible) {
                    return false;
                }
                item = item.parent;
            }
            return true;
        }
    });
    DisplayObject.prototype.updateTransform = function () {
        if (this.rotation !== this.rotationCache) {
            this.rotationCache = this.rotation;
            this._sr = Math.sin(this.rotation);
            this._cr = Math.cos(this.rotation);
        }
        this._parentTransform = this.parent.worldTransform;
        this._a00 = this._cr * this.scale.x;
        this._a01 = -this._sr * this.scale.y;
        this._a10 = this._sr * this.scale.x;
        this._a11 = this._cr * this.scale.y;
        this._a02 = this.position.x - this._a00 * this.pivot.x - this.pivot.y * this._a01;
        this._a12 = this.position.y - this._a11 * this.pivot.y - this.pivot.x * this._a10;
        this._b00 = this._parentTransform.a;
        this._b01 = this._parentTransform.b;
        this._b10 = this._parentTransform.c;
        this._b11 = this._parentTransform.d;
        this.worldTransform.a = this._b00 * this._a00 + this._b01 * this._a10;
        this.worldTransform.b = this._b00 * this._a01 + this._b01 * this._a11;
        this.worldTransform.tx = this._b00 * this._a02 + this._b01 * this._a12 + this._parentTransform.tx;
        this.worldTransform.c = this._b10 * this._a00 + this._b11 * this._a10;
        this.worldTransform.d = this._b10 * this._a01 + this._b11 * this._a11;
        this.worldTransform.ty = this._b10 * this._a02 + this._b11 * this._a12 + this._parentTransform.ty;
        this.worldAlpha = this.alpha * this.parent.worldAlpha;
    };
    DisplayObject.prototype.getBounds = function (matrix) {
        matrix = matrix;
        return VonPixi.EmptyRectangle;
    };
    DisplayObject.prototype.setStageReference = function (stage) {
        this.stage = stage;
    };
    DisplayObject.prototype.draw = function (ctx) {
        ctx = ctx;
    };
    Object.defineProperty(DisplayObject.prototype, 'x', {
        get: function () {
            return this.position.x;
        },
        set: function (value) {
            this.position.x = value;
        }
    });
    Object.defineProperty(DisplayObject.prototype, 'y', {
        get: function () {
            return this.position.y;
        },
        set: function (value) {
            this.position.y = value;
        }
    });
    return DisplayObject;
}({}, von2d['VonPixi'], von2d['Point'], von2d['Rectangle'], von2d['Matrix2']);
/*
	Mat made a fine Sprite... except for all the local variable created in functions, that shit will thrash the garbage reeaaaally hard. Anyway, I stripped out masking, filters, and other things to make it lighter and faster. I recommend just going with the PIXI rendering engine and not this version unless you have your own loader and compatibility isn't an issue. Also removed WebGL support, because it doesn't exist where I go.
	
	@author Mat Groves http://matgroves.com/ @Doormat23
*/
von2d['Sprite'] = function (require, VonPixi, DisplayObject, Point, Rectangle) {
    var VonPixi = VonPixi;
    var DisplayObject = DisplayObject;
    var Point = Point;
    var Rectangle = Rectangle;
    var Sprite = function (image, frame) {
        DisplayObject.call(this);
        this.anchor = new Point(0.5, 0.5);
        this.texture = image;
        this._width = frame ? frame.width : image.width;
        this._height = frame ? frame.height : image.height;
        this.frame = frame || new Rectangle(0, 0, image.width, image.height);
        this.scale.x = this._width / this.frame.width;
        this.scale.y = this._height / this.frame.height;
        this.blendMode = VonPixi.blendModes.NORMAL;
        this.renderable = true;
    };
    Sprite.prototype = Object.create(DisplayObject.prototype);
    Sprite.prototype.constructor = Sprite;
    Object.defineProperty(Sprite.prototype, 'width', {
        get: function () {
            return this.scale.x * this.frame.width;
        },
        set: function (value) {
            this.scale.x = value / this.frame.width;
            this._width = value;
        }
    });
    Object.defineProperty(Sprite.prototype, 'height', {
        get: function () {
            return this.scale.y * this.frame.height;
        },
        set: function (value) {
            this.scale.y = value / this.frame.height;
            this._height = value;
        }
    });
    Sprite.prototype.getBounds = function (matrix) {
        var width = this.frame.width;
        var height = this.frame.height;
        var w0 = width * (1 - this.anchor.x);
        var w1 = width * -this.anchor.x;
        var h0 = height * (1 - this.anchor.y);
        var h1 = height * -this.anchor.y;
        var worldTransform = matrix || this.worldTransform;
        var a = worldTransform.a;
        var b = worldTransform.c;
        var c = worldTransform.b;
        var d = worldTransform.d;
        var tx = worldTransform.tx;
        var ty = worldTransform.ty;
        var x1 = a * w1 + c * h1 + tx;
        var y1 = d * h1 + b * w1 + ty;
        var x2 = a * w0 + c * h1 + tx;
        var y2 = d * h1 + b * w0 + ty;
        var x3 = a * w0 + c * h0 + tx;
        var y3 = d * h0 + b * w0 + ty;
        var x4 = a * w1 + c * h0 + tx;
        var y4 = d * h0 + b * w1 + ty;
        var maxX = -Infinity;
        var maxY = -Infinity;
        var minX = Infinity;
        var minY = Infinity;
        minX = x1 < minX ? x1 : minX;
        minX = x2 < minX ? x2 : minX;
        minX = x3 < minX ? x3 : minX;
        minX = x4 < minX ? x4 : minX;
        minY = y1 < minY ? y1 : minY;
        minY = y2 < minY ? y2 : minY;
        minY = y3 < minY ? y3 : minY;
        minY = y4 < minY ? y4 : minY;
        maxX = x1 > maxX ? x1 : maxX;
        maxX = x2 > maxX ? x2 : maxX;
        maxX = x3 > maxX ? x3 : maxX;
        maxX = x4 > maxX ? x4 : maxX;
        maxY = y1 > maxY ? y1 : maxY;
        maxY = y2 > maxY ? y2 : maxY;
        maxY = y3 > maxY ? y3 : maxY;
        maxY = y4 > maxY ? y4 : maxY;
        var bounds = this._bounds;
        bounds.x = minX;
        bounds.width = maxX - minX;
        bounds.y = minY;
        bounds.height = maxY - minY;
        this._currentBounds = bounds;
        return bounds;
    };
    Sprite.prototype.draw = function (ctx) {
        ctx.globalAlpha = this.worldAlpha;
        ctx.setTransform(this.worldTransform.a, this.worldTransform.c, this.worldTransform.b, this.worldTransform.d, this.worldTransform.tx, this.worldTransform.ty);
        ctx.drawImage(this.texture, this.frame.x, this.frame.y, this.frame.width, this.frame.height, this.anchor.x * -this.frame.width, this.anchor.y * -this.frame.height, this.frame.width, this.frame.height);
    };
    return Sprite;
}({}, von2d['VonPixi'], von2d['DisplayObject'], von2d['Point'], von2d['Rectangle']);
/**
 * @source https://github.com/martinwells/gamecore.js
 * Hoisted to the global namespace for convenience.
 */
von2d['LinkedList'] = function () {
    var LinkedListNode = function () {
        this.obj = null;
        this.next = null;
        this.prev = null;
        this.free = true;
    };
    window.LinkedListNode = LinkedListNode;
    var LinkedList = function () {
        this.first = null;
        this.last = null;
        this.length = 0;
        this.objToNodeMap = {};
        this.uniqueId = Date.now() + '' + Math.floor(Math.random() * 1000);
        this.getNode = function (obj) {
            return this.objToNodeMap[obj.uniqueId];
        };
        this.addNode = function (obj) {
            var node = new LinkedListNode();
            node.obj = obj;
            node.prev = null;
            node.next = null;
            node.free = false;
            this.objToNodeMap[obj.uniqueId] = node;
            return node;
        };
        this.add = function (obj) {
            var node = this.objToNodeMap[obj.uniqueId];
            if (!node) {
                node = this.addNode(obj);
            } else {
                if (node.free === false)
                    return;
                node.obj = obj;
                node.free = false;
                node.next = null;
                node.prev = null;
            }
            if (!this.first) {
                this.first = node;
                this.last = node;
                node.next = null;
                node.prev = null;
            } else {
                if (this.last == null) {
                    throw new Error('Hmm, no last in the list -- that shouldn\'t happen here');
                }
                this.last.next = node;
                node.prev = this.last;
                this.last = node;
                node.next = null;
            }
            this.length++;
            if (this.showDebug)
                this.dump('after add');
        };
        this.has = function (obj) {
            return !!this.objToNodeMap[obj.uniqueId];
        };
        this.moveUp = function (obj) {
            this.dump('before move up');
            var c = this.getNode(obj);
            if (!c)
                throw 'Oops, trying to move an object that isn\'t in the list';
            if (c.prev == null)
                return;
            var b = c.prev;
            var a = b.prev;
            if (c == this.last)
                this.last = b;
            var oldCNext = c.next;
            if (a)
                a.next = c;
            c.next = b;
            c.prev = b.prev;
            b.next = oldCNext;
            b.prev = c;
            if (this.first == b)
                this.first = c;
        };
        this.moveDown = function (obj) {
            var b = this.getNode(obj);
            if (!b)
                throw 'Oops, trying to move an object that isn\'t in the list';
            if (b.next == null)
                return;
            var c = b.next;
            this.moveUp(c.obj);
            if (this.last == c)
                this.last = b;
        };
        this.sort = function (compare) {
            var sortArray = [];
            var i, l, node = this.first;
            while (node) {
                sortArray.push(node.object());
                node = node.next();
            }
            this.clear();
            sortArray.sort(compare);
            l = sortArray.length;
            for (i = 0; i < l; i++) {
                this.add(sortArray[i]);
            }
        };
        this.remove = function (obj) {
            var node = this.getNode(obj);
            if (node == null || node.free == true) {
                return false;
            }
            if (node.prev != null)
                node.prev.next = node.next;
            if (node.next != null)
                node.next.prev = node.prev;
            if (node.prev == null)
                this.first = node.next;
            if (node.next == null)
                this.last = node.prev;
            node.free = true;
            node.prev = null;
            node.next = null;
            this.length--;
            return true;
        };
        this.shift = function () {
            var node = this.first;
            if (this.length === 0)
                return null;
            if (node.prev) {
                node.prev.next = node.next;
            }
            if (node.next) {
                node.next.prev = node.prev;
            }
            this.first = node.next;
            if (!node.next)
                this.last = null;
            node.free = true;
            node.prev = null;
            node.next = null;
            this.length--;
            return node.obj;
        };
        this.pop = function () {
            var node = this.last;
            if (this.length === 0)
                return null;
            if (node.prev) {
                node.prev.next = node.next;
            }
            if (node.next) {
                node.next.prev = node.prev;
            }
            this.last = node.prev;
            if (!node.prev)
                this.first = null;
            node.free = true;
            node.prev = null;
            node.next = null;
            this.length--;
            return node.obj;
        };
        this.clear = function () {
            var next = this.first;
            while (next) {
                next.free = true;
                next = next.next;
            }
            this.first = null;
            this.length = 0;
        };
        this.dispose = function () {
            var next = this.first;
            while (next) {
                next.obj = null;
                next = next.next;
            }
            this.first = null;
            this.objToNodeMap = null;
        };
        this.dump = function (msg) {
            console.log('====================' + msg + '=====================');
            var a = this.first;
            while (a != null) {
                console.log('{' + a.obj.toString() + '} previous=' + (a.prev ? a.prev.obj : 'NULL'));
                a = a.next();
            }
            console.log('===================================');
            console.log('Last: {' + (this.last ? this.last.obj : 'NULL') + '} ' + 'First: {' + (this.first ? this.first.obj : 'NULL') + '}');
        };
    };
    window.LinkedList = LinkedList;
    return LinkedList;
}();
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */
von2d['Container'] = function (require, VonPixi, DisplayObject, LinkedList) {
    var VonPixi = VonPixi;
    var DisplayObject = DisplayObject;
    var LinkedList = LinkedList;
    Container = function () {
        DisplayObject.call(this);
        this.children = new LinkedList();
    };
    Container.prototype = Object.create(DisplayObject.prototype);
    Container.prototype.constructor = Container;
    Container.prototype.addChild = function (child) {
        var i, l = arguments.length;
        if (l > 1) {
            for (i = 0; i < l; i++) {
                this.addChild(arguments[i]);
            }
            return arguments[l - 1];
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
    Container.prototype.removeChild = function (child) {
        child.parent = null;
        if (this.stage) {
            child.stage = null;
        }
        return this.children.remove(child);
    };
    Container.prototype.contains = function (child) {
        while (child) {
            if (child === this) {
                return true;
            }
            child = child.parent;
        }
        return false;
    };
    Container.prototype.updateTransform = function () {
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
    Container.prototype.getBounds = function (matrix) {
        var node;
        if (this.children.length === 0) {
            return VonPixi.EmptyRectangle;
        }
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
            childBounds = node.obj.getBounds(matrix);
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
        return bounds;
    };
    Container.prototype.getLocalBounds = function () {
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
    Container.prototype.setStageReference = function (stage) {
        var node;
        this.stage = stage;
        node = this.children.first;
        while (node) {
            node.obj.setStageReference(stage);
            node = node.next;
        }
    };
    Container.prototype.removeStageReference = function () {
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
    Container.prototype.draw = function (ctx) {
        var node;
        if (this.visible === false || this.alpha === 0) {
            return;
        }
        node = this.children.first;
        while (node) {
            if (node.obj.visible && node.obj.alpha > 0) {
                node.obj.draw(ctx);
            }
            node = node.next;
        }
    };
    return Container;
}({}, von2d['VonPixi'], von2d['DisplayObject'], von2d['LinkedList']);
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */
von2d['Stage'] = function (require, VonPixi, Container, Matrix2) {
    var VonPixi = VonPixi;
    var Container = Container;
    var Matrix = Matrix2;
    var Stage = function (width, height, view) {
        Container.call(this);
        this.clearBeforeRender = true;
        VonPixi.blendModesCanvas[VonPixi.blendModes.NORMAL] = 'source-over';
        VonPixi.blendModesCanvas[VonPixi.blendModes.ADD] = 'lighter';
        VonPixi.blendModesCanvas[VonPixi.blendModes.MULTIPLY] = 'multiply';
        VonPixi.blendModesCanvas[VonPixi.blendModes.SCREEN] = 'screen';
        VonPixi.blendModesCanvas[VonPixi.blendModes.OVERLAY] = 'overlay';
        VonPixi.blendModesCanvas[VonPixi.blendModes.DARKEN] = 'darken';
        VonPixi.blendModesCanvas[VonPixi.blendModes.LIGHTEN] = 'lighten';
        VonPixi.blendModesCanvas[VonPixi.blendModes.COLOR_DODGE] = 'color-dodge';
        VonPixi.blendModesCanvas[VonPixi.blendModes.COLOR_BURN] = 'color-burn';
        VonPixi.blendModesCanvas[VonPixi.blendModes.HARD_LIGHT] = 'hard-light';
        VonPixi.blendModesCanvas[VonPixi.blendModes.SOFT_LIGHT] = 'soft-light';
        VonPixi.blendModesCanvas[VonPixi.blendModes.DIFFERENCE] = 'difference';
        VonPixi.blendModesCanvas[VonPixi.blendModes.EXCLUSION] = 'exclusion';
        VonPixi.blendModesCanvas[VonPixi.blendModes.HUE] = 'hue';
        VonPixi.blendModesCanvas[VonPixi.blendModes.SATURATION] = 'saturation';
        VonPixi.blendModesCanvas[VonPixi.blendModes.COLOR] = 'color';
        VonPixi.blendModesCanvas[VonPixi.blendModes.LUMINOSITY] = 'luminosity';
        this.width = width || 800;
        this.height = height || 600;
        this.view = view || document.createElement('canvas');
        this.context = this.view.getContext('2d');
        this.view.width = this.width;
        this.view.height = this.height;
        this.worldTransform = new Matrix();
        this.stage = this;
    };
    Stage.prototype = Object.create(Container.prototype);
    Stage.prototype.constructor = Stage;
    Stage.prototype.draw = function () {
        var node = this.children.first;
        this.worldAlpha = 1;
        while (node) {
            node.obj.updateTransform();
            node = node.next;
        }
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.globalAlpha = 1;
        if (this.clearBeforeRender) {
            this.context.clearRect(0, 0, this.width, this.height);
        }
        node = this.children.first;
        while (node) {
            if (node.obj.visible && node.obj.alpha > 0) {
                node.obj.draw(this.context);
            }
            node = node.next;
        }
    };
    Stage.prototype.resize = function (width, height) {
        this.width = width;
        this.height = height;
        this.view.width = width;
        this.view.height = height;
    };
    return Stage;
}({}, von2d['VonPixi'], von2d['Container'], von2d['Matrix2']);