import { Point, ArrayList, LineShape } from "../imports";



export enum Direction {
	DIRECTION_UP, DIRECTION_RIGHT, DIRECTION_DOWN, DIRECTION_LEFT
}


export class Rectangle extends Point {
	protected w: number;
	protected h: number;

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y);
		this.w = w;
		this.h = h;
	}

	adjustBoundary() {
		if (this.bx === null) {
			return;
		}
		this.x = Math.min(Math.max(this.bx, this.x), this.bw - this.w);
		this.y = Math.min(Math.max(this.by, this.y), this.bh - this.h);
		this.w = Math.min(this.w, this.bw);
		this.h = Math.min(this.h, this.bh);

		return this;
	}

	resize(dw: number, dh: number) {
		this.w += dw;
		this.h += dh;
		this.adjustBoundary();

		return this;
	}

	scale(dw: number, dh?: number) {
		this.w += (dw);
		this.h += (dh);
		this.x -= (dw / 2);
		this.y -= (dh / 2);
		this.adjustBoundary();

		return this;
	}

	setBounds(rect: Rectangle) {
		this.setPosition(rect.x, rect.y);
		this.w = rect.w;
		this.h = rect.h;

		this.adjustBoundary();

		return this;
	}

	isEmpty() {
		return this.h === 0 || this.w === 0;
	}

	getWidth() {
		return this.w;
	}

	getHeight() {
		return this.h;
	}

	setWidth(w: number) {
		this.w = w;
		this.adjustBoundary();
		return this;
	}

	setHeight(h: number) {
		this.h = h;
		this.adjustBoundary();

		return this;
	}

	getLeft() {
		return this.x;
	}

	getRight() {
		return this.x + this.w;
	}

	getTop() {
		return this.y;
	}

	getBottom() {
		return this.y + this.h;
	}

	getTopLeft() {
		return new Point(this.x, this.y);
	}

	getTopCentre() {
		return new Point(this.x + this.w / 2, this.y);
	}

	getTopRight() {
		return new Point(this.x + this.w, this.y);
	}

	getCenterLeft() {
		return new Point(this.x + this.w, this.y + this.h / 2);
	}

	getBottomCenter() {
		return new Point(this.x + this.w / 2, this.y + this.h);
	}

	getBottomLeft() {
		return new Point(this.x, this.y + this.h);
	}

	getCenter() {
		return new Point(this.x + this.w / 2, this.y + this.h / 2);
	}

	getBottomRight() {
		return new Point(this.x + this.w, this.y + this.h);
	}

	getVertices() {
		var result = new ArrayList<Point>();

		result.add(this.getTopLeft());
		result.add(this.getTopRight());
		result.add(this.getBottomRight());
		result.add(this.getBottomLeft());

		return result;
	}

	moveInside(rect: Rectangle) {
		var newRect = new Rectangle(rect.x, rect.y, rect.w, rect.h);
		newRect.x = Math.max(newRect.x, this.x);
		newRect.y = Math.max(newRect.y, this.y);

		if (newRect.w < this.w) {
			newRect.x = Math.min(newRect.x + newRect.w, this.x + this.w) - newRect.w;
		}
		else {
			newRect.x = this.x;
		}

		if (newRect.h < this.h) {
			newRect.y = Math.min(newRect.y + newRect.h, this.y + this.h) - newRect.h;
		}
		else {
			newRect.y = this.y;
		}

		return newRect;
	}

	getDistance(point: Point) {
		var cx = this.x;
		var cy = this.y;
		var cw = this.w;
		var ch = this.h;

		var ox = point.getX();
		var oy = point.getY();
		var ow = 1;
		var oh = 1;

		if (point instanceof Rectangle) {
			ow = point.getWidth();
			oh = point.getHeight();
		}
		var oct = 9;

		// Determin Octant
		//
		// 0 | 1 | 2
		// __|___|__
		// 7 | 9 | 3
		// __|___|__
		// 6 | 5 | 4

		if (cx + cw <= ox) {
			if ((cy + ch) <= oy) {
				oct = 0;
			}
			else if (cy >= (oy + oh)) {
				oct = 6;
			}
			else {
				oct = 7;
			}
		}
		else if (cx >= ox + ow) {
			if (cy + ch <= oy) {
				oct = 2;
			}
			else if (cy >= oy + oh) {
				oct = 4;
			}
			else {
				oct = 3;
			}
		}
		else if (cy + ch <= oy) {
			oct = 1;
		}
		else if (cy >= oy + oh) {
			oct = 5;
		}
		else {
			return 0;
		}

		switch (oct) {
			case 0:
				cx = (cx + cw) - ox;
				cy = (cy + ch) - oy;
				return -(cx + cy);
			case 1:
				return -((cy + ch) - oy);
			case 2:
				cx = (ox + ow) - cx;
				cy = (cy + ch) - oy;
				return -(cx + cy);
			case 3:
				return -((ox + ow) - cx);
			case 4:
				cx = (ox + ow) - cx;
				cy = (oy + oh) - cy;
				return -(cx + cy);
			case 5:
				return -((oy + oh) - cy);
			case 6:
				cx = (cx + cw) - ox;
				cy = (oy + oh) - cy;
				return -(cx + cy);
			case 7:
				return -((cx + cw) - ox);
		}
	}

	determineOctant(other: Point) {
		var HISTERESE = 3;

		var ox = this.x + HISTERESE;
		var oy = this.y + HISTERESE;
		var ow = this.w - (HISTERESE * 2);
		var oh = this.h - (HISTERESE * 2);

		var cx = other.getX();
		var cy = other.getY();
		var cw = 2;
		var ch = 2;
		if (other instanceof Rectangle) {
			cw = other.getWidth();
			ch = other.getHeight();
		}

		var oct = 0;

		if (cx + cw <= ox) {
			if ((cy + ch) <= oy) {
				oct = 0;
			}
			else if (cy >= (oy + oh)) {
				oct = 6;
			}
			else {
				oct = 7;
			}
		}
		else if (cx >= ox + ow) {
			if (cy + ch <= oy) {
				oct = 2;
			}
			else if (cy >= oy + oh) {
				oct = 4;
			}
			else {
				oct = 3;
			}
		}
		else if (cy + ch <= oy) {
			oct = 1;
		}
		else if (cy >= oy + oh) {
			oct = 5;
		}
		else {
			oct = 8;
		}

		return oct;
	}

	getDirection(other: Rectangle) {
		var current = this.getTopLeft();
		switch (this.determineOctant(other)) {
			case 0:
				if ((current.getX() - other.getX()) < (current.getY() - other.getY()))
					return Direction.DIRECTION_UP;
				return Direction.DIRECTION_LEFT;
			case 1:
				return Direction.DIRECTION_UP;
			case 2:
				current = this.getTopRight();
				if ((other.getX() - current.getX()) < (current.getY() - other.getY()))
					return Direction.DIRECTION_UP;
				return Direction.DIRECTION_RIGHT;
			case 3:
				return Direction.DIRECTION_RIGHT;
			case 4:
				current = this.getBottomRight();
				if ((other.getX() - current.getX()) < (other.getY() - current.getY()))
					return Direction.DIRECTION_DOWN;
				return Direction.DIRECTION_RIGHT;
			case 5:
				return Direction.DIRECTION_DOWN;
			case 6:
				current = this.getBottomLeft();
				if ((current.getX() - other.getX()) < (other.getY() - current.getY()))
					return Direction.DIRECTION_DOWN;
				return Direction.DIRECTION_LEFT;
			case 7:
				return Direction.DIRECTION_LEFT;
			case 8:
				if (other.getY() > this.getX()) {
					return Direction.DIRECTION_DOWN;
				}
				return Direction.DIRECTION_UP;
		}
		return Direction.DIRECTION_UP;
	}

	equals(other: Rectangle) {
		return super.equals(other) && this.h === other.getHeight() && this.w === other.getWidth();
	}

	hitTest(iX: number | Point, iY?: number) {
		if (typeof iX !== 'number') {
			iY = iX.getY();
			iX = iX.getX();
		}
		var iX2 = this.x + this.getWidth();
		var iY2 = this.y + this.getHeight();
		return (iX >= this.x && iX <= iX2 && iY >= this.y && iY <= iY2);
	}

	contains(rect: Rectangle): boolean {
		return this.hitTest(rect.getTopLeft())
			&& this.hitTest(rect.getTopRight())
			&& this.hitTest(rect.getBottomLeft())
			&& this.hitTest(rect.getBottomRight());
	}

	isInside(rect: Rectangle) {
		return rect.hitTest(this.getTopLeft())
			&& rect.hitTest(this.getTopRight())
			&& rect.hitTest(this.getBottomLeft())
			&& rect.hitTest(this.getBottomRight());
	}

	intersects(rect: Rectangle) {
		let x11 = rect.x,
			y11 = rect.y,
			x12 = rect.x + rect.w,
			y12 = rect.y + rect.h,
			x21 = this.x,
			y21 = this.y,
			x22 = this.x + this.w,
			y22 = this.y + this.h;

		let x_overlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21));
		let y_overlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21));

		return x_overlap * y_overlap !== 0;
	}

	merge(rect: Rectangle) {
		var r = Math.max(rect.getRight(), this.getRight());
		var b = Math.max(rect.getBottom(), this.getBottom());

		this.setPosition(Math.min(this.x, rect.x), Math.min(this.y, rect.y));

		this.w = r - this.x;
		this.h = b - this.y;

		return this;
	}

	intersectionWithLine(start: Point, end: Point) {
		let result = new ArrayList<Point>();
		var v = this.getVertices();
		v.add(v.first());
		var p1 = v.first();
		var p2 = null;
		for (var i = 1; i < 5; i++) {
			p2 = v.get(i);
			p1 = LineShape.intersection(start, end, p1, p2);
			if (p1 !== null) {
				result.add(p1);
			}
			p1 = p2;
		}
		return result;
	}

	clone(): Rectangle {
		return new Rectangle(this.x, this.y, this.h, this.w);
	}

	toJSON() {
		return {
			width: this.w,
			height: this.h,
			x: this.x,
			y: this.y
		};
	}
}

