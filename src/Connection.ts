import {
  Type, PolyLine, ConnectionLocator, DragDropEditPolicy,
  Point, SplineConnectionRouter, CommandType, CommandMoveVertices,
  CommandReconnect, extend
} from "./imports";


@Type('Connection')
export class Connection extends PolyLine {
  sourcePort: any;
  targetPort: any;
  sourceDecorator: any;
  targetDecorator: any;
  sourceDecoratorNode: any;
  targetDecoratorNode: any;
  moveListener: (figure: any) => void;
  constructor(attr?, setter?, getter?) {
    super(extend({
      color: "#129CE4",
      stroke: 2,
      radius: 3
    }, attr), setter, getter);


    this.sourcePort = null
    this.targetPort = null

    this.oldPoint = null

    this.sourceDecorator = null

    this.targetDecorator = null

    this.sourceDecoratorNode = null
    this.targetDecoratorNode = null


    this.isMoving = false

    this.moveListener = (figure) => {
      if (figure === this.sourcePort) {
        this.setStartPoint(this.sourcePort.getAbsoluteX(), this.sourcePort.getAbsoluteY())
      }
      else {
        this.setEndPoint(this.targetPort.getAbsoluteX(), this.targetPort.getAbsoluteY())
      }
    }
    this.setterWhitelist = extend(this.setterWhitelist, {
      sourceDecorator: this.setSourceDecorator,
      targetDecorator: this.setTargetDecorator,
      source: this.setSource,
      target: this.setTarget
    }, setter);

    this.setterWhitelist = extend(this.getterWhitelist, {
      sourceDecorator: this.getSourceDecorator,
      targetDecorator: this.getTargetDecorator,
      source: this.getSource,
      target: this.getTarget
    }, getter);
  }


  disconnect() {
    if (this.sourcePort !== null) {
      this.sourcePort.off(this.moveListener)
      this.sourcePort.connections.remove(this)

      // fire the events to all listener
      this.sourcePort.fireEvent("disconnect", { port: this.sourcePort, connection: this })
      if (this.canvas !== null) {
        this.canvas.fireEvent("disconnect", { "port": this.sourcePort, "connection": this })
      }
      this.sourcePort.onDisconnect(this)

      this.fireSourcePortRouteEvent()
    }

    if (this.targetPort !== null) {
      this.targetPort.off(this.moveListener)
      this.targetPort.connections.remove(this)

      // fire the events to all listener
      this.targetPort.fireEvent("disconnect", { port: this.targetPort, connection: this })
      if (this.canvas !== null) {
        this.canvas.fireEvent("disconnect", { "port": this.targetPort, "connection": this })
      }
      this.targetPort.onDisconnect(this)

      this.fireTargetPortRouteEvent()
    }
  }


  /**
   * @private
   **/
  reconnect() {
    if (this.sourcePort !== null) {
      this.sourcePort.on("move", this.moveListener)
      this.sourcePort.connections.add(this)

      // fire the events to all listener
      this.sourcePort.fireEvent("connect", { port: this.sourcePort, connection: this })
      if (this.canvas !== null) {
        this.canvas.fireEvent("connect", { "port": this.sourcePort, "connection": this })
      }
      this.sourcePort.onConnect(this)

      this.fireSourcePortRouteEvent()
    }

    if (this.targetPort !== null) {
      this.targetPort.on("move", this.moveListener)
      this.targetPort.connections.add(this)

      // fire the events to all listener
      this.targetPort.fireEvent("connect", { port: this.targetPort, connection: this })
      if (this.canvas !== null) {
        this.canvas.fireEvent("connect", { "port": this.targetPort, "connection": this })
      }
      this.targetPort.onConnect(this)

      this.fireTargetPortRouteEvent()
    }
    this.routingRequired = true
    this.repaint({})
  }


  /**
   * You can't drag&drop the resize handles of a connector.
   * @type boolean
   **/
  isResizeable() {
    return this.isDraggable()
  }

  add(child, locator, index) {
    if (!(locator instanceof ConnectionLocator)) {
      throw "Locator must implement the class  .layout.locator.ConnectionLocator"
    }

    return super.add(child, locator, index)
  }

  setSourceDecorator(decorator) {
    this.sourceDecorator = decorator
    this.routingRequired = true
    if (this.sourceDecoratorNode !== null) {
      this.sourceDecoratorNode.remove()
      this.sourceDecoratorNode = null
    }
    this.repaint({})
  }

  getSourceDecorator() {
    return this.sourceDecorator
  }

  setTargetDecorator(decorator) {
    this.targetDecorator = decorator
    this.routingRequired = true
    if (this.targetDecoratorNode !== null) {
      this.targetDecoratorNode.remove()
      this.targetDecoratorNode = null
    }
    this.repaint({})
  }

  getTargetDecorator() {
    return this.targetDecorator
  }

  calculatePath(routingHints) {

    if (this.sourcePort === null || this.targetPort === null) {
      return this
    }

    super.calculatePath(routingHints)

    if (this.shape !== null) {
      var z1 = this.sourcePort.getZOrder()
      var z2 = this.targetPort.getZOrder()
      z1 < z2 ? this.toBack(this.sourcePort) : this.toBack(this.targetPort)
    }

    return this
  }

  repaint(attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
      return
    }

    if (this.sourcePort === null || this.targetPort === null) {
      return
    }


    super.repaint(attributes);

    // paint the decorator if any exists
    //
    if (this.targetDecorator !== null && this.targetDecoratorNode === null) {
      this.targetDecoratorNode = this.targetDecorator.paint(this.getCanvas().paper)
    }

    if (this.sourceDecorator !== null && this.sourceDecoratorNode === null) {
      this.sourceDecoratorNode = this.sourceDecorator.paint(this.getCanvas().paper)
    }

    var _this = this

    // translate/transform the decorations to the end/start of the connection
    // and rotate them as well
    //
    if (this.sourceDecoratorNode !== null) {
      var start = this.getVertices().first()
      this.sourceDecoratorNode.transform("r" + this.getStartAngle() + "," + start.getX() + "," + start.getY() + " t" + start.getX() + "," + start.getY())
      // propagate the color and the opacity to the decoration as well
      this.sourceDecoratorNode.attr({ "stroke": "#" + this.lineColor.hex(), opacity: this.alpha })
      this.sourceDecoratorNode.forEach((shape) => {
        shape.node.setAttribute("class", _this.cssClass !== null ? _this.cssClass : "")
      })
    }

    if (this.targetDecoratorNode !== null) {
      var end = this.getVertices().last()
      this.targetDecoratorNode.transform("r" + this.getEndAngle() + "," + end.getX() + "," + end.getY() + " t" + end.getX() + "," + end.getY())
      this.targetDecoratorNode.attr({ "stroke": "#" + this.lineColor.hex(), opacity: this.alpha })
      this.targetDecoratorNode.forEach((shape) => {
        shape.node.setAttribute("class", _this.cssClass !== null ? _this.cssClass : "")
      })
    }
    return this;
  }

  getAbsoluteX() {
    return 0
  }

  getAbsoluteY() {
    return 0
  }


  postProcess(postProcessCache) {
    this.router.postProcess(this, this.getCanvas(), postProcessCache)
  }


  onDrag(dx, dy, dx2, dy2) {
    if (this.command === null) {
      return
    }


    this.router.onDrag(this, dx, dy, dx2, dy2)

    this.command.updateVertices(this.getVertices().clone())

    var _this = this


    this.editPolicy.each((i, e) => {
      if (e instanceof DragDropEditPolicy) {
        e.onDrag(_this.canvas, _this)
      }
    })

    this.svgPathString = null
    this.repaint({})


    this.editPolicy.each((i, e) => {
      if (e instanceof DragDropEditPolicy) {
        e.moved(_this.canvas, _this)
      }
    })

    this.fireEvent("move", { figure: this, dx: dx, dy: dx })
  }


  toFront(figure) {
    super.toFront(figure)

    if (this.shape !== null) {
      if (this.targetDecoratorNode !== null) {
        this.targetDecoratorNode.insertAfter(this.shape)
      }
      if (this.sourceDecoratorNode !== null) {
        this.sourceDecoratorNode.insertAfter(this.shape)
      }
    }

    return this
  }

  toBack(figure) {
    super.toBack(figure)

    if (this.shape !== null) {
      if (this.targetDecoratorNode !== null) {
        this.targetDecoratorNode.insertAfter(this.shape)
      }
      if (this.sourceDecoratorNode !== null) {
        this.sourceDecoratorNode.insertAfter(this.shape)
      }
    }


    return this
  }


  getStartPoint(refPoint?: Point) {
    return this.getStartPosition(refPoint)
  }

  getStartPosition(refPoint?: Point) {
    if (this.isMoving === false) {
      if (refPoint) {
        return this.sourcePort.getConnectionAnchorLocation(refPoint, this)
      }
      return this.sourcePort.getConnectionAnchorLocation(this.targetPort.getConnectionAnchorReferencePoint(this), this)
    }

    return super.getStartPosition()
  }

  getEndPoint(refPoint?: Point) {
    return this.getEndPosition(refPoint)
  }

  getEndPosition(refPoint?: Point): Point {
    if (this.isMoving === false) {
      if (refPoint) {
        return this.targetPort.getConnectionAnchorLocation(refPoint, this)
      }
      return this.targetPort.getConnectionAnchorLocation(this.sourcePort.getConnectionAnchorReferencePoint(this), this)
    }

    return super.getEndPosition();
  }

  setSource(port) {
    if (this.sourcePort !== null) {
      this.sourcePort.off(this.moveListener)
      this.sourcePort.connections.remove(this)
      this.sourcePort.fireEvent("disconnect", { port: this.sourcePort, connection: this })
      if (this.canvas !== null) {
        this.canvas.fireEvent("disconnect", { "port": this.sourcePort, "connection": this })
      }
      this.sourcePort.onDisconnect(this)
    }

    this.sourcePort = port
    if (this.sourcePort === null) {
      return
    }

    this.routingRequired = true
    this.fireSourcePortRouteEvent()
    this.sourcePort.connections.add(this)
    this.sourcePort.on("move", this.moveListener)
    if (this.canvas !== null) {
      this.canvas.fireEvent("connect", { "port": this.sourcePort, "connection": this })
    }
    this.sourcePort.fireEvent("connect", { port: this.sourcePort, connection: this })
    this.sourcePort.onConnect(this)

    this.setStartPoint(port.getAbsoluteX(), port.getAbsoluteY())
    this.fireEvent("connect", { "port": this.sourcePort, "connection": this })
  }

  getSource() {
    return this.sourcePort
  }

  setTarget(port) {
    if (this.targetPort !== null) {
      this.targetPort.off(this.moveListener)
      this.targetPort.connections.remove(this)
      this.targetPort.fireEvent("disconnect", { port: this.targetPort, connection: this })
      if (this.canvas !== null) {
        this.canvas.fireEvent("disconnect", { "port": this.targetPort, "connection": this })
      }
      this.targetPort.onDisconnect(this)
    }

    this.targetPort = port
    if (this.targetPort === null) {
      return
    }

    this.routingRequired = true
    this.fireTargetPortRouteEvent()
    this.targetPort.connections.add(this)
    this.targetPort.on("move", this.moveListener)
    if (this.canvas !== null) {
      this.canvas.fireEvent("connect", { "port": this.targetPort, "connection": this })
    }
    this.targetPort.fireEvent("connect", { port: this.targetPort, connection: this })
    this.targetPort.onConnect(this)

    this.setEndPoint(port.getAbsoluteX(), port.getAbsoluteY())
    this.fireEvent("connect", { "port": this.targetPort, "connection": this })
  }

  getTarget() {
    return this.targetPort
  }

  sharingPorts(other) {
    return this.sourcePort == other.sourcePort ||
      this.sourcePort == other.targetPort ||
      this.targetPort == other.sourcePort ||
      this.targetPort == other.targetPort
  }

  setCanvas(canvas) {
    if (this.canvas === canvas) {
      return // nothing to do
    }

    var notiCanvas = this.canvas == null ? canvas : this.canvas

    super.setCanvas(canvas)

    if (canvas !== null && Connection.DROP_FILTER === null) {
      Connection.DROP_FILTER = canvas.paper.createFilter()
      Connection.DROP_FILTER.element.setAttribute("width", "250%")
      Connection.DROP_FILTER.element.setAttribute("height", "250%")
      Connection.DROP_FILTER.createShadow(1, 1, 2, 0.3)
    }

    if (this.sourceDecoratorNode !== null) {
      this.sourceDecoratorNode.remove()
      this.sourceDecoratorNode = null
    }

    if (this.targetDecoratorNode !== null) {
      this.targetDecoratorNode.remove()
      this.targetDecoratorNode = null
    }

    if (this.canvas === null) {
      if (this.sourcePort !== null) {
        this.sourcePort.off(this.moveListener)
        notiCanvas.fireEvent("disconnect", { "port": this.sourcePort, "connection": this })
        this.sourcePort.onDisconnect(this)
      }
      if (this.targetPort !== null) {
        this.targetPort.off(this.moveListener)
        notiCanvas.fireEvent("disconnect", { "port": this.targetPort, "connection": this })
        this.targetPort.onDisconnect(this)
      }
    }
    else {
      this.shape.items[0].filter(Connection.DROP_FILTER)

      if (this.sourcePort !== null) {
        this.sourcePort.on("move", this.moveListener)
        this.canvas.fireEvent("connect", { "port": this.sourcePort, "connection": this })
        this.sourcePort.onConnect(this)
      }
      if (this.targetPort !== null) {
        this.targetPort.on("move", this.moveListener)
        this.canvas.fireEvent("connect", { "port": this.targetPort, "connection": this })
        this.targetPort.onConnect(this)
      }
    }
    return this;
  }

  getStartAngle() {

    if (this.lineSegments.getSize() === 0) {
      return 0
    }

    var p1 = this.lineSegments.get(0).start
    var p2 = this.lineSegments.get(0).end
    if (this.router instanceof SplineConnectionRouter) {
      p2 = this.lineSegments.get(5).end
    }
    var length = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y))
    var angle = -(180 / Math.PI) * Math.asin((p1.y - p2.y) / length)

    if (angle < 0) {
      if (p2.x < p1.x) {
        angle = Math.abs(angle) + 180
      }
      else {
        angle = 360 - Math.abs(angle)
      }
    }
    else {
      if (p2.x < p1.x) {
        angle = 180 - angle
      }
    }
    return angle
  }

  getEndAngle() {

    if (this.lineSegments.getSize() === 0) {
      return 90
    }

    var p1 = this.lineSegments.get(this.lineSegments.getSize() - 1).end
    var p2 = this.lineSegments.get(this.lineSegments.getSize() - 1).start
    if (this.router instanceof SplineConnectionRouter) {
      p2 = this.lineSegments.get(this.lineSegments.getSize() - 5).end
    }
    var length = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y))
    var angle = -(180 / Math.PI) * Math.asin((p1.y - p2.y) / length)

    if (angle < 0) {
      if (p2.x < p1.x) {
        angle = Math.abs(angle) + 180
      }
      else {
        angle = 360 - Math.abs(angle)
      }
    }
    else {
      if (p2.x < p1.x) {
        angle = 180 - angle
      }
    }
    return angle
  }

  fireSourcePortRouteEvent() {
    this.sourcePort.getConnections().each((i, conn) => {
      conn.routingRequired = true
      conn.repaint()
    })
  }

  fireTargetPortRouteEvent() {

    this.targetPort.getConnections().each((i, conn: Connection) => {
      conn.routingRequired = true
      conn.repaint({})
    })
  }


  createCommand(request) {
    if (request.getPolicy() === CommandType.MOVE) {
      if (this.isDraggable()) {
        return new CommandMoveVertices(this)
      }
    }

    if (request.getPolicy() === CommandType.MOVE_BASEPOINT) {

      return new CommandReconnect(this)
    }

    return super.createCommand(request);
  }

  getPersistentAttributes() {
    var memento = super.getPersistentAttributes();

    var parentNode = this.getSource().getParent()
    while (parentNode.getParent() !== null) {
      parentNode = parentNode.getParent()
    }
    memento.source = {
      node: parentNode.getId(),
      port: this.getSource().getName()
    }

    parentNode = this.getTarget().getParent()
    while (parentNode.getParent() !== null) {
      parentNode = parentNode.getParent()
    }
    memento.target = {
      node: parentNode.getId(),
      port: this.getTarget().getName()
    }

    if (this.sourceDecorator !== null) {
      memento.source.decoration = this.sourceDecorator.NAME
    }

    if (this.targetDecorator !== null) {
      memento.target.decoration = this.targetDecorator.NAME
    }

    return memento
  }

  setPersistentAttributes(memento) {
    super.setPersistentAttributes(memento);
    if (typeof memento.target.decoration !== "undefined" && memento.target.decoration != null) {
      this.setTargetDecorator(eval("new " + memento.target.decoration))
    }

    if (typeof memento.source.decoration !== "undefined" && memento.source.decoration != null) {
      this.setSourceDecorator(eval("new " + memento.source.decoration))
    }
    return this;
  }
  public static DROP_FILTER = null;
}
