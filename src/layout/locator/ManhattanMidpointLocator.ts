import { Type, ConnectionLocator, Figure } from '../../imports';

@Type('ManhattanMidpointLocator')
export class ManhattanMidpointLocator extends ConnectionLocator {
  relocate(index: number, target: Figure) {
    let conn = target.getParent()
    let points = conn.getVertices()

    let segmentIndex = Math.floor((points.getSize() - 2) / 2)
    if (points.getSize() <= segmentIndex + 1)
      return

    let p1 = points.get(segmentIndex)
    let p2 = points.get(segmentIndex + 1)

    target.setPosition(
      ((p2.x - p1.x) / 2 + p1.x - target.getWidth() / 2) | 0,
      ((p2.y - p1.y) / 2 + p1.y - target.getHeight() / 2) | 0)
  }
}
