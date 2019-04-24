import { LineResizeHandle } from "./LineResizeHandle";
import { CommandAddVertex } from "../../command/CommandAddVertex";

export class GhostVertexResizeHandle extends LineResizeHandle {
  maxOpacity: number;
  precursorIndex: any;
  constructor(owner, precursorIndex) {
    super({ owner: owner, opacity: 0.35 }, {}, {});

    this.maxOpacity = 0.35
    this.precursorIndex = precursorIndex
  }


  createShapeElement() {
    let shape = super.createShapeElement()
    shape.attr({ "cursor": "pointer" })
    return shape
  }

  setAlpha(percent) {
    super.setAlpha(Math.min(this.maxOpacity, Math.max(0, parseFloat(percent))))

    return this
  }

  onClick() {
    let cmd = new CommandAddVertex(this.owner, this.precursorIndex + 1, this.getAbsoluteX() + this.getWidth() / 2, this.getAbsoluteY() + this.getHeight() / 2)
    this.getCanvas().getCommandStack().execute(cmd)
  }


  onDragStart(x, y, shiftKey, ctrlKey) {
    return true
  }


  onDrag(dx, dy, dx2, dy2) {
    return true
  }

  onDragEnd(x, y, shiftKey, ctrlKey) {

    this.fireEvent("dragend", { x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey })

    return true
  }



  relocate() {
    let p1 = this.owner.getVertices().get(this.precursorIndex)
    let p2 = this.owner.getVertices().get(this.precursorIndex + 1)

    this.setPosition(
      ((p2.x - p1.x) / 2 + p1.x - this.getWidth() / 2),
      ((p2.y - p1.y) / 2 + p1.y - this.getHeight() / 2)
    )
    return this;
  }


}
