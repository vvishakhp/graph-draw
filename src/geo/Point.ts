import { PositionConstant } from "./PositionConstants";
import { Rectangle } from "./Rectangle";

export class Point {

  protected x = 0;
  protected y = 0;
  bx: number;
  by: number;
  bw: number;
  bh: number;

  constructor(x: Point | number = 0, y: number = 0) {
    if (x instanceof Point) {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }

    this.bx = null
    this.by = null
    this.bw = null
    this.bh = null
  }


  setBoundary(bx: number | Rectangle, by: number, bw: number, bh: number): Point {
    if (bx instanceof Rectangle) {
      this.bx = bx.x
      this.by = bx.y
      this.bw = bx.w
      this.bh = bx.h
    } else {
      this.bx = bx
      this.by = by
      this.bw = bw
      this.bh = bh
    }
    this.adjustBoundary()
    return this;
  }

  adjustBoundary() : Point{
    if (this.bx === null) {
      return
    }
    this.x = Math.min(Math.max(this.bx, this.x), this.bw);
    this.y = Math.min(Math.max(this.by, this.y), this.bh);

    return this;
  }

  translate(dx: number, dy: number): Point {
    this.x += dx;
    this.y += dy;
    this.adjustBoundary();

    return this;
  }

  getX(): number {
    return this.x;
  }

  getY() {
    return this.y;
  }

  setX(x: number) {
    this.x = x;
    this.adjustBoundary();

    return this;
  }

  setY(y: number) {
    this.y = y;
    this.adjustBoundary();

    return this;
  }

  setPosition(x: number | { x: number, y: number }, y: number = 0) {
    if (typeof x === 'number') {
      this.x = x;
      this.y = y;
    } else {
      this.x = x.x;
      this.y = x.y;
    }

    this.adjustBoundary();
    return this;
  }

  getPosition(p: Point): PositionConstant {
    let dx = p.x - this.x;
    let dy = p.y - this.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0)
        return PositionConstant.WEST
      return PositionConstant.EAST
    }
    if (dy < 0)
      return PositionConstant.NORTH
    return PositionConstant.SOUTH
  }

  equals(other: Point) {
    return other.x === this.x && other.y === this.y;
  }

  distence(other: Point) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt((dx * dx) + (dy * dy));
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  translated(x, y) {
    const other = new Point(x, y);
    return new Point(this.x + other.x, this.y + other.y);
  }

  scale(factor: number) {
    this.x *= factor;
    this.y *= factor;
    this.adjustBoundary();
    return this;
  }

  scaled(factor: number) {
    return new Point(this.x * factor, this.y * factor);
  }

  getPersistentAttributes() {
    return {
      x: this.x,
      y: this.y
    }
  }

  setPersistentAttributes(memento: any) {
    this.x = memento.x;
    this.y = memento.y;
  }

  clone() {
    return new Point(this.x, this.y);
  }

  subtract(that: Point) {
    return new Point(this.x - that.x, this.y - that.y);
  }

  dot(that: Point) {
    return this.x * that.x + this.y * that.y;
  }

  cross(that: Point) {
    return this.x * that.y - this.y * that.x;
  }

  lerp(that, t) {
    return new Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
  }
}
