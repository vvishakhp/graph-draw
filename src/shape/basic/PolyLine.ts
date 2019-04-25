import {
  Type, LineShape, Point, extend,
  VertexRouter, ArrayList, DragDropEditPolicy,
  SelectionFeedbackPolicy, DirectRouter, Command,
  CommandType, CommandDelete, CommandMoveVertex,
  CommandMoveVertices
} from '../../imports';
import jsonUtil from '../../util/JSONUtil';

@Type('PolyLine')
export class PolyLine extends LineShape {


  oldPoint: Point;
  router: any;
  lineSegments: any;
  radius: string;


  constructor(attr, setter, getter) {
    super(extend(
      {
        router: new VertexRouter()
      }, attr), setter, getter);

    this.svgPathString = null
    this.oldPoint = null

    this.router = null
    this.routingRequired = true
    this.lineSegments = new ArrayList()

    this.radius = ""

    this.setterWhitelist = extend(this.setterWhitelist, {
      router: this.setRouter,
      radius: this.setRadius
    }, setter);

    this.getterWhitelist = extend(this.getterWhitelist, {
      router: this.getRouter,
      radius: this.getRadius
    }, getter);

  }



  setRadius(radius) {
    this.radius = radius
    this.svgPathString = null
    this.repaint({})
    this.fireEvent("change:radius", { value: this.radius })

    return this
  }


  setOutlineStroke(w) {
    if (this.outlineStroke !== w) {
      this.svgPathString = null
      this.routingRequired = true
    }
    super.setOutlineStroke(w);

    return this
  }

  getRadius() {
    return this.radius
  }

  setStartPoint(x, y) {
    if (this.vertices.getSize() > 0) {
      this.vertices.first().setPosition(x, y)
    }
    else {
      this.vertices.add(new Point(x, y))
    }
    this.start = this.vertices.first().clone()
    //     if(this.isInDragDrop===false)
    this.calculatePath({ startMoved: true, endMoved: false })

    this.repaint({})

    let _this = this
    this.editPolicy.each((i, e) => {
      if (e instanceof DragDropEditPolicy) {
        e.moved(_this.canvas, _this)
      }
    })

    this.fireEvent("change:start", { value: this.start })

    return this
  }

  setEndPoint(x, y) {
    if (this.vertices.getSize() > 1) {
      this.vertices.last().setPosition(x, y)
    }
    else {
      this.vertices.add(new Point(x, y))
    }
    this.end = this.vertices.last().clone()

    if (this.isInDragDrop === false)
      this.calculatePath({ startMoved: false, endMoved: true })

    this.repaint({})
    this.editPolicy.each((i, e) => {
      if (e instanceof DragDropEditPolicy) {
        e.moved(this.canvas, this)
      }
    })
    this.fireEvent("change:end", { value: this.end })

    return this
  }

  addVertex(x, y) {
    this.vertices.add(new Point(x, y))

    this.start = this.vertices.first().clone()
    this.end = this.vertices.last().clone()

    this.svgPathString = null
    this.repaint({})

    if (!this.selectionHandles.isEmpty()) {
      this.editPolicy.each((i, e) => {
        if (e instanceof SelectionFeedbackPolicy) {
          e.onUnselect(this.canvas, this)
          e.onSelect(this.canvas, this, false)
        }
      })
    }
    this.fireEvent("change:vertices", { value: this.vertices })

    return this
  }

  insertVertexAt(index, x, y) {
    let vertex = new Point(x, y)

    this.vertices.insertElementAt(vertex, index)

    this.start = this.vertices.first().clone()
    this.end = this.vertices.last().clone()

    this.svgPathString = null
    this.repaint({})

    if (!this.selectionHandles.isEmpty()) {
      this.editPolicy.each((i, e) => {
        if (e instanceof SelectionFeedbackPolicy) {
          e.onUnselect(this.canvas, this)
          e.onSelect(this.canvas, this, false)
        }
      })
    }
    this.fireEvent("change:vertices", { value: this.vertices })

    return this
  }

  removeVertexAt(index) {
    let removedPoint = this.vertices.removeElementAt(index)

    this.start = this.vertices.first().clone()
    this.end = this.vertices.last().clone()

    this.svgPathString = null
    this.repaint({})

    if (!this.selectionHandles.isEmpty()) {
      this.editPolicy.each((i, e) => {
        if (e instanceof SelectionFeedbackPolicy) {
          e.onUnselect(this.canvas, this)
          e.onSelect(this.canvas, this, false)
        }
      })
    }
    this.fireEvent("change:vertices", { value: this.vertices })

    return removedPoint
  }

  setRouter(router) {
    if (this.router !== null) {
      this.router.onUninstall(this)
    }

    if (typeof router === "undefined" || router === null) {
      this.router = new DirectRouter()
    }
    else {
      this.router = router
    }

    this.router.onInstall(this)

    this.routingRequired = true

    this.repaint({})

    this.fireEvent("change:router", { value: this.router })

    return this
  }

  getRouter() {
    return this.router
  }

  calculatePath(routingHints) {
    routingHints = routingHints || {}

    if (this.shape === null) {
      return
    }

    this.svgPathString = null

    routingHints.oldVertices = this.vertices

    // cleanup the routing cache
    //
    this.oldPoint = null
    this.lineSegments = new ArrayList<any>()
    this.vertices = new ArrayList<any>()

    // Use the internal router
    //
    this.router.route(this, routingHints)
    this.routingRequired = false
    this.fireEvent("routed")
    this.fireEvent("change:route", {})
  }

  repaint(attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
      return this
    }

    if (this.svgPathString === null || this.routingRequired === true) {
      this.calculatePath({})
    }

    if (typeof attributes === "undefined") {
      attributes = {}
    }
    attributes.path = this.svgPathString
    jsonUtil.ensureDefault(attributes, "stroke-linecap", "round")
    jsonUtil.ensureDefault(attributes, "stroke-linejoin", "round")

    return super.repaint(attributes)
  }

  getSegments() {
    return this.lineSegments
  }

  addPoint(p, y) {
    if (typeof y !== "undefined") {
      p = new Point(p, y)
    }
    this.vertices.add(p)

    if (this.oldPoint !== null) {
      this.lineSegments.add({
        start: this.oldPoint,
        end: p
      })
    }
    this.svgPathString = null
    this.oldPoint = p
  }

  onDragStart(x: number, y: number, shiftKey?: boolean, ctrlKey?: boolean, isFaked?: boolean) {
    let result = super.onDragStart(x, y, shiftKey, ctrlKey, isFaked)

    if (result === true && isFaked !== true) {
      this.draggedSegment = this.hitSegment(x, y)
    }
    return result
  }

  getLength() {
    let result = 0
    for (let i = 0; i < this.lineSegments.getSize(); i++) {
      let segment = this.lineSegments.get(i)
      let p1 = segment.start
      let p2 = segment.end
      result += Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y))
    }
    return result
  }

  setVertices(vertices) {
    this.router.verticesSet(this)

    return super.setVertices(vertices)
  }

  pointProjection(px, py) {
    let result = null,
      projection = null,
      p1 = null,
      p2 = null,
      segment = null
    let lastDist = Number.MAX_SAFE_INTEGER
    let pt = new Point(px, py)
    for (let i = 0; i < this.lineSegments.getSize(); i++) {
      segment = this.lineSegments.get(i)
      p1 = segment.start
      p2 = segment.end
      projection = LineShape.pointProjection(p1.x, p1.y, p2.x, p2.y, pt.getX(), pt.getY())
      if (projection !== null) {
        let dist = projection.distance(pt)
        if (result == null || dist < lastDist) {
          result = projection
          result.index = i
          lastDist = dist
        }
      }
    }

    if (result !== null) {
      let length = 0
      let segment
      for (let i = 0; i < result.index; i++) {
        segment = this.lineSegments.get(i)
        length += segment.start.distance(segment.end)
      }
      segment = this.lineSegments.get(result.index)
      p1 = segment.start
      p2 = segment.end
      length += p1.distance(p2) * LineShape.inverseLerp(p2.x, p2.y, p1.x, p1.y, result.x, result.y)
      result.percentage = (1.0 / this.getLength()) * length
    }
    return result
  }

  lerp(percentage) {
    let length = this.getLength() * percentage
    let lastValidLength = length
    let segment = null, p1 = null, p2 = null
    for (let i = 0; i < this.lineSegments.getSize(); i++) {
      segment = this.lineSegments.get(i)
      p1 = segment.start
      p2 = segment.end
      length = length - p1.distance(p2)
      if (length <= 0) {
        percentage = 1.0 / p1.distance(p2) * lastValidLength
        return new Point(p1.x + (p2.x - p1.x) * percentage, p1.y + (p2.y - p1.y) * percentage)
      }
      lastValidLength = length
    }
    return p2
  }

  hitSegment(px, py) {
    for (let i = 0; i < this.lineSegments.getSize(); i++) {
      let segment = this.lineSegments.get(i)
      if (LineShape.hit(this.corona + this.stroke, segment.start.x, segment.start.y, segment.end.x, segment.end.y, px, py)) {
        return { index: i, start: segment.start, end: segment.end }
      }
    }
    return null
  }


  hitTest(px, py) {
    return this.hitSegment(px, py) !== null
  }


  createCommand(request): Command {

    if (request.getPolicy() === CommandType.DELETE) {
      if (this.isDeleteable() === true) {
        return new CommandDelete(this as any)
      }
    }
    else if (request.getPolicy() === CommandType.MOVE_VERTEX) {
      if (this.isResizeable() === true) {
        return new CommandMoveVertex(this)
      }
    }
    else if (request.getPolicy() === CommandType.MOVE_VERTICES) {
      if (this.isResizeable() === true) {
        return new CommandMoveVertices(this)
      }
    }

    return super.createCommand(request)
  }


  getPersistentAttributes() {
    let memento = extend(super.getPersistentAttributes(), {
      router: this.router.NAME,
      radius: this.radius
    })

    memento = this.router.getPersistentAttributes(this, memento)

    return memento
  }

  setPersistentAttributes(memento) {
    super.setPersistentAttributes(memento);

    if (typeof memento.router !== "undefined") {
      try {
        this.setRouter(eval("new " + memento.router + "()"))
      }
      catch (exc) {
        console.warn("Unable to install router '" + memento.router + "' forced by " + this.NAME + ".setPersistendAttributes. Using default")
      }
    }

    if (typeof memento.radius !== "undefined") {
      this.setRadius(memento.radius)
    }

    this.router.setPersistentAttributes(this, memento)

    if (this.vertices.getSize() > 1) {
      this.start = this.vertices.first().clone()
      this.end = this.vertices.last().clone()
    }

    return this;
  }
}