import { Type, Oval, extend } from '../../imports';


@Type('Circle')
export class Circle extends Oval {
  constructor(attr, setter, getter) {
    super(attr, setter, getter);

    this.setterWhitelist = extend(this.setterWhitelist, {
      diameter: this.setDiameter,
      radius: this.setRadius
    }, setter);

    this.getterWhitelist = extend(this.getterWhitelist, {
      diameter: this.getDiameter,
      radius: this.getRadius
    }, getter);

    this.setKeepAspectRatio(true)
  }


  setDiameter(d) {
    let center = this.getCenter()
    this.setDimension(d, d)
    this.setCenter(center.getX(), center.getY())
    this.fireEvent("change:diameter", { value: d })

    return this
  }


  getDiameter() {
    return this.getWidth()
  }

  setRadius(r) {
    this.setDiameter(r * 2)
    this.fireEvent("change:radius", { value: r })

    return this
  }


  getPersistentAttributes() {
    let memento = super.getPersistentAttributes();
    delete memento.radius;
    return memento
  }

}
