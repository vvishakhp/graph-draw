import { Type } from "../../TypeRegistry";
import Util from "../../geo/Util";

@Type('ConnectionRouter')
export class ConnectionRouter {
  route(connection, routingHints) {
    throw "subclasses must implement the method [ConnectionRouter.route]"
  }

  _paint(conn) {

    let adjust = val => val

    let ps = conn.getVertices()
    let p = ps.get(0)
    let radius = conn.getRadius()
    let path = ["M", adjust(p.x), " ", adjust(p.y)]
    let i = 1
    let length, inset, p2
    if (radius > 0) {
      let lastP = p
      length = (ps.getSize() - 1)
      for (; i < length; i++) {
        p = ps.get(i)
        inset = Util.insetPoint(p, lastP, radius)
        path.push("L", adjust(inset.x), ",", adjust(inset.y))

        p2 = ps.get(i + 1)
        inset = Util.insetPoint(p, p2, radius)

        path.push("Q", p.x, ",", p.y, " ", adjust(inset.x), ", ", adjust(inset.y))
        lastP = p
      }
      p = ps.get(i)
      path.push("L", adjust(p.x), ",", adjust(p.y))
    } else {
      length = ps.getSize()
      for (; i < length; i++) {
        p = ps.get(i)
        path.push("L", adjust(p.x), ",", adjust(p.y))
      }
    }
    conn.svgPathString = path.join("")
  }

  onInstall(connection) { }


  onUninstall(connection) { }

  canRemoveVertexAt(index) {
    return false
  }

  canRemoveSegmentAt(index) {
    return false
  }

  getPersistentAttributes(line, memento) {
    return memento
  }

  setPersistentAttributes(line, memento) { }
  onDrag(line, dx, dy, dx2, dy2) { }
  verticesSet(line) { }
}