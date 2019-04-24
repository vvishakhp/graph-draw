import { Rectangle } from "./shape/basic/Rectangle";
import extend from "./util/extend";
import { CommandType } from "./command/CommandType";
import { Point } from "./geo/Point";
import { Color } from "./util/Color";

export class ResizeHandle extends Rectangle {
  zoomCallback: () => void;
  origWidth: number;
  origHeight: number;
  origRadius: number;
  origStroke: number;
  blockEvent: any;
  owner: any;
  commandMove: any;
  commandResize: any;
  useGradient: boolean;
  type: any;
  bgGradient: string;
  constructor(attr, setter, getter) {
    super(extend({
      bgColor: "#FDFDFD",
      stroke: 0.5,
      width: 10,
      height: 10,
      minWidth: 0.3,
      minHeight: 0.3,
      color: "#a0a0a0",
      radius: 1,
      selectable: false
    }, attr), setter, getter);

    this.setterWhitelist = extend(this.setterWhitelist, {
      owner: this.setOwner,
      type: this.setType
    }, setter),

      this.getterWhitelist = extend(this.getterWhitelist, {
        owner: this.getOwner,
        type: this.getType
      }, getter);

    this.zoomCallback = () => {
      this.attr({
        width: this.origWidth * this.getCanvas().getZoom(),
        height: this.origHeight * this.getCanvas().getZoom(),
        radius: this.origRadius * this.getCanvas().getZoom(),
        stroke: this.origStroke * this.getCanvas().getZoom()
      })

      // size of the ResizeHandle has changed. Force a reposition of handle
      //
      if (!this.blockEvent)
        this.owner.fireEvent("move", {})
    }



    // required in the SelectionEditPolicy to indicate the type of figure
    // which the user clicks
    this.isResizeHandle = true

    this.command = null
    this.commandMove = null
    this.commandResize = null
    this.useGradient = true


    this.origRadius = this.radius
    this.origWidth = this.width
    this.origHeight = this.height
    this.origStroke = this.stroke
  }


  getSnapToDirection() {
    switch (this.type) {
      case 1:
        return SnapToHelper.NORTH_WEST
      case 2:
        return SnapToHelper.NORTH
      case 3:
        return SnapToHelper.NORTH_EAST
      case 4:
        return SnapToHelper.EAST
      case 5:
        return SnapToHelper.SOUTH_EAST
      case 6:
        return SnapToHelper.SOUTH
      case 7:
        return SnapToHelper.SOUTH_WEST
      case 8:
        return SnapToHelper.WEST
      case 9:
        return SnapToHelper.NSEW
      default:
        return SnapToHelper.EAST
    }
  }


  createShapeElement() {
    this.shape = super.createShapeElement();

    this.shape.node.setAttribute("type", this.type)
    this.updateCursor(this.shape)

    return this.shape
  }


  getOwner() {
    return this.owner;
  }

  setOwner(owner) {
    this.owner = owner

    return this
  }



  getType() {
    return this.type;
  }

  setType(type) {
    this.type = type

    return this
  }


  updateCursor(shape) {
    if (shape === null) {
      return this
    }

    if (this.isDraggable() === false) {
      shape.attr({ "cursor": "default" })
      return this
    }

    switch (this.type) {
      case 1:
        shape.attr({ "cursor": "nw-resize" })
        break
      case 2:
        shape.attr({ "cursor": "n-resize" })
        break
      case 3:
        shape.attr({ "cursor": "ne-resize" })
        break
      case 4:
        shape.attr({ "cursor": "e-resize" })
        break
      case 5:
        shape.attr({ "cursor": "se-resize" })
        break
      case 6:
        shape.attr({ "cursor": "s-resize" })
        break
      case 7:
        shape.attr({ "cursor": "sw-resize" })
        break
      case 8:
        shape.attr({ "cursor": "w-resize" })
        break
      default:
        shape.attr({ "cursor": "move" })
        break
    }
    return this
  }


  setDraggable(flag) {
    super.setDraggable(flag)
    this.updateCursor(this.shape)

    return this
  }

  onDragStart(x, y, shiftKey, ctrlKey) {

    if (!this.isDraggable()) {
      return false
    }

    this.ox = this.getAbsoluteX()
    this.oy = this.getAbsoluteY()

    this.commandMove = this.owner.createCommand(new CommandType(CommandType.MOVE))
    this.commandResize = this.owner.createCommand(new CommandType(CommandType.RESIZE))

    return true
  }



  onDrag(dx, dy, dx2, dy2) {
    if (this.isDraggable() === false) {
      return
    }

    let oldX = this.getAbsoluteX()
    let oldY = this.getAbsoluteY()

    super.onDrag(dx, dy, dx2, dy2)

    let diffX = this.getAbsoluteX() - oldX
    let diffY = this.getAbsoluteY() - oldY

    let obj = this.owner
    let objPosX = obj.getAbsoluteX()
    let objPosY = obj.getAbsoluteY()
    let objWidth = obj.getWidth()
    let objHeight = obj.getHeight()

    let newX = null
    let newY = null
    let corrPos = null
    switch (this.type) {
      case 1:
        obj.setDimension(objWidth - diffX, objHeight - diffY)
        newX = objPosX + (objWidth - obj.getWidth())
        newY = objPosY + (objHeight - obj.getHeight())
        obj.setPosition(newX, newY)
        break
      case 2:
        obj.setDimension(objWidth, objHeight - diffY)
        newX = objPosX
        newY = objPosY + (objHeight - obj.getHeight())
        obj.setPosition(newX, newY)
        break
      case 3:
        obj.setDimension(objWidth + diffX, objHeight - diffY)
        newX = objPosX
        newY = objPosY + (objHeight - obj.getHeight())
        obj.setPosition(newX, newY)
        break
      case 4:
        obj.setDimension(objWidth + diffX, objHeight)
        break
      case 5:
        obj.setDimension(objWidth + diffX, objHeight + diffY)
        break
      case 6:
        obj.setDimension(objWidth, objHeight + diffY)
        break
      case 7:
        obj.setDimension(objWidth - diffX, objHeight + diffY)
        newX = objPosX + (objWidth - obj.getWidth())
        newY = objPosY
        obj.setPosition(newX, newY)
        break
      case 8:
        obj.setDimension(objWidth - diffX, objHeight)
        newX = objPosX + (objWidth - obj.getWidth())
        newY = objPosY
        obj.setPosition(newX, newY)
        break
    }

    if (newX !== null) {

      corrPos = obj.getPosition()
      if (corrPos.x !== newX || corrPos.y !== newY) {
        obj.setDimension(obj.getWidth() - (corrPos.x - newX), obj.getHeight() - (corrPos.y - newY))
      }
    }
  }


  onDragEnd(x, y, shiftKey, ctrlKey) {
    if (!this.isDraggable()) {
      return
    }


    if (this.commandMove !== null) {
      this.commandMove.setPosition(this.owner.getX(), this.owner.getY())
      this.canvas.getCommandStack().execute(this.commandMove)
      this.commandMove = null
    }

    if (this.commandResize !== null) {
      this.commandResize.setDimension(this.owner.getWidth(), this.owner.getHeight())
      this.canvas.getCommandStack().execute(this.commandResize)
      this.commandResize = null
    }
  }


  setPosition(x: Point | number, y?: number) {
    if (x instanceof Point) {
      this.x = x.getX()
      this.y = x.getY();
    }
    else {
      this.x = x
      this.y = y
    }

    if (this.repaintBlocked === true || this.shape === null) {
      return this
    }


    this.shape.attr({ x: this.x, y: this.y })

    this.applyTransformation()
  }


  setDimension(width, height) {

    if (typeof height !== "undefined") {
      super.setDimension(width, height)
    }
    else {
      super.setDimension(10, 10)
    }


    let offset = this.getWidth()
    let offset2 = offset / 2

    switch (this.type) {
      case 1:
        this.setSnapToGridAnchor(new Point(offset, offset))
        break
      case 2:
        this.setSnapToGridAnchor(new Point(offset2, offset))
        break
      case 3:
        this.setSnapToGridAnchor(new Point(0, offset))
        break
      case 4:
        this.setSnapToGridAnchor(new Point(0, offset2))
        break
      case 5:
        this.setSnapToGridAnchor(new Point(0, 0))
        break
      case 6:
        this.setSnapToGridAnchor(new Point(offset2, 0))
        break
      case 7:
        this.setSnapToGridAnchor(new Point(offset, 0))
        break
      case 8:
        this.setSnapToGridAnchor(new Point(offset, offset2))
        break
      case 9:
        this.setSnapToGridAnchor(new Point(offset2, offset2))
        break
    }

    return this
  }


  show(canvas) {
    this.setCanvas(canvas)

    this.canvas.resizeHandles.add(this)
    this.shape.insertAfter(this.owner.getShapeElement())

    try {
      this.blockEvent = true
      this.zoomCallback()
    }
    finally {
      this.blockEvent = false
    }
    this.repaint({})

    return this
  }


  hide() {
    if (this.shape === null) {
      return
    }

    this.canvas.resizeHandles.remove(this)
    this.setCanvas(null)

    return this
  }

  setCanvas(canvas) {

    if (this.canvas !== null) {
      this.canvas.off(this.zoomCallback);
    }

    super.setCanvas(canvas);

    if (this.canvas !== null) {
      this.canvas.on("zoom", this.zoomCallback);
    }

    return this;
  }


  setBackgroundColor(color: Color) {
    color = color.clone();

    this.bgGradient = "90-" + color.darker(0.2).hash() + "-" + color.hash()
    super.setBackgroundColor(color);

    return this
  }

  repaint(attributes) {

    if (this.repaintBlocked === true || this.shape === null) {
      return
    }

    attributes = attributes || {}

    if (this.bgColor.hash() === "none") {
      attributes.fill = "none"
    }
    else if (this.getAlpha() < 0.9 || this.useGradient === false) {
      attributes.fill = this.bgColor.hash()
    }
    else {
      attributes.fill = this.bgGradient
    }


    return super.repaint(attributes)
  }

  supportsSnapToHelper() {
    return true
  }


  onKeyDown(keyCode, ctrl) {
    this.canvas.onKeyDown(keyCode, ctrl)
  }


  fireEvent(event, args) {

  }
}