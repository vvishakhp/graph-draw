/// TODO

import UUID from './util/UUID'
import extend from './util/extend';
import jsonUtil from './util/JSONUtil';
import { Point } from './geo/Point';
import { Canvas } from './Canvas';
import ArrayList from './util/ArrayList';
import { Type } from './TypeRegistry';

@Type('Figure')
export class Figure {

  private setterWhitelist: any;
  private getterWhitelist: any;

  private id = UUID();
  private isResizeHandle = false;
  private command = null;
  private canvas: Canvas = null;
  private shape = null;
  private children = new ArrayList<Figure>();
  private visible = true;

  private keepAspectRatio = false;
  private canSnapToHelper = true;
  private snapToGridAnchor = new Point(0, 0);
  private editPolicy = new ArrayList();

  private timerId = -1;
  private timerInterval = 0;

  private parent = null;
  private composite = null;

  private x = 0;
  private y = 0;
  private minHeight = 5;
  private minWidth = 5;
  private rotationAngle = 0;

  private cssClass: string;

  private width = this.getMinWidth();
  private height = this.getMinHeight();
  private panningDelegate = null;

  private eventSubscriptions: any = {};


  private alpha = 1.0;

  isInDragDrop = false;

  private ox = 0;
  private oy = 0;
  private repaintBlocked = true;
  private lastAppliedAttributes: any = {};

  private selectionHandles = new ArrayList();

  relocateChildrenEventCallback: () => void;

  private defaultSelectionAdapter: () => Figure;

  constructor(attr, setter, getter) {
    this.cssClass = ((this as any).NAME as string).replace(new RegExp("[.]", "g"), "_");
    this.relocateChildrenEventCallback = () => {
      this.children.each((i, e) => {
        e.locator.relocate(i, e.figure)
      })
    }
    this.setterWhitelist = extend({

      id: this.setId,
      x: this.setX,
      y: this.setY,
      width: this.setWidth,
      height: this.setHeight,
      boundingBox: this.setBoundingBox,
      minWidth: this.setMinWidth,
      minHeight: this.setMinHeight,
      cssClass: this.setCssClass,
      userData: this.setUserData,
      resizeable: this.setResizeable,
      selectable: this.setSelectable,
      angle: this.setRotationAngle,
      alpha: this.setAlpha,
      opacity: this.setAlpha,
      glow: this.setGlow,
      visible: this.setVisible,
      keepAspectRatio: this.setKeepAspectRatio
    }, setter)

    this.getterWhitelist = extend({
      id: this.getId,
      visible: this.isVisible,
      angle: this.getRotationAngle,
      x: this.getX,
      y: this.getY,
      width: this.getWidth,
      height: this.getHeight,
      resizeable: this.isResizeable,
      selectable: this.isSelectable,
      alpha: this.getAlpha,
      opacity: this.getAlpha
    }, getter)

  }


  public getId() {
    return this.id;
  }

  public setId(id: string) {
    this.id = id;
    return this;
  }

  public setX(x: number) {
    this.setPosition(parseFloat(x + ''), this.y)
    this.fireEvent("change:x", { value: this.x })

    return this;
  }

  public setY(y: number) {
    this.setPosition(this.x, parseFloat(y))
    this.fireEvent("change:y", { value: this.y })

    return this
  }

  setPosition(x: number | Point, y: number) {
    if (typeof x === "undefined") {
      debugger
    }

    let oldPos = { x: this.x, y: this.y }

    if (x instanceof Point) {
      this.x = x.getX();
      this.y = x.getY();
    }
    else {
      this.x = x
      this.y = y
    }

    this.editPolicy.each((i, e) => {
      if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
        let newPos = e.adjustPosition(this, this.x, this.y)
        this.x = newPos.x
        this.y = newPos.y
      }
    })

    this.repaint()


    // Update the resize handles if the user change the position of the
    // element via an API call.
    //
    this.editPolicy.each((i, e) => {
      if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
        e.moved(this.canvas, this)
      }
    })


    let event = { figure: this, dx: this.x - oldPos.x, dy: this.y - oldPos.y }
    this.fireEvent("move", event)
    this.fireEvent("change:x", event)
    this.fireEvent("change:y", event)

    return this
  }

  setPersistentAttributes(memento) {
    this.id = memento.id
    this.setPosition(parseFloat(memento.x), parseFloat(memento.y))

    if (typeof memento.width !== "undefined") {
      this.width = parseFloat(memento.width)
    }

    if (typeof memento.height !== "undefined") {
      this.height = parseFloat(memento.height)
    }

    if (typeof memento.userData !== "undefined") {
      this.userData = memento.userData
    }

    if (typeof memento.cssClass !== "undefined") {
      this.setCssClass(memento.cssClass)
    }

    if (typeof memento.alpha !== "undefined") {
      this.setAlpha(parseFloat(memento.alpha))
    }

    if (typeof memento.angle !== "undefined") {
      this.rotationAngle = parseFloat(memento.angle)
    }

    return this
  }

}
