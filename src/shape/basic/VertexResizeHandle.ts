import { ResizeHandle } from "../../ResizeHandle";
import { Type } from "../../TypeRegistry";
import { Color } from "../../util/Color";
import { CommandRemoveVertex } from "../../command/CommandRemoveVertex";
import { CommandType } from "../../command/CommandType";
import { CommandCollection } from "../../command/CommandCollection";

@Type('VertexResizeHandle')
export class VertexResizeHandle extends ResizeHandle {
  public static SNAP_THRESHOLD = 3;
  public static LINE_COLOR = new Color(19, 135, 230);
  public static FADEOUT_DURATION = 300;
  index: any;
  isDead: boolean;
  vertex: any;

  constructor(owner, index) {
    super({ owner }, {}, {});
    this.index = index
    this.isDead = false
  }

  onDoubleClick() {
    let cmd = new CommandRemoveVertex(this.owner, this.index)
    this.getCanvas().getCommandStack().execute(cmd)

    this.isDead = true
  }



  onDragStart(x, y, shiftKey, ctrlKey) {
    if (this.isDead === true) {
      return
    }

    super.onDragStart(x, y, shiftKey, ctrlKey)
    this.command = this.getCanvas().getPrimarySelection().createCommand(new CommandType(CommandType.MOVE_VERTEX))
    if (this.command != null) {
      this.command.setIndex(this.index)
      this.setAlpha(0.2)
      this.shape.attr({ "cursor": "crosshair" })
    }

    this.vertex = this.owner.getVertex(this.index).clone()

    this.fireEvent("dragstart", { x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey })

    return true
  }


  onDrag(dx, dy, dx2, dy2) {
    if (this.isDead === true || this.command == null) {
      return
    }

    this.setPosition(this.x + dx2, this.y + dy2)

    this.vertex.translate(dx2, dy2)
    let newPos = this.vertex.clone()

    if (this.getCanSnapToHelper()) {
      newPos = this.getCanvas().snapToHelper(this, newPos)
    }

    this.owner.setVertex(this.index, newPos.x, newPos.y)

    this.command.updatePosition(this.vertex.x, this.vertex.y)
  }


  onDragEnd(x, y, shiftKey, ctrlKey) {
    if (this.isDead === true || this.command === null) {
      return
    }

    this.shape.attr({ "cursor": "move" })

    let stack = this.getCanvas().getCommandStack()

    let transactionCommand = new CommandCollection()

    try {
      transactionCommand.add(this.command)
      this.command = null
      if (this.getEnclosingAngle() > 178) {
        transactionCommand.add(new CommandRemoveVertex(this.owner, this.index))
      }
    }
    finally {
      stack.execute(transactionCommand)
    }

    this.setAlpha(1)

    this.fireEvent("dragend", { x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey })
  }



  relocate() {
    let resizeWidthHalf = this.getWidth() / 2
    let resizeHeightHalf = this.getHeight() / 2

    let anchor = this.owner.getVertex(this.index)

    this.setPosition(anchor.x - resizeWidthHalf, anchor.y - resizeHeightHalf)
  }


  getEnclosingAngle() {
    let points = this.owner.getVertices()
    let trans = this.vertex.getScaled(-1)
    let size = points.getSize()
    let left = points.get((this.index - 1 + size) % size).translated(trans) // % is just to ensure the [0, size] interval
    let right = points.get((this.index + 1) % size).translated(trans)       // % is just to ensure the [0, size] interval

    let dot = left.dot(right)

    let acos = Math.acos(dot / (left.length() * right.length()))
    return acos * 180 / Math.PI
  }
}