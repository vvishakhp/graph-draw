import { LineResizeHandle } from "./LineResizeHandle";
import { Type } from "../../TypeRegistry";
import { Connection } from "../../Connection";

@Type('LineEndResizeHandle')
export class LineEndResizeHandle extends LineResizeHandle {
  constructor(figure) {
    super({ owner: figure, index: figure.getVertices().getSize() - 1 }, {}, {});
  }

  getRelatedPort() {
    if (this.owner instanceof Connection) {
      return this.owner.getTarget()
    }

    return null
  }


  getOppositePort() {
    if (this.owner instanceof Connection) {
      return this.owner.getSource()
    }

    return null
  }



  onDrag(dx, dy, dx2, dy2) {
    super.onDrag(dx, dy, dx2, dy2)

    let objPos = this.owner.getEndPoint().clone()
    objPos.translate(dx2, dy2)

    if (this.command !== null) {
      this.command.updatePosition(objPos)
    }

    this.owner.setEndPoint(objPos)

    this.owner.isMoving = true

    return true
  }


  onDrop(dropTarget, x, y, shiftKey, ctrlKey) {
    this.owner.isMoving = false

    if (this.owner instanceof Connection && this.command !== null) {
      this.command.setNewPorts(this.owner.getSource(), dropTarget)
      this.getCanvas().getCommandStack().execute(this.command)
    }
    this.command = null
  }


  relocate() {

    let resizeWidthHalf = this.getWidth() / 2
    let resizeHeightHalf = this.getHeight() / 2

    let anchor = this.owner.getEndPoint()

    this.setPosition(anchor.x - resizeWidthHalf, anchor.y - resizeHeightHalf)

    return this
  }
}
