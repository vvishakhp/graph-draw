import { RectangleShape } from "../basic/Rectangle";
import { Type } from "../../TypeRegistry";
import { Color } from "../../util/Color";
import extend from "../../util/extend";
import { CenterLocator } from "../../layout/locator/CenterLocator";
import { Direction } from "../../geo/Rectangle";
import { Label } from "../basic/Label";
import { ShortesPathConnectionAnchor } from "../../layout/anchor/ShortesPathConnectionAnchor";

@Type('Hub')
export class Hub extends RectangleShape {
  DEFAULT_COLOR = new Color(77, 240, 254);
  BACKGROUND_COLOR = new Color(41, 170, 119);
  label: any;
  port: import("d:/Projects/CanvasPOC/graph-draw/src/Port").Port;
  CONNECTION_DIR_STRATEGY: ((peerPort: any) => any)[];
  static anchor: any;

  constructor(attr, setter, getter) {
    super(extend({
      color: new Color(77, 240, 254),
      bgColor: new Color(41, 170, 119)
    }, attr), setter, getter);

    this.setterWhitelist = extend(this.setterWhitelist, {
      label: this.setLabel,
      text: this.setLabel
    }, setter);

    this.getterWhitelist = extend(this.getterWhitelist, {
      label: this.getLabel,
      text: this.getLabel
    }, getter);

    this.label = null

    let _port = this.port = this.createPort("hybrid", new CenterLocator())

    this.CONNECTION_DIR_STRATEGY = [function (peerPort) {
      return _port.getParent().getBoundingBox().getDirection(peerPort.getAbsolutePosition())
    },
    function (peerPort) {
      return _port.getAbsoluteY() > peerPort.getAbsoluteY() ? Direction.DIRECTION_UP : Direction.DIRECTION_DOWN
    },
    function (peerPort) {
      return _port.getAbsoluteX() > peerPort.getAbsoluteX() ? Direction.DIRECTION_LEFT : Direction.DIRECTION_RIGHT
    }];

    (this.port as any)._orig_hitTest = this.port.hitTest
    this.port.hitTest = this.hitTest.bind(this)


    this.port.setConnectionAnchor(new ShortesPathConnectionAnchor(this.port))
    this.port.setVisible(false, null)
    this.port.setVisible = (f, d) => { return this.port }

    this.setConnectionDirStrategy(0)

  }

  getLabel() {
    return this.label;
  }

  delegateTarget(draggedFigure) {
    return this.getHybridPort(0).delegateTarget(draggedFigure)
  }


  getMinWidth() {
    if (this.label !== null) {
      return Math.max(this.label.getMinWidth(), super.getMinWidth())
    }
    return super.getMinWidth()
  }


  repaint(attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
      return
    }

    attributes = attributes || {}

    // set some good defaults if the parent didn't
    if (typeof attributes.fill === "undefined") {
      if (this.bgColor !== null) {
        attributes.fill = "90-" + this.bgColor.hash() + ":5-" + this.bgColor.lighter(0.3).hash() + ":95"
      } else {
        attributes.fill = "none"
      }
    }

    return super.repaint(attributes)
  }


  setLabel(label) {
    if (this.label === null) {
      let _this = this

      this.label = new Label({
        text: label,
        color: "#0d0d0d",
        fontColor: "#0d0d0d",
        stroke: 0
      }, {}, {})

      this.add(this.label, new CenterLocator())
      this.label.setSelectionAdapter(function () {
        return _this
      })
      this.label.delegateTarget = function () {
        return _this.port
      }
    } else {
      this.label.setText(label)
    }

  }


  setConnectionDirStrategy(strategy) {
    switch (strategy) {
      case 0:
      case 1:
      case 2:
        this.port.getConnectionDirection = this.CONNECTION_DIR_STRATEGY[strategy]
        break
    }
  }


  getPersistentAttributes() {
    let memento = super.getPersistentAttributes()

    memento.dirStrategy = this.CONNECTION_DIR_STRATEGY.indexOf(this.port.getConnectionDirection)
    if (this.label !== null) {
      memento.label = this.label.getText()
    }

    return memento
  }

  setPersistentAttributes(memento) {
    super.setPersistentAttributes(memento)

    if (typeof memento.dirStrategy === "number") {
      this.setConnectionDirStrategy(memento.dirStrategy)
    }

    if (typeof memento.label !== "undefined") {
      this.setLabel(memento.label)
    }
    return this;
  }

}
