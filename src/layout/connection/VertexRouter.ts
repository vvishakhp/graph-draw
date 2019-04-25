import { Type, ConnectionRouter, VertexSelectionFeedbackPolicy, ArrayList } from '../../imports';


@Type('VertexRouter')
export class VertexRouter extends ConnectionRouter {
  onInstall(connection) {
    connection.installEditPolicy(new VertexSelectionFeedbackPolicy())
  }


  invalidate() {
  }


  route(connection, routingHints) {

    let count = routingHints.oldVertices.getSize()
    for (let i = 0; i < count; i++) {
      connection.addPoint(routingHints.oldVertices.get(i))
    }

    let ps = connection.getVertices()

    let startAnchor = connection.getStartPosition(ps.get(1))
    let endAnchor = connection.getEndPosition(ps.get(ps.getSize() - 2))
    ps.first().setPosition(startAnchor)
    ps.last().setPosition(endAnchor)

    this._paint(connection)
  }

  canRemoveVertexAt(conn, index?) {
    return false
  }


  canRemoveSegmentAt(conn, index?) {

    let segmentCount = conn.getVertices().getSize() - 1

    if ((index <= 0) || (index >= segmentCount)) {
      return false
    }

    return (segmentCount >= 2)
  }



  getPersistentAttributes(line, memento) {
    memento.vertex = []

    line.getVertices().each((i, e) => {
      memento.vertex.push({ x: e.x, y: e.y })
    })

    return memento
  }


  setPersistentAttributes(line, memento) {

    if (Array.isArray(memento.vertex) && memento.vertex.length > 1) {

      line.oldPoint = null
      line.lineSegments = new ArrayList()

      line.setVertices(memento.vertex)
    }
  }


  onDrag(line, dx, dy, dx2, dy2) {
    let count = line.getVertices().getSize() - 1
    for (let i = 1; i < count; i++) {
      line.getVertex(i).translate(dx2, dy2)
    }
  }

}