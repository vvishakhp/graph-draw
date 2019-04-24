import { Circle } from "./Circle";
import extend from "../../util/extend";
import { Color } from "../../util/Color";
import { CommandType } from "../../command/CommandType";
import { Connection } from "../../Connection";
import { Type } from "../../TypeRegistry";

@Type('LineResizeHandle')
export class LineResizeHandle extends Circle {
  zoomCallback: () => void;
  origWidth: number;
  origHeight: number;
  origStroke: number;
  owner: any;
  blockEvent: any;
  currentTarget: any;
  index: any;
  bgGradient: string;

  constructor(attr, setter, getter) {
    super(extend({
      bgColor: "#5bcaff",
      stroke: 1,
      width: 10,
      height: 10,
      minWidth: 0.3,
      minHeight: 0.3,
      selectable: false
    }, attr), setter, getter);


    this.zoomCallback = () => {
      this.attr({
        width: this.origWidth * this.getCanvas().getZoom(),
        height: this.origHeight * this.getCanvas().getZoom(),
        stroke: this.origStroke * this.getCanvas().getZoom()
      })

      if (!this.blockEvent)
        this.owner.fireEvent("move", {})
    }

    this.setterWhitelist = extend(this.setterWhitelist, {
      owner: this.setOwner,
      index: this.setIndex
    }, setter);

    this.getterWhitelist = extend(this.getterWhitelist, {
      owner: this.getOwner,
      index: this.getIndex
    }, getter);

    this.isResizeHandle = true
    this.currentTarget = null

    this.origWidth = this.width
    this.origHeight = this.height
    this.origStroke = this.stroke
  }


  getOwner() {
    return this.owner
  }

  setOwner(owner) {
    this.owner = owner
    return this
  }



  getIndex() {
    return this.index
  }

  setIndex(index) {
    this.index = index
    return this
  }


  createShapeElement() {
    let shape = super.createShapeElement();

    shape.attr({ "cursor": "move" })
    return shape
  }


  setBackgroundColor(color: Color) {
    color = color.clone();

    this.bgGradient = "r(.4,.3)" + color.hash() + "-" + color.darker(0.1).hash() + ":60-" + color.darker(0.2).hash()
    super.setBackgroundColor(color);
    this.setColor(color.darker(0.3))

    return this
  }



  getRelatedPort() {
    return null
  }



  getOppositePort() {
    return null
  }



  repaint(attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
      return
    }

    attributes = attributes || {};


    if (this.bgColor.hash() === "none") {
      attributes.fill = this.bgColor.hash()
    }
    else if (this.getAlpha() < 0.9) {
      attributes.fill = this.bgColor.hash()
    }
    else {
      attributes.fill = this.bgGradient
    }


    return super.repaint(attributes)
  }


  onDragStart(x, y, shiftKey, ctrlKey) {
    this.command = this.owner.createCommand(new CommandType(CommandType.MOVE_BASEPOINT))

    if (this.command !== null) {
      this.command.setIndex(this.index)
    }

    this.setAlpha(0.2)
    this.shape.attr({ "cursor": "crosshair" })
    this.fireEvent("dragstart", { x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey })

    return true
  }


  onDrag(dx, dy, dx2, dy2) {
    this.setPosition(this.x + dx2, this.y + dy2)

    let port = this.getOppositePort()

    let target = port !== null ? port.getCanvas().getBestFigure(this.getX(), this.getY(), [this, this.owner]) : null

    // the hovering element has been changed
    if (target !== this.currentTarget) {

      if (this.currentTarget !== null) {
        this.currentTarget.onDragLeave(port)
        this.currentTarget.setGlow(false)
        this.currentTarget.fireEvent("dragLeave", { draggingElement: port })
      }

      if (target !== null) {
        this.currentTarget = target.delegateTarget(port)
        if (this.currentTarget !== null) {
          this.currentTarget.setGlow(true)
          this.currentTarget.onDragEnter(port) // legacy
          this.currentTarget.fireEvent("dragEnter", { draggingElement: port })
        }
      }
    }

    return true
  }


  onDragEnd(x, y, shiftKey, ctrlKey) {
    if (!this.isDraggable()) {
      return false
    }

    this.shape.attr({ "cursor": "move" })

    let port = this.getOppositePort()
    if (port !== null) {
      if (this.currentTarget !== null) {

        this.onDrop(this.currentTarget, x, y, shiftKey, ctrlKey)
        this.currentTarget.onDragLeave(port)
        this.currentTarget.setGlow(false)
        this.currentTarget.fireEvent("dragLeave", { draggingElement: port })
        this.currentTarget.onCatch(this, x, y, shiftKey, ctrlKey)
        this.currentTarget = null
      }
    }

    this.owner.isMoving = false

    if (this.owner instanceof Connection) {
      if (this.command !== null) {
        this.command.cancel()
      }
    }

    else {

      if (this.command !== null) {
        this.getCanvas().getCommandStack().execute(this.command)
      }
    }
    this.command = null

    this.setAlpha(1)

    this.fireEvent("dragend", { x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey })
  }



  relocate() {

    return this
  }



  supportsSnapToHelper() {
    if (this.owner instanceof Connection) {
      return false
    }

    return true
  }


  show(canvas, x, y) {
    if (x)
      debugger

    this.setCanvas(canvas)
    try {
      this.blockEvent = true
      this.zoomCallback()
    }
    finally {
      this.blockEvent = false
    }


    this.shape.toFront()
    this.canvas.resizeHandles.add(this)
  }


  hide() {
    // don't call the parent function. The parent functions delete this object
    // and a resize handle shouldn't be deleted.
    if (this.shape === null) {
      return
    }

    this.canvas.resizeHandles.remove(this)
    this.setCanvas(null)
  }


  setCanvas(canvas) {

    if (this.canvas !== null) {
      this.canvas.off(this.zoomCallback)
    }

    super.setCanvas(canvas)

    if (this.canvas !== null) {
      this.canvas.on("zoom", this.zoomCallback)
    }
    return this;
  }


  onKeyDown(keyCode, ctrl) {
    this.canvas.onKeyDown(keyCode, ctrl)
  }
}