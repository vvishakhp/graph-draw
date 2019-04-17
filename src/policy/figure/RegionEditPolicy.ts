import { DragDropEditPolicy } from "./DragDropEditPolicy";
import { Type } from "../../TypeRegistry";
import { Rectangle } from "../../geo/Rectangle";
import { Figure } from "../../Figure";
import { Point } from "../../geo/Point";

@Type('RegionEditPolicy')
export class RegionEditPolicy extends DragDropEditPolicy {

  private constRect: Rectangle;

  constructor(x, y?, w?, h?) {
    super(null, null, null);

    if (x instanceof Rectangle) {
      this.constRect = x.clone();
    }
    else if (typeof h === "number") {
      this.constRect = new Rectangle(x, y, w, h)
    }
    else {
      throw "Invalid parameter. RegionEditPolicy need a rectangle as parameter in the constructor"
    }
  }

  private setBoundingBox(boundingBox: Rectangle) {
    this.constRect = boundingBox;
    return this;
  }

  adjustPosition(figure: Figure, x: number | Point, y: number) {
    var r = null
    if (x instanceof Point) {
      r = new Rectangle(x.getX(), x.getY(), figure.getWidth(), figure.getHeight())
    }
    else {
      r = new Rectangle(x, y, figure.getWidth(), figure.getHeight())
    }
    r = this.constRect.moveInside(r)
    return r.getTopLeft()
  }

  adjustDimension(figure: Figure, w: number, h: number) {
    var diffW = (figure.getAbsoluteX() + w) - this.constRect.getRight()
    var diffH = (figure.getAbsoluteY() + h) - this.constRect.getBottom()

    if (diffW > 0) {
      w = w - diffW
    }
    if (diffH > 0) {
      h = h - diffH
    }

    return new Rectangle(this.constRect.getX(), this.constRect.getY(), w, h);
  }
}