import { ConnectionAnchor } from "./ConnectionAnchor";
import { Type } from "../../TypeRegistry";
import { Rectangle } from "../../geo/Rectangle";
import { Point } from "../../geo/Point";
import { Oval } from "../../shape/basic/Oval";

@Type('ShortesPathConnectionAnchor')
export class ShortesPathConnectionAnchor extends ConnectionAnchor {

  getLocation(ref, inquiringConnection) {
    let r = this.getOwner().getParent().getBoundingBox()
    let center = r.getCenter()

    // check if we can calculate with a circle/line intersection
    //
    if (this.getOwner().getParent() instanceof Oval) {
      let result = this.getOwner().getParent().intersectionWithLine(ref, center)
      if (result.getSize() === 1) {
        return result.get(0)
      }
    }

    let octant = r.determineOctant(new Rectangle(ref.x, ref.y, 2, 2))

    switch (octant) {
      case 0:
        return r.getTopLeft()
      case 1:
        return new Point(ref.x, r.getTop())
      case 2:
        return r.getTopRight()
      case 3:
        return new Point(r.getRight(), ref.y)
      case 4:
        return r.getBottomRight()
      case 5:
        return new Point(ref.x, r.getBottom())
      case 6:
        return r.getBottomLeft()
      case 7:
        return new Point(r.getLeft(), ref.y)
    }

    return r.getTopLeft()
  }


  getBox() {
    return this.getOwner().getParent().getBoundingBox()
  }


  getReferencePoint(inquiringConnection) {
    return this.getBox().getCenter()
  }
}
