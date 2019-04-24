import { Type } from "../../TypeRegistry";
import extend from "../../util/extend";
import { VectorFigure } from "../../VectorFigure";
import { Point } from "../../geo/Point";
import ArrayList from "../../util/ArrayList";

@Type('Oval')
export class Oval extends VectorFigure {
  constructor(attr, setter, getter) {
    super(extend({
      bgColor: "#C02B1D",
      color: "#1B1B1B"
    }, attr), setter, getter);

    this.setterWhitelist['center'] = this.setCenter;
  }

  createShapeElement() {
    let halfW = this.getWidth() / 2
    let halfH = this.getHeight() / 2

    return this.canvas.paper.ellipse(this.getAbsoluteX() + halfW, this.getAbsoluteY() + halfH, halfW, halfH)
  }



  getCenter() {
    let w2 = this.getWidth() / 2
    let h2 = this.getHeight() / 2

    return this.getPosition().translate(w2, h2)
  }


  setCenter(x, y) {
    let pos = new Point(x, y)
    let w2 = this.getWidth() / 2
    let h2 = this.getHeight() / 2

    pos.translate(-w2, -h2)
    this.setPosition(pos)

    this.fireEvent("change:center", { value: { x: x, y: y } })

    return this
  }



  repaint(attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
      return
    }

    attributes = attributes || {}


    // don't override cx/cy if inherited class has set the center already.
    if (typeof attributes.rx === "undefined") {
      attributes.rx = this.width / 2
      attributes.ry = this.height / 2
    }

    // don't override cx/cy if inherited class has set the center already.
    if (typeof attributes.cx === "undefined") {
      attributes.cx = this.getAbsoluteX() + attributes.rx
      attributes.cy = this.getAbsoluteY() + attributes.ry
    }

    return super.repaint(attributes)
  }


  intersectionWithLine(a1, a2) {
    let rx = this.getWidth() / 2
    let ry = this.getHeight() / 2

    let result = new ArrayList()

    let origin = new Point(a1.x, a1.y)
    let dir = a2.subtract(a1)
    let center = new Point(this.getAbsoluteX() + rx, this.getAbsoluteY() + ry)
    let diff = origin.subtract(center)
    let mDir = new Point(dir.x / (rx * rx), dir.y / (ry * ry))
    let mDiff = new Point(diff.getX() / (rx * rx), diff.getY() / (ry * ry))

    let a = dir.dot(mDir)
    let b = dir.dot(mDiff)
    let c = diff.dot(mDiff) - 1.0
    let d = b * b - a * c

    if (d < 0) {
      // "Outside"
    } else if (d > 0) {
      let root = Math.sqrt(d)
      let t_a = (-b - root) / a
      let t_b = (-b + root) / a

      if ((t_a < 0 || 1 < t_a) && (t_b < 0 || 1 < t_b)) {
        if ((t_a < 0 && t_b < 0) || (t_a > 1 && t_b > 1)) {
          //"Outside";
        }
        else {
          //"Inside";
        }
      } else {
        if (0 <= t_a && t_a <= 1)
          result.add(a1.lerp(a2, t_a))
        if (0 <= t_b && t_b <= 1)
          result.add(a1.lerp(a2, t_b))
      }
    } else {
      let t = -b / a
      if (0 <= t && t <= 1) {
        result.add(a1.lerp(a2, t))
      } else {
        //"Outside";
      }
    }

    return result
  }
}