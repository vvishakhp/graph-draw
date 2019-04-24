import { LineResizeHandle } from "./LineResizeHandle";
import { Connection } from "../../Connection";

export class LineStartResizeHandle extends LineResizeHandle {
  constructor(figure) {
    super({ owner: figure, index: 0 }, {}, {});

  }


  getRelatedPort() {
    if (this.owner instanceof Connection)
      return this.owner.getSource()

    return null
  }


  getOppositePort() {
    if (this.owner instanceof Connection)
      return this.owner.getTarget()

    return null
  }


  onDrag(dx, dy, dx2, dy2) {
    super.onDrag(dx, dy, dx2, dy2)

    let objPos = this.owner.getStartPoint()
    objPos.translate(dx2, dy2)

    if (this.command !== null) {
      this.command.updatePosition(objPos)

    }
    this.owner.setStartPoint(objPos)

    this.owner.isMoving = true

    return true
  }


  onDrop(dropTarget, x, y, shiftKey, ctrlKey) {
    this.owner.isMoving = false

    // The ResizeHandle of a Connection has been dropped on a Port
    // This will enforce a ReconnectCommand
    if (this.owner instanceof Connection && this.command !== null) {
      this.command.setNewPorts(dropTarget, this.owner.getTarget())
      this.getCanvas().getCommandStack().execute(this.command)
    }
    this.command = null
  }


  relocate() {
    let resizeWidthHalf = this.getWidth() / 2
    let resizeHeightHalf = this.getHeight() / 2

    let anchor = this.owner.getStartPoint()

    this.setPosition(anchor.x - resizeWidthHalf, anchor.y - resizeHeightHalf)

    return this
  }
}