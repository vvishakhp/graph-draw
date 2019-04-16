import { ManhattanMidpointLocator } from "./ManhattanMidpointLocator";
import { Type } from "../../TypeRegistry";

@Type('PolylineMidpointLocator')
export class PolylineMidpointLocator extends ManhattanMidpointLocator {
  relocate(index, target) {
    super.relocate(index, target);
    var conn = target.getParent()
    var points = conn.getVertices()

    if (points.getSize() % 2 === 0) {
      super.relocate(index, target);
    }
    else {
      const _index = Math.floor(points.getSize() / 2)
      var p1 = points.get(_index)
      target.setPosition(p1.x - (target.getWidth() / 2), p1.y - (target.getHeight() / 2))
    }
  }
}
