import { Type } from "../../TypeRegistry";
import { Figure } from "../../Figure";
import ArrayList from "../../util/ArrayList";
import extend from "../../util/extend";
import { Locator } from "../../layout/locator/Locator";
import { InputPort } from "../../InputPort";
import { OutputPort } from "../../OutputPort";
import { HybridPort } from "../../HybridPort";
import { Canvas } from "../../Canvas";
import { CommandType } from "../../command/CommandType";

@Type('Node')
export class Node extends Figure {

  private inputPorts = new ArrayList<Port>()
  private outputPorts = new ArrayList()
  private hybridPorts = new ArrayList()
  private cachedPorts: any;
  private persistPorts: boolean;
  private portRelayoutRequired: boolean;

  constructor(attr, setter, getter) {

    super(
      extend({ width: 50, height: 50 }, attr),
      extend({}, setter),
      extend({}, getter));

    this.setterWhitelist['persistPorts'] = this.setPersistPorts;
    this.getterWhitelist['persistPorts'] = this.getPersistPorts;

    this.persistPorts = true

    this.portRelayoutRequired = true

    this.cachedPorts = null
  }


  setPersistPorts(flag: boolean) {
    this.persistPorts = flag
    this.fireEvent("change:persistPorts", { value: this.persistPorts })

    return this
  }

  getPersistPorts() {
    return this.persistPorts;
  }

  toFront(figure: Figure) {
    super.toFront(figure);
    this.getPorts().each((i, port) => {
      port.getConnections().each((i, connection) => connection.toFront(figure))
      port.toFront(this)
    })
    return this;
  }


  toBack(figure: Figure) {
    this.getPorts().each((i, port) => {
      port.getConnections().each((i, connection) => connection.toBack(figure))
      port.toBack(figure)
    });
    return super.toBack(figure);

  }

  setVisible(flag: boolean, duration: number) {
    if (!flag) {
      this.getPorts().each(function (i, port) {
        port.__initialVisibilityState = port.isVisible()
        port.setVisible(false, duration)
      })
    }
    else {
      this.getPorts().each(function (i, port) {
        if (typeof port.__initialVisibilityState !== "undefined") {
          port.setVisible(port.__initialVisibilityState, duration)
        }
        else {
          port.setVisible(true, duration)
        }
        delete port.__initialVisibilityState
      })
    }
    return super.setVisible(flag, duration)
  }
  getPorts(recursive?: boolean) {

    if (typeof recursive === "boolean" && recursive === false) {
      let ports = new ArrayList()
      ports.addAll(this.inputPorts)
      ports.addAll(this.outputPorts)
      ports.addAll(this.hybridPorts)
      return ports
    }

    if (this.cachedPorts === null) {
      this.cachedPorts = new ArrayList()
      this.cachedPorts.addAll(this.inputPorts)
      this.cachedPorts.addAll(this.outputPorts)
      this.cachedPorts.addAll(this.hybridPorts)

        (this.children as unknown as ArrayList<Node>).each((i, e) => {
          this.cachedPorts.addAll(e.figure.getPorts())
        })
    }
    return this.cachedPorts
  }

  getInputPorts() {
    return this.inputPorts
      .clone()
      .addAll(this.hybridPorts)
  }

  getOutputPorts() {
    return this.outputPorts
      .clone()
      .addAll(this.hybridPorts)
  }

  clone(cloneMetaData: { excludeChildren?: boolean, excludePorts?: boolean }) {

    cloneMetaData = extend({ excludePorts: false }, cloneMetaData)

    let clone = super.clone(cloneMetaData)

    if (cloneMetaData.excludePorts === false) {
      clone.resetPorts()
      let ports = this.getPorts(false)

      ports.each(function (i, port) {
        let clonePort = port.clone()
        let locator = port.getLocator().clone()
        clone.addPort(clonePort, locator)
      })
    }

    return clone
  }

  getPort(name: string) {
    return this.getPorts().find(e => e.getName() === name);
  }

  getInputPort(portNameOrIndex: string | Number) {
    if (typeof portNameOrIndex === "number") {
      return this.inputPorts.get(portNameOrIndex)
    }

    for (let i = 0; i < this.inputPorts.getSize(); i++) {
      let port = this.inputPorts.get(i)
      if (port.getName() === portNameOrIndex) {
        return port
      }
    }
    return null;
  }

  getOutputPort(portNameOrIndex: string | number) {
    if (typeof portNameOrIndex === "number") {
      return this.outputPorts.get(portNameOrIndex)
    }

    for (let i = 0; i < this.outputPorts.getSize(); i++) {
      let port = this.outputPorts.get(i)
      if (port.getName() === portNameOrIndex) {
        return port
      }
    }

    return null
  }

  getHybridPort(portNameOrIndex: string | number) {
    if (typeof portNameOrIndex === "number") {
      return this.hybridPorts.get(portNameOrIndex)
    }

    for (let i = 0; i < this.hybridPorts.getSize(); i++) {
      let port = this.hybridPorts.get(i)
      if (port.getName() === portNameOrIndex) {
        return port
      }
    }

    return null
  }

  addPort(port: Port, locator: Locator) {
    if (!(port instanceof Port)) {
      throw "Argument is not typeof 'Port'. \nFunction: Node#addPort"
    }

    if (this.cachedPorts !== null) {
      this.cachedPorts.add(port)
    }
    this.portRelayoutRequired = true

    if (port instanceof InputPort) {
      this.inputPorts.add(port)
    }
    else if (port instanceof OutputPort) {
      this.outputPorts.add(port)
    }
    else if (port instanceof HybridPort) {
      this.hybridPorts.add(port)
    }

    if ((typeof locator !== "undefined") && (locator instanceof Locator)) {
      port.setLocator(locator)
    }

    port.setParent(this)
    port.setCanvas(this.canvas)


    port.setDeleteable(false)

    if (this.canvas !== null) {
      port.getShapeElement()
      this.canvas.registerPort(port)
    }

    return port
  }
  resetPorts() {
    this.getPorts().each((i, port) => this.removePort(port))
    return this
  }

  removePort(port: Port) {
    this.portRelayoutRequired = true

    this.cachedPorts = null
    this.inputPorts.remove(port)
    this.outputPorts.remove(port)
    this.hybridPorts.remove(port)

    if (port.getCanvas() !== null) {
      port.getCanvas().unregisterPort(port)
      let connections = port.getConnections()
      for (let i = 0; i < connections.getSize(); ++i) {
        port.getCanvas().remove(connections.get(i))
      }
    }

    port.setCanvas(null)

    return this
  }

  createPort(type: string, locator: Locator) {
    let newPort: port = null
    let count = 0
    switch (type) {
      case "input":
        newPort = new InputPort();
        count = this.inputPorts.getSize()
        break
      case "output":
        newPort = new OutputPort();
        count = this.outputPorts.getSize()
        break
      case "hybrid":
        newPort = new HybridPort();
        count = this.hybridPorts.getSize()
        break
      default:
        throw "Unknown type [" + type + "] of port requested"
    }

    newPort.setName(type + count)

    this.addPort(newPort, locator)
    this.setDimension(this.width, this.height)

    return newPort

  }

  getConnections() {
    let connections = new ArrayList();
    let ports = this.getPorts()
    for (let i = 0; i < ports.getSize(); i++) {
      let port = ports.get(i)
      // Do NOT add twice the same connection if it is linking ports from the same node
      for (let c = 0, c_size = port.getConnections().getSize(); c < c_size; c++) {
        if (!connections.contains(port.getConnections().get(c))) {
          connections.add(port.getConnections().get(c))
        }
      }
    }
    return connections
  }

  setCanvas(canvas: Canvas) {
    let oldCanvas = this.canvas;
    super.setCanvas(canvas);
    let ports = this.getPorts()
    if (oldCanvas !== null) {
      ports.each((i, port) => oldCanvas.unregisterPort(port))
    }

    if (canvas !== null) {
      ports.each((i, port) => {
        port.setCanvas(canvas)
        canvas.registerPort(port)
      })
      this.setDimension(this.width, this.height)
    }
    else {
      ports.each((i, port) => port.setCanvas(null))
    }
    return this;
  }

  setRotationAngle(angle: number) {
    this.portRelayoutRequired = true
    super.setRotationAngle(angle)

    this.layoutPorts()

    return this
  }

  setDimension(w, h) {
    this.portRelayoutRequired = true;
    return super.setDimension(w, h);
  }


  onPortValueChanged(relatedPort) {

  }

  repaint(attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
      return
    }
    super.repaint(attributes);
    this.layoutPorts();
  }

  layoutPorts() {
    if (this.portRelayoutRequired === false) {
      return //silently
    }
    this.portRelayoutRequired = false

    this.outputPorts.each((i, port) => port.locator.relocate(i, port))
    this.inputPorts.each((i, port) => port.locator.relocate(i, port))
    this.hybridPorts.each((i, port) => port.locator.relocate(i, port))

    return this
  }

  createCommand(request) {
    if (request === null) {
      return null
    }

    if (request.getPolicy() === CommandType.ROTATE) {
      return new CommandRotate(this, (this.getRotationAngle() + 90) % 360)
    }

    return super.createCommand(request);
  }

  getPersistentAttributes() {
    let memento = super.getPersistentAttributes();
    if (this.persistPorts === true) {
      memento.ports = []
      this.getPorts().each(function (i, port) {
        memento.ports.push(extend(port.getPersistentAttributes(), {
          name: port.getName(),
          port: port.NAME,
          locator: port.getLocator().NAME
        }))
      })
    }

    return memento
  }


  setPersistentAttributes(memento) {
    super.setPersistentAttributes(memento);

    if (typeof memento.ports !== "undefined") {
      // we read the ports from the JSON and now we save it to the JSON too.
      this.persistPorts = true

      // remove all ports created in the init method
      //
      this.resetPorts()

      // and restore all ports of the JSON document instead.
      //
      memento.ports.forEach((e) => {
        let port = eval("new " + e.port + "()")
        let locator = eval("new " + e.locator + "()")
        port.setPersistentAttributes(e)
        this.addPort(port, locator)
        port.setName(e.name)
      })
    }

    return this
  }
}