import {
  Circle, Color, extend, ArrayList, ConnectionAnchor,
  IntrusivePortsFeedbackPolicy, DragDropEditPolicy, CommandType,
  CommandMove
} from "./imports";


export class Port extends Circle {
  public static DEFAULT_BORDER_COLOR = new Color(27, 27, 27);
  lighterBgColor: any;
  name: any;
  coronaWidth: number;
  corona: any;
  useGradient: boolean;
  preferredConnectionDirection: any;
  connections: any;
  moveListener: (emitter: any, event: any) => void;
  maxFanOut: number;
  value: any;
  connectionAnchor: any;
  static port: any;
  portSelectionAdapter: () => this;
  _oldstroke: number;

  constructor(attr, setter, getter) {
    super(extend({
      bgColor: "#4f6870",
      stroke: 1,
      diameter: 10,
      color: "#1B1B1B",
      selectable: false
    }, attr), setter, getter);

    this.locator = null
    this.lighterBgColor = null
    this.name = null


    this.ox = this.x
    this.oy = this.y
    this.coronaWidth = 5
    this.corona = null
    this.useGradient = true

    this.preferredConnectionDirection = null


    this.connections = new ArrayList()


    this.moveListener = (emitter, event) => {
      this.repaint({})
      this.fireEvent("move", { figure: this, dx: 0, dy: 0 })
    }

    this.connectionAnchor = new ConnectionAnchor(this)


    this.value = null
    this.maxFanOut = Number.MAX_SAFE_INTEGER

    this.setCanSnapToHelper(false)

    this.editPolicy.each((i, policy) => this.uninstallEditPolicy(policy))

    this.installEditPolicy(new IntrusivePortsFeedbackPolicy())
    this.portSelectionAdapter = () => this;

  }

  getSelectionAdapter() {
    return this.portSelectionAdapter
  }


  setMaxFanOut(count) {
    this.maxFanOut = Math.max(1, count)
    this.fireEvent("change:maxFanOut", { value: this.maxFanOut })

    return this
  }

  /**
   * @method
   * return the maximal possible connections (in+out) for this port.
   *
   * @return {Number}
   */
  getMaxFanOut() {
    return this.maxFanOut
  }


  setConnectionAnchor(anchor) {
    // set some good defaults.
    if (typeof anchor === "undefined" || anchor === null) {
      anchor = new ConnectionAnchor(undefined)
    }

    this.connectionAnchor = anchor
    this.connectionAnchor.setOwner(this)


    this.fireEvent("move", { figure: this, dx: 0, dy: 0 })

    return this
  }

  getConnectionAnchorLocation(referencePoint, inquiringConnection) {
    return this.connectionAnchor.getLocation(referencePoint, inquiringConnection)
  }

  getConnectionAnchorReferencePoint(inquiringConnection) {
    return this.connectionAnchor.getReferencePoint(inquiringConnection)
  }


  getConnectionDirection(peerPort) {

    if (typeof this.preferredConnectionDirection === "undefined" || this.preferredConnectionDirection === null) {
      return this.getParent().getBoundingBox().getDirection(this.getAbsolutePosition())
    }

    return this.preferredConnectionDirection
  }



  setConnectionDirection(direction) {
    this.preferredConnectionDirection = direction

    // needs an change event to recalculate the route
    this.fireEvent("move", { figure: this, dx: 0, dy: 0 })

    return this
  }


  setLocator(locator) {
    this.locator = locator

    return this
  }


  getLocator() {
    return this.locator
  }


  setBackgroundColor(color) {
    super.setBackgroundColor(color)
    this.lighterBgColor = this.bgColor.lighter(0.3).hash()

    return this
  }


  setValue(value) {

    if (value === this.value) {
      return this
    }
    let old = this.value
    this.value = value
    if (this.getParent() !== null) {
      this.getParent().onPortValueChanged(this)
    }
    this.fireEvent("change:value", { value: this.value, old: old })

    return this
  }


  getValue() {
    return this.value
  }


  repaint(attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
      return
    }

    attributes = attributes || {}

    attributes.cx = this.getAbsoluteX()
    attributes.cy = this.getAbsoluteY()
    attributes.rx = this.width / 2
    attributes.ry = attributes.rx
    attributes.cursor = "move"

    if (this.getAlpha() < 0.9 || this.useGradient === false) {
      attributes.fill = this.bgColor.hash()
    }
    else {
      attributes.fill = ["90", this.bgColor.hash(), this.lighterBgColor].join("-")
    }

    return super.repaint(attributes);
  }


  onMouseEnter() {
    this._oldstroke = this.getStroke()
    this.setStroke(2)
  }



  onMouseLeave() {
    this.setStroke(this._oldstroke)
  }

  getConnections() {
    return this.connections
  }


  setParent(parent) {
    if (this.parent !== null) {
      this.parent.off(this.moveListener)
    }

    super.setParent(parent);

    if (this.parent !== null) {
      this.parent.on("move", this.moveListener)
    }

    return this;
  }



  getCoronaWidth() {
    return this.coronaWidth
  }



  setCoronaWidth(width) {
    this.coronaWidth = width
  }


  onDragStart(x, y, shiftKey, ctrlKey) {

    if (this.getConnections().getSize() >= this.maxFanOut) {
      return false
    }

    var _this = this
    this.ox = this.x
    this.oy = this.y

    var canStartDrag = true


    this.editPolicy.each((i, e) => {
      if (e instanceof DragDropEditPolicy) {

        canStartDrag = canStartDrag && e.onDragStart(_this.canvas, this, x, y, shiftKey, ctrlKey)
      }
    })

    return canStartDrag
  }

  onDrag(dx: number, dy: number, dx2, dy2, shiftKey, ctrlKey) {
    super.onDrag(dx, dy, dx2, dy2, shiftKey, ctrlKey);
  }


  onDragEnd(x, y, shiftKey, ctrlKey) {
    this.setAlpha(1.0)
    this.setPosition(this.ox, this.oy)
  }



  onDrop(dropTarget, x, y, shiftKey, ctrlKey) {

  }



  onConnect(connection) {
  }


  onDisconnect(connection) {
  }



  getName() {
    return this.name
  }

  setName(name) {
    this.name = name
  }


  hitTest(iX, iY, corona) {
    var x = this.getAbsoluteX() - this.coronaWidth - this.getWidth() / 2
    var y = this.getAbsoluteY() - this.coronaWidth - this.getHeight() / 2
    var iX2 = x + this.getWidth() + (this.coronaWidth * 2)
    var iY2 = y + this.getHeight() + (this.coronaWidth * 2)

    return (iX >= x && iX <= iX2 && iY >= y && iY <= iY2)
  }

  setGlow(flag) {
    if (flag === true && this.corona === null) {
      this.corona = new Corona(null, null, null);
      this.corona.setDimension(this.getWidth() + (this.getCoronaWidth() * 2), this.getWidth() + (this.getCoronaWidth() * 2))
      this.corona.setPosition(this.getAbsoluteX() - this.getCoronaWidth() - this.getWidth() / 2, this.getAbsoluteY() - this.getCoronaWidth() - this.getHeight() / 2)

      this.corona.setCanvas(this.getCanvas())

      // important inital
      this.corona.getShapeElement()
      this.corona.repaint()
    }
    else if (flag === false && this.corona !== null) {
      this.corona.setCanvas(null)
      this.corona = null
    }

    return this
  }


  createCommand(request) {
    // the port has its own implementation of the CommandMove
    //
    if (request.getPolicy() === CommandType.MOVE) {
      if (!this.isDraggable()) {
        return null
      }
      return new CommandMove(this)
    }

    return null
  }



  fireEvent(event, args) {
    if (this.isInDragDrop === true && event !== "drag") {
      return
    }

    super.fireEvent(event, args);
  }


  getPersistentAttributes() {
    var memento = super.getPersistentAttributes();

    memento.maxFanOut = this.maxFanOut
    memento.name = this.name

    // defined by the locator. Don't persist
    //
    delete memento.x
    delete memento.y

    // ports didn'T have children ports. In this case we
    // delete this attribute as well to avoid confusions.
    //
    delete memento.ports

    return memento
  }


  setPersistentAttributes(memento) {
    super.setPersistentAttributes(memento)

    if (typeof memento.maxFanOut !== "undefined") {
      if (typeof memento.maxFanOut === "number") {
        this.maxFanOut = memento.maxFanOut
      }
      else {
        this.maxFanOut = Math.max(1, parseInt(memento.maxFanOut))
      }
    }
    if (typeof memento.name !== "undefined") {
      this.setName(memento.name)
    }

    return this
  }
}

export class Corona extends Circle {
  constructor(attr, getter, setter) {
    super(attr, setter, getter);
    this.setAlpha(0.3)
    this.setBackgroundColor(new Color(178, 225, 255))
    this.setColor(new Color(102, 182, 252))
  }

  setAlpha(percent: number) {

    super.setAlpha(Math.min(0.3, percent))
    this.setDeleteable(false)
    this.setDraggable(false)
    this.setResizeable(false)
    this.setSelectable(false)

    return this
  }
}