import { Type } from '../../TypeRegistry';
import extend from '../../util/extend';
import { Color } from '../../util/Color';
import { Point } from '../../geo/Point';
import ArrayList from '../../util/ArrayList';
import { DragDropEditPolicy } from '../../policy/figure/DragDropEditPolicy';
import jsonUtil from '../../util/JSONUtil';
import { Rectangle } from '../../geo/Rectangle';
import { SelectionFeedbackPolicy } from '../../policy/figure/SelectionFeedbackPolicy';
import { CommandType } from '../../command/CommandType';
import { CommandDelete } from '../../command/CommandDelete';
import { Figure, AttributeCollection } from '../../Figure';

@Type('Line')
export class Line extends Figure {


  corona: number;
  isGlowing: boolean;
  lineColor: any;
  stroke: number;
  outlineStroke: number;
  outlineColor: any;
  outlineVisible: boolean;
  DEFAULT_COLOR: any;
  draggedSegment: any;
  dasharray: any;
  start: Point;
  end: Point;
  vertices: ArrayList<Point>;
  static line: any;
  svgPathString: string;
  _lineColor: any;
  _stroke: number;
  routingRequired: boolean;


  constructor(attr, setter, getter) {

    super(extend({
      deleteable: false,
      selectable: true
    }, attr), {}, {});

    this.setterWhitelist = extend({}, {
      start: this.setStartPosition,
      startX: this.setStartX,
      startY: this.setStartY,
      end: this.setEndPosition,
      endX: this.setEndX,
      endY: this.setEndY,
      vertices: this.setVertices,
      outlineColor: this.setOutlineColor,
      outlineStroke: this.setOutlineStroke,
      color: this.setColor,
      stroke: this.setStroke,
      dasharray: this.setDashArray,
      glow: this.setGlow
    }, setter);
    this.getterWhitelist = extend({}, {
      start: this.getStartPosition,
      end: this.getEndPosition,
      outlineColor: this.getOutlineColor,
      outlineStroke: this.getOutlineStroke,
      stroke: this.getStroke,
      color: this.getColor,
      dasharray: this.getDashArray,
      vertices: this.getVertices
    }, getter);

    this.corona = 10
    this.isGlowing = false
    this.lineColor = this.DEFAULT_COLOR
    this.stroke = 1
    this.outlineStroke = 0
    this.outlineColor = new Color(null)
    this.outlineVisible = false

    this.draggedSegment = null

    this.dasharray = null

    this.start = new Point(30, 30)
    this.end = new Point(100, 100)

    this.vertices = new ArrayList<Point>()
    this.vertices.add(this.start.clone())
    this.vertices.add(this.end.clone())

    if (this.editPolicy.getSize() === 0) {
      this.installEditPolicy(new LineSelectionFeedbackPolicy())
    }
  }


  setOutlineColor(color: Color) {
    this.outlineColor = color.clone();
    this.repaint({});
    this.fireEvent("change:outlineColor", {
      value: this.outlineColor
    });

    return this;
  }

  getOutlineColor() {
    return this.outlineColor;
  }


  setOutlineStroke(w: number) {
    this.outlineStroke = w
    this.repaint({})
    this.fireEvent("change:outlineStroke", {
      value: this.outlineStroke
    })

    return this
  }

  getOutlineStroke() {
    return this.outlineStroke
  }

  onDragStart(x: number, y: number, shiftKey?: boolean, ctrlKey?: boolean, isFaked?: boolean) {
    let result = super.onDragStart(x, y, shiftKey, ctrlKey)

    if (result === true && isFaked !== true) {
      this.draggedSegment = {
        index: 0,
        start: this.start,
        end: this.end
      }
    }
    return result
  }

  onDrag(dx: number, dy: number, dx2: number, dy2: number) {
    if (this.command === null) {
      return
    }

    this.vertices.each(function (i, e) {
      e.translate(dx2, dy2)
    })
    this.command.updateVertices(this.vertices.clone())

    // start/end are seperate draw23d.geo.Point objects. Required for routing and determining if a node is dragged away
    // from the connection. In this case we must modify the start/end by hand
    this.start.translate(dx2, dy2)
    this.end.translate(dx2, dy2)


    this.svgPathString = null
    super.onDrag(dx, dy, dx2, dy2)
  }

  onDragEnd(x: number, y: number, shiftKey?: boolean, ctrlKey?: boolean) {

    this.isInDragDrop = false
    this.draggedSegment = null

    if (this.command === null) {
      return
    }

    let _this = this

    this.canvas.getCommandStack().execute(this.command)
    this.command = null
    this.isMoving = false

    this.editPolicy.each(function (i, e) {
      if (e instanceof DragDropEditPolicy) {
        e.onDragEnd(_this.canvas, _this, x, y, shiftKey, ctrlKey)
      }
    })


    this.fireEvent("move", {
      figure: this,
      dx: 0,
      dy: 0
    })

    this.fireEvent("dragend", {
      x: x,
      y: y,
      shiftKey: shiftKey,
      ctrlKey: ctrlKey
    })

  }

  onClick() {

  }

  setDashArray(dashPattern) {
    this.dasharray = dashPattern
    this.repaint({})

    this.fireEvent("change:dashArray", {
      value: this.dasharray
    })

    return this
  }

  getDashArray() {
    return this.dasharray
  }


  setCoronaWidth(width: number) {
    this.corona = width;
    return this;
  }

  createShapeElement() {
    let set = this.canvas.paper.set()

    // the drop shadow or border line
    set.push(this.canvas.paper.path("M" + this.start.getX() + " " + this.start.getY() + "L" + this.end.getX() + " " + this.end.getY()))
    // the main path
    set.push(this.canvas.paper.path("M" + this.start.getX() + " " + this.start.getY() + "L" + this.end.getX() + " " + this.end.getY()))
    set.node = set.items[1].node

    this.outlineVisible = true

    return set
  }

  repaint(attributes: AttributeCollection) {
    if (this.repaintBlocked === true || this.shape === null) {
      return
    }

    // don't override existing values
    //
    if (typeof attributes === "undefined") {
      attributes = {
        "stroke": this.lineColor.hash(),
        "stroke-width": this.stroke,
        "path": ["M", this.start.getX(), this.start.getY(), "L", this.end.getX(), this.end.getY()].join(" ")
      }
    } else {
      // may a router has calculate another path. don't override them.
      if (typeof attributes.path === "undefined") {
        attributes.path = ["M", this.start.getX(), this.start.getY(), "L", this.end.getX(), this.end.getY()].join(" ")
      }
      jsonUtil.ensureDefault(attributes, "stroke", this.lineColor.hash())
      jsonUtil.ensureDefault(attributes, "stroke-width", this.stroke)
    }

    jsonUtil.ensureDefault(attributes, "stroke-dasharray", this.dasharray)
    super.repaint(attributes)

    if (this.outlineStroke > 0) {
      this.shape.items[0].attr({
        "stroke-width": (this.outlineStroke + this.stroke),
        "stroke": this.outlineColor.hash()
      })
      if (this.outlineVisible === false)
        this.shape.items[0].show()
      this.outlineVisible = true
    } else if (this.outlineVisible === true) {
      // reset them once
      this.shape.items[0].attr({
        "stroke-width": 0,
        "stroke": "none"
      })
      this.shape.items[0].hide()
      this.outlineVisible = false
    }
    return this;
  }

  toBack(figure: Figure) {
    super.toBack(figure);
    if (this.outlineVisible === true) {
      this.shape.items[0].insertBefore(this.shape.items[1])
    }

    return this
  }

  setGlow(flag: boolean) {
    if (this.isGlowing === flag) {
      return
    }

    if (flag === true) {
      // store old values for restore
      this._lineColor = this.lineColor
      this._stroke = this.stroke

      this.setColor(new Color(63, 114, 191))
      this.setStroke((this.stroke * 4) | 0)
    } else {
      this.setColor(this._lineColor)
      this.setStroke(this._stroke)
    }

    this.isGlowing = flag

    return this
  }

  isResizeable() {
    return true;
  }

  setStroke(w) {
    this.stroke = parseFloat(w)

    this.repaint({})
    this.fireEvent("change:stroke", {
      value: this.stroke
    })

    return this
  }

  getStroke() {
    return this.stroke
  }

  setColor(color: Color) {
    this.lineColor = color.clone();
    this.repaint({})
    this.fireEvent("change:color", {
      value: this.lineColor
    })

    return this
  }

  getColor() {
    return this.lineColor;
  }

  translate(dx: number, dy: number) {
    this.vertices.each(function (i, e) {
      e.translate(dx, dy)
    })

    this.start = this.vertices.first().clone()
    this.end = this.vertices.last().clone()

    this.editPolicy.each((i, e) => {
      if (e instanceof DragDropEditPolicy) {
        e.moved(this.canvas, this)
      }
    })

    this.svgPathString = null
    this.repaint({})

    return this
  }

  getBoundingBox() {
    let minX = Math.min(...this.vertices.asArray().map(n => n.getX()))
    let minY = Math.min(...this.vertices.asArray().map(n => n.getY()))
    let maxX = Math.max(...this.vertices.asArray().map(n => n.getX()))
    let maxY = Math.max(...this.vertices.asArray().map(n => n.getY()))
    let width = maxX - minX;
    let height = maxY - minY;

    return new Rectangle(minX, minY, width, height)
  }

  setStartPosition(x, y) {

    let pos = new Point(x, y)
    if (this.start.equals(pos)) {
      return this
    }
    this.start.setPosition({ x: pos.getX(), y: pos.getY() });
    this.vertices.first().setPosition({ x: pos.getX(), y: pos.getY() })
    this.repaint({})

    this.editPolicy.each((i, e) => {
      if (e instanceof DragDropEditPolicy) {
        e.moved(this.canvas, this)
      }
    })
    this.fireEvent("change:start", {
      value: this.start
    })

    return this
  }

  setStartPoint(x: number, y: number) {
    return this.setStartPosition(x, y)
  }

  setStartX(x: number) {
    this.setStartPosition(x, this.start.getX());
  }


  setStartY(y: number) {
    this.setStartPosition(this.start.getX(), y);
  }


  setEndX(x: number) {
    this.setEndPosition(x, this.end.getY())
  }

  setEndY(y: number) {
    this.setEndPosition(this.end.getX(), y)
  }


  setEndPosition(x: number, y: number) {
    let pos = new Point(x, y)
    if (this.end.equals(pos)) {
      return this
    }

    this.end.setPosition({ x: pos.getX(), y: pos.getY() })
    this.vertices.last().setPosition({ x: pos.getX(), y: pos.getY() })
    this.repaint({})


    this.editPolicy.each((i, e) => {
      if (e instanceof DragDropEditPolicy) {
        e.moved(this.canvas, this)
      }
    })

    this.fireEvent("change:end", {
      value: this.end
    })

    return this
  }

  setEndPoint(x: number, y: number) {
    return this.setEndPosition(x, y)
  }


  getStartX() {
    return this.start.getX();
  }

  getStartY() {
    return this.start.getY()
  }

  getStartPosition() {
    return this.start.clone();
  }

  getStartPoint() {
    return this.getStartPosition()
  }



  getEndX() {
    return this.end.getX();
  }

  getEndY() {
    return this.end.getY();
  }

  getEndPosition() {
    return this.end.clone()
  }


  getEndPoint() {
    return this.getEndPosition()
  }


  getX() {
    return this.getBoundingBox().getX();
  }


  getY() {
    return this.getBoundingBox().getY();
  }

  getVertex(index) {
    return this.vertices.get(index);
  }



  setVertex(index: number, x: number | Point, y?: number) {
    if (x instanceof Point) {
      y = x.getY();
      x = x.getX();
    }

    let vertex = this.vertices.get(index)

    if (vertex === null || (vertex.getX() === x && vertex.getY() === y)) {
      return
    }

    vertex.setX(parseFloat(x + ''));
    vertex.setY(parseFloat(y + ''));

    this.start = this.vertices.first().clone()
    this.end = this.vertices.last().clone()

    this.svgPathString = null
    this.routingRequired = true
    this.repaint({})

    this.editPolicy.each((i, e) => {
      if (e instanceof DragDropEditPolicy) {
        e.moved(this.canvas, this)
      }
    })
    this.fireEvent("change:vertices", {
      value: this.vertices
    })

    return this
  }

  getVertices() {
    return this.vertices
  }

  setVertices(vertices) {

    if (Array.isArray(vertices)) {
      this.vertices = new ArrayList()
      vertices.forEach(element => {
        this.vertices.add(new Point(element))
      })
    }

    else if (vertices instanceof ArrayList) {
      this.vertices = vertices.clone(true)
    } else {
      throw "invalid argument for Line.setVertices"
    }

    if (this.vertices.getSize() > 1) {
      this.start = this.vertices.first().clone()
      this.end = this.vertices.last().clone()
    }


    this.svgPathString = null
    this.repaint({})


    if (!this.selectionHandles.isEmpty()) {
      this.editPolicy.each(function (i, e) {
        if (e instanceof SelectionFeedbackPolicy) {
          e.onUnselect(this.canvas, this)
          e.onSelect(this.canvas, this, undefined)
        }
      })
    }


    this.editPolicy.each((i, e) => {
      if (e instanceof DragDropEditPolicy) {
        e.moved(this.canvas, this)
      }
    })

    this.fireEvent("change:vertices", {
      value: this.vertices
    })

    return this
  }

  getSegments(): ArrayList<{ start: Point, end: Point }> {
    let result = new ArrayList<{ start: Point, end: Point }>()
    result.add({
      start: this.getStartPosition(),
      end: this.getEndPosition()
    })

    return result;
  }


  getLength() {
    return Math.sqrt((this.start.getX() - this.end.getX()) * (this.start.getX() - this.end.getX()) + (this.start.getY() - this.end.getY()) * (this.start.getY() - this.end.getY()))
  }

  getAngle() {
    let length = this.getLength()
    let angle = -(180 / Math.PI) * Math.asin((this.start.getY() - this.end.getY()) / length)

    if (angle < 0) {
      if (this.end.getX() < this.start.getX()) {
        angle = Math.abs(angle) + 180
      } else {
        angle = 360 - Math.abs(angle)
      }
    } else {
      if (this.end.getX() < this.start.getX()) {
        angle = 180 - angle
      }
    }
    return angle
  }

  createCommand(request) {
    if (request.getPolicy() === CommandType.MOVE) {
      if (this.isDraggable()) {
        return new CommandMoveVertices(this)
      }
    }

    if (request.getPolicy() === CommandType.DELETE) {
      if (this.isDeleteable()) {
        return new CommandDelete(this)
      }
    }

    if (request.getPolicy() === CommandType.MOVE_BASEPOINT) {
      if (this.isDraggable()) {
        return new CommandMoveVertex(this)
      }
    }

    return null
  }

  installEditPolicy(policy) {
    if (!(policy instanceof LineSelectionFeedbackPolicy) && policy instanceof SelectionFeedbackPolicy) {
      return
    }

    return super.installEditPolicy(policy)

  }

  hitTest(px: number, py: number) {
    return Line.hit(this.corona + this.stroke, this.start.getX(), this.start.getY(), this.end.getX(), this.end.getY(), px, py)
  }


  pointProjection(px: number, py: number) {
    let pt = new Point(px, py)
    let p1 = this.getStartPosition()
    let p2 = this.getEndPosition()
    return Line.pointProjection(p1.getX(), p1.getY(), p2.getX(), p2.getY(), pt.getX(), pt.getY())
  }


  lerp(percentage) {
    let p1 = this.getStartPosition()
    let p2 = this.getEndPosition()
    percentage = Math.min(1, Math.max(0, percentage))
    return new Point(p1.getX() + (p2.getX() - p1.getX()) * percentage, p1.getY() + (p2.getY() - p1.getY()) * percentage)
  }



  intersection(other: Line) {
    let result = new ArrayList()

    // empty result. the lines are equal...infinit array
    if (other === this) {
      return result
    }

    let segments1 = this.getSegments()
    let segments2 = other.getSegments()

    segments1.each(function (i, s1) {
      segments2.each(function (j, s2) {
        let p = Line.intersection(s1.start, s1.end, s2.start, s2.end)
        if (p !== null) {
          result.add(p)
        }
      })
    })
    return result
  }



  getPersistentAttributes() {
    let memento = super.getPersistentAttributes();
    delete memento.x
    delete memento.y
    delete memento.width
    delete memento.height

    memento.stroke = this.stroke
    memento.color = this.getColor().hash()
    memento.outlineStroke = this.outlineStroke
    memento.outlineColor = this.outlineColor.hash()
    if (this.dasharray !== null) {
      memento.dasharray = this.dasharray
    }

    if (this.editPolicy.getSize() > 0) {
      memento.policy = this.editPolicy.first().NAME
    }


    memento.vertex = []
    this.getVertices().each(function (i, e) {
      memento.vertex.push({
        x: e.getX(),
        y: e.getY()
      })
    })

    return memento
  }


  setPersistentAttributes(memento) {
    super.setPersistentAttributes(memento);

    if (typeof memento.dasharray === "string") {
      this.dasharray = memento.dasharray
    }
    if (typeof memento.stroke !== "undefined") {
      this.setStroke(parseFloat(memento.stroke))
    }
    if (typeof memento.color !== "undefined") {
      this.setColor(memento.color)
    }
    if (typeof memento.outlineStroke !== "undefined") {
      this.setOutlineStroke(memento.outlineStroke)
    }
    if (typeof memento.outlineColor !== "undefined") {
      this.setOutlineColor(memento.outlineColor)
    }
    if (typeof memento.policy !== "undefined") {
      try {
        this.installEditPolicy(eval("new " + memento.policy + "()"))
      } catch (exc) {
        console.warn("Unable to install edit policy '" + memento.policy + "' forced by " + this.NAME + ".setPersistendAttributes. Using default.")
      }
    }


    if (Array.isArray(memento.vertex) && memento.vertex.length > 1) {
      this.setVertices(memento.vertex)
    }

    return this;

  }

  public static intersection(a1: Point, a2: Point, b1: Point, b2: Point) {
    let a1x = a1.getX(), a1y = a1.getY(), b1x = b1.getX(), b1y = b1.getY();
    let a2x = a2.getX(), a2y = a2.getY(), b2x = b2.getX(), b2y = b2.getY();
    let result = null

    let ua_t = (b2x - b1x) * (a1y - b1y) - (b2y - b1y) * (a1x - b1x)
    let ub_t = (a2x - a1x) * (a1y - b1y) - (a2y - a1y) * (a1x - b1x)
    let u_b = (b2y - b1y) * (a2x - a1x) - (b2x - b1x) * (a2y - a1y)

    if (u_b !== 0) {
      let ua = ua_t / u_b
      let ub = ub_t / u_b

      if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
        result = new Point((a1x + ua * (a2x - a1x)) | 0, (a1y + ua * (a2y - a1y)) | 0)

        result.justTouching = (0 === ua || ua === 1 || 0 === ub || ub === 1)
      }
    }

    return result
  }



  public static hit(coronaWidth: number, X1: number, Y1: number, X2: number, Y2: number, px: number, py: number) {
    return Line.distance(X1, Y1, X2, Y2, px, py) < coronaWidth
  }
  static distance(X1: number, Y1: number, X2: number, Y2: number, px: number, py: number): number {
    throw new Error("Method not implemented.");
  }

  static pointProjection(arg0: number, arg1: number, arg2: number, arg3: number, arg4: number, arg5: number) {
    throw new Error("Method not implemented.");
  }

  static inverseLerp(x1: any, y1: any, x2: any, y2: any, x3: any, y3: any): number {
    throw new Error("Method not implemented.");
  }
}


