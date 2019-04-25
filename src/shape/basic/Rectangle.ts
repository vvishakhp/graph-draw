import { VectorFigure, extend } from '../../imports';

export class RectangleShape extends VectorFigure {

  dasharray = null;

  constructor(attr, setter, getter) {
    super(extend({
      bgColor: "#a0a0a0",
      color: "#1B1B1B"
    }, attr), setter, getter);

    this.setterWhitelist = extend(this.setterWhitelist, {
      dash: this.setDashArray,
      dasharray: this.setDashArray
    }, setter)

    this.getterWhitelist = extend(this.getterWhitelist, {
      dash: this.getDashArray,
      dasharray: this.getDashArray
    }, getter);
  }

  repaint(attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
      return
    }

    attributes = extend({}, {
      width: this.getWidth(),
      height: this.getHeight(),
      r: this.getRadius()
    }, attributes)

    if (this.dasharray !== null) {
      attributes["stroke-dasharray"] = this.dasharray
    }

    super.repaint(attributes)

    return this
  }

  applyTransformation() {
    let ts = "R" + this.rotationAngle

    if (this.getRotationAngle() === 90 || this.getRotationAngle() === 270) {
      let ratio = this.getHeight() / this.getWidth()
      ts = ts + "S" + ratio + "," + 1 / ratio + "," + (this.getAbsoluteX() + this.getWidth() / 2) + "," + (this.getAbsoluteY() + this.getHeight() / 2)
    }

    this.shape.transform(ts)

    return this
  }


  createShapeElement() {
    return this.canvas.paper.rect(this.getAbsoluteX(), this.getAbsoluteY(), this.getWidth(), this.getHeight())
  }


  setDashArray(pattern) {
    this.dasharray = pattern
    this.repaint({})
    this.fireEvent("change:dashArray", {
      value: this.dasharray
    })

    return this
  }


  getDashArray() {
    return this.dasharray
  }


  getPersistentAttributes() {
    let memento = super.getPersistentAttributes();

    if (this.dasharray !== null) {
      memento.dasharray = this.dasharray
    }

    return memento
  }

  setPersistentAttributes(memento) {
    super.setPersistentAttributes(memento)

    if (typeof memento.dasharray === "string") {
      this.dasharray = memento.dasharray
    }

    return this
  }

}