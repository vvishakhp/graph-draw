import { Type, createInstenceFromType } from './TypeRegistry';
import ArrayList from './util/ArrayList';
import { Canvas } from './Canvas';
import { Locator } from './layout/locator/Locator';
import extend from './util/extend';
import UUID from './util/UUID';
import { Point } from './geo/Point';
import jsonUtil from './util/JSONUtil';
import { DragDropEditPolicy } from './policy/figure/DragDropEditPolicy';
import { Rectangle } from './geo/Rectangle';
import { RectangleSelectionFeedbackPolicy } from './policy/figure/RectangleSelectionFeedbackPolicy';
import { SelectionPolicy } from './policy/figure/SelectionPolicy';
import { SelectionFeedbackPolicy } from './policy/figure/SelectionFeedbackPolicy';
import { CommandType } from './command/CommandType';
import { CommandMove } from './command/CommandMove';

export interface AttributeCollection {
  [key: string]: any;
}

@Type('Figure')
export class Figure {

  MIN_TIMER_INTERVAL = 50;

  setterWhitelist: any;
  getterWhitelist: any;
  id: string;
  isResizeHandle: boolean;
  command: any;
  canvas: Canvas;
  shape: any;
  children: ArrayList<Figure>;
  selectable: boolean;
  deleteable: boolean;
  resizeable: boolean;
  draggable: boolean;
  visible: boolean;
  keepAspectRatio: boolean;
  canSnapToHelper: boolean;
  snapToGridAnchor: any;
  editPolicy: ArrayList<any>;
  timerId: number;
  timerInterval: number;
  parent: any;
  composite: any;
  userData: any;
  x: number;
  y: number;
  minHeight: number;
  minWidth: number;
  rotationAngle: number;
  cssClass: any;
  NAME: any;
  width: any;
  height: any;
  alpha: number;
  isInDragDrop: boolean;
  ox: number;
  oy: number;
  repaintBlocked: boolean;
  lastAppliedAttributes: {};
  selectionHandles: any;
  panningDelegate: any;
  eventSubscriptions: {};
  relocateChildrenEventCallback: () => void;
  defaultSelectionAdapter: () => this;
  selectionAdapter: () => this;
  locator: Locator;
  originalAlpha: number;
  isMoving: boolean;

  figure: Figure = this;
  _inEvent: boolean = false;

  constructor(attr, setter, getter) {
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

    let _this = this
    this.id = UUID()
    this.isResizeHandle = false
    this.command = null
    this.canvas = null
    this.shape = null
    this.children = new ArrayList<Figure>()
    this.selectable = true
    this.deleteable = true
    this.resizeable = true
    this.draggable = true
    this.visible = true
    this.keepAspectRatio = false
    this.canSnapToHelper = true
    this.snapToGridAnchor = new Point(0, 0)
    this.editPolicy = new ArrayList()
    this.timerId = -1
    this.timerInterval = 0
    this.parent = null
    this.composite = null
    this.userData = null
    this.x = 0
    this.y = 0
    this.minHeight = 5
    this.minWidth = 5
    this.rotationAngle = 0
    this.cssClass = this.NAME.replace(new RegExp("[.]", "g"), "_")

    this.width = this.getMinWidth()
    this.height = this.getMinHeight()

    this.alpha = 1.0
    this.isInDragDrop = false

    this.ox = 0
    this.oy = 0
    this.repaintBlocked = false
    this.lastAppliedAttributes = {}
    this.selectionHandles = new ArrayList()
    this.panningDelegate = null
    this.eventSubscriptions = {}

    this.relocateChildrenEventCallback = () => {
      this.children.each((i, e) => {
        e.locator.relocate(i, e.figure)
      })
    }
    this.defaultSelectionAdapter = this.selectionAdapter = () => this
    this.installEditPolicy(new RectangleSelectionFeedbackPolicy())
    this.attr(attr)
  }

  attr(name: any, value?: any) {
    let orig = this.repaintBlocked
    try {
      if ($.isPlainObject(name)) {
        for (let key in name) {
          if (key.substring(0, 9) === "userData.") {
            if (this.userData === null) {
              this.userData = {}
            }
            jsonUtil.set({ userData: this.userData }, key, name[key])
            this.fireEvent("change:" + key, { value: name[key] })
          }
          else {
            let func = this.setterWhitelist[key]
            let param = name[key]
            if (func && param !== undefined) {
              func.call(this, param)
            }
            else if (typeof name[key] === "function") {
              this[key] = param.bind(this)
            }
          }
        }
      }
      else if (typeof name === "string") {
        if (typeof value === "undefined") {
          let getter = this.getterWhitelist[name]
          if (typeof getter === "function") {
            return getter.call(this)
          }
          else if (name.substring(0, 9) === "userData.") {
            let data = { userData: this.userData }
            return jsonUtil.get(data, name)
          }
          return
        }
        if (typeof value === "function") {
          value = value()
        }
        if (name.substring(0, 9) === "userData.") {
          if (this.userData === null) {
            this.userData = {}
          }
          jsonUtil.set({ userData: this.userData }, name, value)
          this.fireEvent("change:" + name, { value: value })
        }
        else {
          let setter = this.setterWhitelist[name]
          if (setter) {
            setter.call(this, value)
          }
        }
      }
      else if (Array.isArray(name)) {
        return Object.assign({}, ...Object.keys(name).map(k => ({ [k]: this.attr(k) })))
      }
      else if (typeof name === "undefined") {
        let result = {}
        for (let key in this.getterWhitelist) {
          result[key] = this.getterWhitelist[key].call(this)
        }
        return result
      }
    }
    finally {
      this.repaintBlocked = orig
    }
    return this
  }

  pick(obj, var_keys) {
    let keys = typeof arguments[1] !== 'string' ? arguments[1] : Array.prototype.slice.call(arguments, 1)
    let out = {}, key
    for (key in keys) {
      if (typeof obj[key] !== "undefined")
        out[key] = obj[key]
    }
    return out
  }

  select(asPrimarySelection) {
    if (typeof asPrimarySelection === "undefined") {
      asPrimarySelection = true
    }
    this.editPolicy.each(function (i, e) {
      if (e instanceof SelectionPolicy) {
        e.onSelect(this.canvas, this, asPrimarySelection)
      }
    });

    if (this.canvas !== null) {
      this.canvas.getSelection().add(this)
    }

    return this
  }

  unselect() {
    this.editPolicy.each(function (i, e) {
      if (e instanceof SelectionPolicy) {
        e.onUnselect(this.canvas, this)
      }
    })

    if (this.canvas !== null) {
      this.canvas.getSelection().remove(this)
    }

    return this
  }

  setSelectionAdapter(adapter) {
    if (adapter == null) {
      this.selectionAdapter = this.defaultSelectionAdapter
    }
    else {
      this.selectionAdapter = adapter
    }

    return this
  }

  getSelectionAdapter() {
    return this.selectionAdapter;
  }

  isSelected() {
    if (this.canvas !== null) {
      return this.canvas.getSelection().contains(this);
    }

    return false;
  }

  setUserData(object: any) {
    this.userData = object;
    this.fireEvent("change:userData", { value: object })
    return this;
  }

  getUserData() {
    return this.userData;
  }

  getId() {
    return this.id;
  }

  setId(newId: string) {
    this.id = newId;
    return this;
  }

  getCssClass() {
    return this.cssClass;
  }

  setCssClass(cssClass) {
    this.cssClass = cssClass === null ? null : cssClass.trim();
    if (this.shape === null) {
      return this
    }

    if (this.cssClass === null) {
      this.shape.node.removeAttribute("class")
    }
    else {
      this.shape.node.setAttribute("class", this.cssClass)
    }
    this.fireEvent("change:cssClass", { value: this.cssClass })

    return this
  }

  hasCssClass(className) {
    if (this.cssClass === null) {
      return false
    }

    return new RegExp(' ' + className.trim() + ' ').test(' ' + this.cssClass + ' ')
  }

  addCssClass(className) {
    className = className.trim()
    if (!this.hasCssClass(className)) {
      if (this.cssClass === null) {
        this.setCssClass(className)
      }
      else {
        this.setCssClass(this.cssClass + ' ' + className)
      }
      this.fireEvent("change:cssClass", { value: this.cssClass })
    }

    return this
  }

  removeCssClass(className) {
    className = className.trim()
    let newClass = ' ' + this.cssClass.replace(/[\t\r\n]/g, ' ') + ' '
    if (this.hasCssClass(className)) {
      while (newClass.indexOf(' ' + className + ' ') >= 0) {
        newClass = newClass.replace(' ' + className + ' ', ' ')
      }
      this.setCssClass(newClass.replace(/^\s+|\s+$/g, ''))
      this.fireEvent("change:cssClass", { value: this.cssClass })
    }

    return this
  }

  toggleCssClass(className) {
    className = className.trim()
    let newClass = ' ' + this.cssClass.replace(/[\t\r\n]/g, ' ') + ' '
    if (this.hasCssClass(className)) {
      while (newClass.indexOf(' ' + className + ' ') >= 0) {
        newClass = newClass.replace(' ' + className + ' ', ' ')
      }
      this.setCssClass(newClass.replace(/^\s+|\s+$/g, ''))
    } else {
      this.setCssClass(this.cssClass + ' ' + className)
    }
    this.fireEvent("change:cssClass", { value: this.cssClass })

    return this
  }

  setCanvas(canvas: Canvas) {
    if (canvas === null && this.shape !== null) {
      if (this.isSelected()) {
        this.unselect()
      }
      this.shape.remove()
      this.shape = null
    }

    this.canvas = canvas

    if (this.canvas !== null) {
      this.getShapeElement()
    }

    this.lastAppliedAttributes = {}


    if (canvas === null) {
      this.stopTimer()
    }
    else {
      if (this.timerInterval >= this.MIN_TIMER_INTERVAL) {
        this.startTimer(this.timerInterval)
      }
    }

    this.children.each(function (i, e) {
      e.figure.setCanvas(canvas)
    })

    return this
  }

  getCanvas() {
    return this.canvas;
  }

  startTimer(milliSeconds) {
    this.stopTimer()
    this.timerInterval = Math.max(this.MIN_TIMER_INTERVAL, milliSeconds)

    if (this.canvas !== null) {
      this.timerId = window.setInterval(() => {
        this.onTimer()
        this.fireEvent("timer")
      }, this.timerInterval)
    }

    return this
  }

  stopTimer() {
    if (this.timerId >= 0) {
      window.clearInterval(this.timerId)
      this.timerId = -1
    }

    return this
  }

  onTimer() {

  }

  toFront(figure: Figure) {
    if (this.composite instanceof StrongComposite && (typeof figure !== "undefined")) {
      let indexFigure = figure.getZOrder()
      let indexComposite = this.composite.getZOrder()
      if (indexFigure < indexComposite) {
        figure = this.composite
      }
    }

    if (typeof figure === "undefined") {
      this.getShapeElement().toFront()

      if (this.canvas !== null) {
        let figures = this.canvas.getFigures()
        let lines = this.canvas.getLines()
        if (figures.remove(this) !== null) {
          figures.add(this)
        } else if (lines.remove(this) !== null) {
          lines.add(this)
        }
      }
    }
    else {
      this.getShapeElement().insertAfter(figure.getTopLevelShapeElement())

      if (this.canvas !== null) {
        let figures = this.canvas.getFigures()
        let lines = this.canvas.getLines()
        if (figures.remove(this) !== null) {
          let index = figures.indexOf(figure)
          figures.insertElementAt(this, index + 1)
        } else if (lines.remove(this) !== null) {
          lines.add(this)
        }
      }
    }
    let _this = this
    this.children.each(function (i, child) {
      child.figure.toFront(_this)
    })
    this.selectionHandles.each(function (i, handle) {
      handle.toFront()
    })

    return this
  }

  toBack(figure: Figure) {
    if (this.composite instanceof StrongComposite) {
      this.toFront(this.composite)
      return
    }

    if (this.canvas !== null) {
      let figures = this.canvas.getFigures()
      let lines = this.canvas.getLines()
      if (figures.remove(this) !== null) {
        figures.insertElementAt(this, 0)
      } else if (lines.remove(this) !== null) {
        lines.insertElementAt(this, 0)
      }
      if (typeof figure !== "undefined") {
        this.getShapeElement().insertBefore(figure.getShapeElement())
      }
      else {
        this.getShapeElement().toBack()
      }
    }

    // Bring all children in front of "this" figure
    //
    let _this = this
    this.children.each(function (i, child) {
      child.figure.toFront(_this)
    }, true)

    return this
  }

  installEditPolicy(policy) {
    if (policy instanceof SelectionFeedbackPolicy) {
      this.editPolicy.grep((p) => {
        let stay = !(p instanceof SelectionFeedbackPolicy)
        if (!stay) {

          p.onUninstall(this)
        }
        return stay
      })
    }
    policy.onInstall(this)
    this.editPolicy.add(policy)

    return this
  }

  uninstallEditPolicy(policy) {
    let removedPolicy = this.editPolicy.remove(policy)
    if (removedPolicy !== null) {
      removedPolicy.onUninstall(this)
      return
    }

    let _this = this
    let name = (typeof policy === "string") ? policy : policy.NAME
    this.editPolicy.grep((p) => {
      if (p.NAME === name) {
        p.onUninstall(_this)
        return false
      }
      return true
    })
  }

  add(child: Figure, locator: Locator, index: number) {
    if (typeof locator === "undefined" || locator === null) {
      throw "Second parameter 'locator' is required for method 'Figure#add'"
    }


    child.setParent(this)

    locator.bind(this, child)

    child.on("resize", this.relocateChildrenEventCallback)

    if (!isNaN(parseInt(index + ''))) {
      this.children.insertElementAt({ figure: child, locator: locator }, index)
    }
    else {
      this.children.add({ figure: child, locator: locator })
    }

    if (this.canvas !== null) {
      child.setCanvas(this.canvas)
    }

    this.repaint()

    return this
  }

  remove(child: Figure) {
    if (typeof child === "undefined" || child === null) {
      console.warn("The parameter child is required for Figure.remove")
      return null
    }

    let removed = null
    this.children.grep(function (e) {
      let stay = e.figure !== child
      if (!stay) {
        removed = e
      }
      return stay
    })

    if (removed !== null) {
      child.setParent(null)
      child.setCanvas(null)
      removed.locator.unbind(this, child)
      child.off(this.relocateChildrenEventCallback)

      this.repaint()
      return removed
    }

    return null
  }

  getChildren() {
    return this.children.clone().map(e => e.figure);
  }

  resetChildren() {
    this.children.each(function (i, e) {
      e.figure.setCanvas(null)
    })
    this.children = new ArrayList()
    this.repaint()

    return this
  }

  getShapeElement() {
    if (this.shape !== null) {
      return this.shape
    }

    this.shape = this.createShapeElement()
    if (!this.isVisible()) {
      this.shape.hide()
    }

    // add CSS class to enable styling of the element with CSS rules/files
    //
    if (this.cssClass !== null) {
      this.shape.node.setAttribute("class", this.cssClass)
    }

    return this.shape
  }

  getTopLevelShapeElement() {
    return this.getShapeElement()

  }

  createShapeElement() {
    throw new Error('Must override this method');
  }

  repaint(attributes?) {
    if (this.repaintBlocked === true || this.shape === null) {
      return this
    }
    let _this = this
    attributes = attributes || {}


    if (this.visible === true) {
      if (this.shape.isVisible() === false) {
        if (!isNaN(parseFloat(attributes.visibleDuration))) {
          $(this.shape.node).fadeIn(attributes.visibleDuration, function () {
            _this.shape.show()
          })
        }
        else {
          this.shape.show()
        }
      }
    }
    else {
      if (this.shape.isVisible() === true) {
        if (!isNaN(parseFloat(attributes.visibleDuration))) {
          $(this.shape.node).fadeOut(attributes.visibleDuration, function () {
            _this.shape.hide()
          })
        }
        else {
          this.shape.hide()
        }
      }
      return this
    }
    attributes.opacity = this.alpha
    attributes = jsonUtil.flatDiff(attributes, this.lastAppliedAttributes)
    this.lastAppliedAttributes = attributes


    if (Object.getOwnPropertyNames(attributes).length > 0) {
      this.shape.attr(attributes)
    }

    this.applyTransformation()
    this.children.each(function (i, e) {
      e.locator.relocate(i, e.figure)
    })

    return this
  }

  applyTransformation() {
    return this;
  }

  setGlow(flag: boolean) {
    return this;
  }

  getHandleBBox() {
    return null;
  }

  onDragStart(x, y, shiftKey, ctrlKey) {
    this.isInDragDrop = false

    let bbox = this.getHandleBBox()
    if (bbox !== null && bbox.translate(this.getAbsolutePosition().scale(-1)).hitTest(x, y) === false) {

      this.panningDelegate = this.getBestChild(this.getX() + x, this.getY() + y)
      if (this.panningDelegate !== null) {
        this.panningDelegate.onDragStart(x - this.panningDelegate.x, y - this.panningDelegate.y, shiftKey, ctrlKey)
      }
      return false
    }


    this.command = this.createCommand(new CommandType(CommandType.MOVE))

    if (this.command !== null) {
      this.ox = this.getX()
      this.oy = this.getY()
      this.isInDragDrop = true

      // notify all installed policies
      //
      let _this = this
      let canStartDrag = true

      this.editPolicy.each(function (i, e) {
        if (e instanceof DragDropEditPolicy) {
          canStartDrag = canStartDrag && e.onDragStart(_this.canvas, _this, x, y, shiftKey, ctrlKey)
        }
      })

      if (canStartDrag) {
        // fire an event
        // @since 5.3.3
        this.fireEvent("dragstart", { x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey })
      }
      return canStartDrag
    }

    return false
  }

  onDrag(dx, dy, dx2, dy2, shiftKey, ctrlKey) {
    // apply all EditPolicy for DragDrop Operations
    //
    this.editPolicy.each((i, e) => {
      if (e instanceof DragDropEditPolicy) {
        let newPos = e.adjustPosition(this, this.ox + dx, this.oy + dy)
        if (newPos) {
          dx = newPos.getX() - this.ox
          dy = newPos.getY() - this.oy
        }
      }
    })

    let newPos = new Point(this.ox + dx, this.oy + dy)

    if (this.getCanSnapToHelper()) {
      newPos = this.getCanvas().snapToHelper(this, newPos)
    }


    this.setPosition(newPos)

    // notify all installed policies
    //
    this.editPolicy.each((i, e) => {
      if (e instanceof DragDropEditPolicy) {
        e.onDrag(this.canvas, this)
      }
    })


    // fire an event
    // @since 5.3.3
    this.fireEvent("drag", { dx: dx, dy: dy, dx2: dx2, dy2: dy2, shiftKey: shiftKey, ctrlKey: ctrlKey })
  }

  onPanning(dx, dy, dx2, dy2, shiftKey, ctrlKey) {

  }

  onPanningEnd() {
  }

  onDragEnd(x, y, shiftKey, ctrlKey) {

    if (this.command !== null) {
      this.command.setPosition(this.x, this.y)
      this.canvas.getCommandStack().execute(this.command)
      this.command = null
    }
    this.isInDragDrop = false
    this.panningDelegate = null


    this.editPolicy.each((i, e) => {
      if (e instanceof DragDropEditPolicy) {
        e.onDragEnd(this.canvas, this, x, y, shiftKey, ctrlKey)
      }
    })

    this.fireEvent("move", { figure: this, dx: 0, dy: 0 })
    this.fireEvent("change:x", { figure: this, dx: 0 })
    this.fireEvent("change:y", { figure: this, dy: 0 })


    this.fireEvent("dragend", { x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey })
  }


  delegateTarget(draggedFigure: Figure) {

    let delegate = draggedFigure
    this.getCanvas().getDropInterceptorPolicies().each((i, policy) => {
      delegate = policy.delegateTarget(draggedFigure, this)
      if (delegate !== null) {
        return false // break the loop
      }
    })

    return delegate
  }


  onDragEnter(draggedFigure) {
  }


  onDragLeave(draggedFigure) {
  }


  onDrop(dropTarget, x, y, shiftKey, ctrlKey) {
  }

  onCatch(droppedFigure, x, y, shiftKey, ctrlKey) {
  }


  onMouseEnter() {
  }


  onMouseLeave() {
  }


  onDoubleClick() {
  }


  onClick() {
  }


  onContextMenu(x, y) {
  }


  setAlpha(percent) {
    percent = Math.min(1, Math.max(0, parseFloat(percent)))
    if (percent === this.alpha) {
      return
    }

    this.alpha = percent
    this.repaint()
    this.fireEvent("change:opacity", { value: this.alpha })

    return this
  }


  getAlpha() {
    return this.alpha
  }

  setRotationAngle(angle) {
    this.rotationAngle = angle

    // Update the resize handles if the user change the position of the element via an API call.
    //
    this.editPolicy.each((i, e) => {
      if (e instanceof DragDropEditPolicy) {
        e.moved(this.canvas, this)
      }
    })

    this.fireEvent("change:angle", { value: this.rotationAngle })
    this.repaint()

    return this
  }

  getRotationAngle() {
    return this.rotationAngle
  }


  setVisible(flag, duration) {
    flag = !!flag
    if (flag === this.visible) {
      return
    }
    this.visible = flag

    this.repaint({ visibleDuration: duration })

    if (this.visible) {
      this.fireEvent("show")
    } else {
      this.fireEvent("hide")
    }
    this.fireEvent("change:visibility", { value: this.visible })

    return this
  }


  isVisible() {
    return this.visible && this.shape !== null
  }

  setKeepAspectRatio(flag) {
    this.keepAspectRatio = flag

    return this
  }

  getKeepAspectRatio() {
    return this.keepAspectRatio
  }

  getZOrder() {
    if (this.shape === null) {
      return -1
    }

    let i = 0
    let child = this.shape.node
    while ((child = child.previousSibling) !== null) {
      i++
    }
    return i
  }

  setCanSnapToHelper(flag) {
    this.canSnapToHelper = !!flag

    return this
  }

  getCanSnapToHelper() {
    return this.canSnapToHelper
  }

  getSnapToGridAnchor() {
    return this.snapToGridAnchor
  }

  setSnapToGridAnchor(point) {
    this.snapToGridAnchor = point

    return this
  }

  setWidth(width) {
    this.setDimension(parseFloat(width), this.getHeight())
    this.fireEvent("change:width", { value: this.width })

    return this
  }

  getWidth() {
    return this.width
  }

  setHeight(height) {
    this.setDimension(this.getWidth(), parseFloat(height))
    this.fireEvent("change:height", { value: this.height })

    return this
  }

  getHeight() {
    return this.height
  }


  getMinWidth() {
    return this.minWidth
  }

  setMinWidth(w) {
    this.minWidth = parseFloat(w)
    this.fireEvent("change:minWidth", { value: this.minWidth })

    // fit the width with the new constraint
    this.setWidth(this.getWidth())

    return this
  }

  /**
   * @method
   * This value is relevant for the interactive resize of the figure.
   *
   * @return {Number} Returns the min. height of this object.
   */
  getMinHeight() {
    return this.minHeight
  }

  /**
   * @method
   * Set the minimum height of the figure.
   *
   * @param {Number} h
   */
  setMinHeight(h) {
    this.minHeight = parseFloat(h)
    this.fireEvent("change:minHeight", { value: this.minHeight })

    // fit the height with the new constraint
    this.setHeight(this.getHeight())

    return this
  }


  /**
   * @method
   * the the x-offset related to the parent figure or canvas
   *
   * @param {Number} x the new x offset of the figure
   * @since 5.0.8
   */
  setX(x) {
    this.setPosition(parseFloat(x), this.y)
    this.fireEvent("change:x", { value: this.x })

    return this
  }

  /**
   * @method
   * The x-offset related to the parent figure or canvas.
   *
   * @return {Number} the x-offset to the parent figure
   **/
  getX() {
    return this.x
  }

  /**
   * @method
   * the the y-offset related to the parent figure or canvas
   *
   * @param {Number} y the new x offset of the figure
   * @since 5.0.8
   */
  setY(y) {
    this.setPosition(this.x, parseFloat(y))
    this.fireEvent("change:y", { value: this.y })

    return this
  }


  /**
   * @method
   * The y-offset related to the parent figure or canvas.
   *
   * @return {Number} The y-offset to the parent figure.
   **/
  getY() {
    return this.y
  }


  /**
   * @method
   * The x-offset related to the canvas.
   *
   * @return {Number} the x-offset to the canvas
   **/
  getAbsoluteX() {
    if (!this.parent) {
      return this.getX()
    }

    return this.getX() + this.parent.getAbsoluteX()
  }


  /**
   * @method
   * The y-offset related to the canvas.
   *
   * @return {Number} The y-offset to the canvas.
   **/
  getAbsoluteY() {
    if (!this.parent) {
      return this.getY()
    }
    return this.getY() + this.parent.getAbsoluteY()
  }


  /**
   * @method
   * Returns the absolute y-position of the port.
   *
   * @type { .geo.Point}
   **/
  getAbsolutePosition() {
    return new Point(this.getAbsoluteX(), this.getAbsoluteY())
  }

  /**
   * @method
   * Returns the absolute y-position of the port.
   *
   * @return { .geo.Rectangle}
   **/
  getAbsoluteBounds() {
    return new Rectangle(this.getAbsoluteX(), this.getAbsoluteY(), this.getWidth(), this.getHeight())
  }


  /**
   * @method
   * Set the position of the object.
   *
   *      // Alternatively you can use the attr method:
   *      figure.attr({
   *        x: x,
   *        y: y
   *      });
   *
   * @param {Number| .geo.Point} x The new x coordinate of the figure or the x/y coordinate if it is an  .geo.Point
   * @param {Number} [y] The new y coordinate of the figure
   **/
  setPosition(x, y?) {
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
      if (e instanceof DragDropEditPolicy) {
        let newPos = e.adjustPosition(this, this.x, this.y)
        this.x = newPos.getX()
        this.y = newPos.getY();
      }
    })

    this.repaint()


    // Update the resize handles if the user change the position of the
    // element via an API call.
    //
    this.editPolicy.each((i, e) => {
      if (e instanceof DragDropEditPolicy) {
        e.moved(this.canvas, this)
      }
    })


    let event = { figure: this, dx: this.x - oldPos.x, dy: this.y - oldPos.y }
    this.fireEvent("move", event)
    this.fireEvent("change:x", event)
    this.fireEvent("change:y", event)

    return this
  }


  /**
   * @method
   * Get the current position of the figure
   *
   * @return { .geo.Point}
   * @since 2.0.0
   */
  getPosition() {
    return new Point(this.getX(), this.getY())
  }

  /**
   * @method
   * Translate the figure with the given x/y offset.
   *
   * @param {Number} dx The x offset to translate
   * @param {Number} dy The y offset to translate
   **/
  translate(dx, dy) {
    this.setPosition(this.getX() + dx, this.getY() + dy)

    return this
  }


  /**
   * @method
   * Set the new width and height of the figure.
   *
   *      // Alternatively you can use the attr method:
   *      figure.attr({
   *         width:  w,
   *         height: h
   *      });
   *
   * @param {Number} w The new width of the figure
   * @param {Number} h The new height of the figure
   **/
  setDimension(w, h) {
    let old = { width: this.width, height: this.height }

    w = Math.max(this.getMinWidth(), w)
    h = Math.max(this.getMinHeight(), h)

    if (this.width === w && this.height === h) {
      // required if an inherit figure changed the w/h to a given constraint.
      // In this case the Resize handles must be informed that the shape didn't resized.
      // because the minWidth/minHeight did have a higher prio.
      this.editPolicy.each((i, e) => {
        if (e instanceof DragDropEditPolicy) {
          e.moved(this.canvas, this)
        }
      })
      return this
    }


    // apply all EditPolicy to adjust/modify the new dimension
    //
    this.editPolicy.each((i, e) => {
      if (e instanceof DragDropEditPolicy) {
        let newDim = e.adjustDimension(this, w, h)
        w = newDim.getWidth();
        h = newDim.getHeight();
      }
    })

    // respect the aspect ratio if required
    //
    if (this.keepAspectRatio === true) {
      if (w >= this.getMinWidth()) {
        // scale the height to the given ratio
        h = this.getHeight() * (w / this.getWidth())
        // and apply the new dimension only if the values are in range of the given constraints
        if (h >= this.getMinHeight()) {
          this.width = w
          this.height = h
        }
      }
    }
    else {
      this.width = Math.max(this.getMinWidth(), w)
      this.height = Math.max(this.getMinHeight(), h)
    }


    this.repaint()

    this.fireEvent("resize")
    this.fireEvent("change:dimension", { value: { height: this.height, width: this.width, old: old } })

    // Update the resize handles if the user change the position of the element via an API call.
    //
    this.editPolicy.each((i, e) => {
      if (e instanceof DragDropEditPolicy) {
        e.moved(this.canvas, this)
      }
    })

    return this
  }


  /**
   * @method
   * Set the bounding box of the figure
   *
   *      // Alternatively you can use the attr method:
   *      figure.attr({
   *        width: w,
   *        height: h,
   *        x: x,
   *        y: y
   *      });
   *
   *      // or
   *      figure.attr({
   *        boundingBox: {x:1, y:100, width:30, height:30}
   *      });
   *
   * @param { .geo.Rectangle} rect
   * @since 4.8.0
   */
  setBoundingBox(rect: Rectangle) {
    rect = rect.clone();

    let orig = this.repaintBlocked
    this.repaintBlocked = true
    this.setPosition(rect.getX(), rect.getY())
    this.repaintBlocked = orig
    this.setDimension(rect.getWidth(), rect.getHeight())

    return this
  }

  /**
   * @method
   * Returns the bounding box of the figure in absolute position to the canvas.
   *
   * @return { .geo.Rectangle}
   **/
  getBoundingBox() {
    return new Rectangle(this.getAbsoluteX(), this.getAbsoluteY(), this.getWidth(), this.getHeight())
  }

  /**
   * @method
   * Detect whenever the hands over coordinate is inside the figure.
   * The default implementation is a simple bounding box test.
   *
   * @param {Number} iX
   * @param {Number} iY
   * @param {Number} [corona]
   *
   * @returns {Boolean}
   */
  hitTest(iX, iY, corona) {
    if (typeof corona === "number") {
      return this.getBoundingBox().scale(corona, corona).hitTest(iX, iY)
    }
    return this.getBoundingBox().hitTest(iX, iY)
  }


  /**
   * @method
   * Switch on/off the drag drop behaviour of this object
   *
   * @param {Boolean} flag The new drag drop indicator
   **/
  setDraggable(flag) {
    this.draggable = !!flag

    return this
  }

  /**
   * @method
   * Get the Drag drop enable flag
   *
   * @return {Boolean} The new drag drop indicator
   **/
  isDraggable() {
    // delegate to the composite if given
    if (this.composite !== null) {
      return this.composite.isMemberDraggable(this, this.draggable)
    }

    return this.draggable
  }


  /**
   * @method
   * Returns the true if the figure can be resized.
   *
   * @return {Boolean}
   **/
  isResizeable() {
    return this.resizeable
  }

  /**
   * @method
   * You can change the resizeable behaviour of this object. Hands over [false] and
   * the figure has no resizehandles if you select them with the mouse.<br>
   *
   *      // Alternatively you can use the attr method:
   *      figure.attr({
   *        resizeable: flag
   *      });
   *
   * @param {Boolean} flag The resizeable flag.
   **/
  setResizeable(flag) {
    this.resizeable = !!flag
    this.fireEvent("change:resizeable", { value: this.resizeable })

    return this
  }

  /**
   * @method
   * Indicates whenever the element is selectable by user interaction or API.
   *
   * @return {Boolean}
   **/
  isSelectable() {
    // delegate to the composite if given
    if (this.composite !== null) {
      return this.composite.isMemberSelectable(this, this.selectable)
    }

    return this.selectable
  }


  /**
   * @method
   * You can change the selectable behavior of this object. Hands over [false] and
   * the figure has no selection handles if you try to select them with the mouse.<br>
   *
   * @param {Boolean} flag The selectable flag.
   **/
  setSelectable(flag) {
    this.selectable = !!flag
    this.fireEvent("change:selectable", { value: this.selectable })

    return this
  }

  /**
   * @method
   * Return true if the object doesn't care about the aspect ratio.
   * You can change the height and width independent.<br>
   *
   * Replaced with "getKeepAspectRatio"
   * @return {Boolean}
   * @deprecated
   */
  isStrechable() {
    return !this.getKeepAspectRatio()
  }

  /**
   * @method
   * Return false if you avoid that the user can delete your figure.
   * Sub class can override this method.
   *
   * @return {Boolean}
   **/
  isDeleteable() {
    return this.deleteable
  }

  /**
   * @method
   * Set the flag if the shape is deleteable.
   *
   * @param {Boolean} flag enable or disable flag for the delete operation
   **/
  setDeleteable(flag) {
    this.deleteable = !!flag
    this.fireEvent("change:deleteable", { value: this.deleteable })

    return this
  }

  /**
   * @method
   * Set the parent of this figure.
   * Don't call them manually.
   *
   * @param { .Figure} parent The new parent of this figure
   * @private
   **/
  setParent(parent) {
    this.parent = parent

    if (parent !== null) {
      // inherit the selection handling impl from the parent
      this.setSelectionAdapter(parent.getSelectionAdapter())
    }
    else {
      // use default
      this.setSelectionAdapter(null)
    }

    return this
  }

  /**
   * @method
   * Get the parent of this figure.
   *
   * @return { .Figure}
   **/
  getParent() {
    return this.parent
  }

  /**
   * @method
   * Check to see if a figure is a descendant of another figure.
   * <br>
   * The contains() method returns true if the figure provided by the argument is a descendant of this figure,
   * whether it is a direct child or nested more deeply. Otherwise, it returns false.
   *
   * @param { .Figure} containedFigure The figure that may be contained by (a descendant of) this figure.
   * @since 5.5.4
   */
  contains(containedFigure) {
    if (containedFigure.getParent() === this) {
      return true
    }

    for (let i = 0, len = this.children.getSize(); i < len; i++) {
      let child = this.children.get(i).figure
      if (child.contains(containedFigure)) {
        return true
      }
    }
    return false
  }

  /**
   * @method
   * Get the top most parent of this figure. This can be an layout figure or parent container
   *
   * @return { .Figure}
   * @since 5.0.6
   **/
  getRoot() {
    let root = this.parent
    while (root !== null && root.parent !== null) {
      root = root.parent
    }
    return root
  }

  /**
   * @method
   * Set the assigned composite of this figure.
   *
   * @param { .shape.composite.StrongComposite} composite The assigned composite of this figure
   * @since 4.8.0
   **/
  setComposite(composite) {
    if (composite !== null && !(composite instanceof StrongComposite)) {
      throw "'composite must inherit from ' .shape.composite.StrongComposite'"
    }

    this.composite = composite

    return this
  }

  /**
   * @method
   * Get the assigned composite of this figure.
   *
   * @return { .shape.composite.StrongComposite}
   * @since 4.8.0
   **/
  getComposite() {
    return this.composite
  }


  /**
   * @method
   * Execute all handlers and behaviors attached to the figure for the given event type.
   *
   *
   * @param {String} event the event to trigger
   * @param {Object} [args] optional parameters for the triggered event callback
   *
   * @since 5.0.0
   */
  fireEvent(event: string, args?: any) {
    try {
      if (typeof this.eventSubscriptions[event] === 'undefined') {
        return
      }

      // avoid recursion
      if (this._inEvent === true) {
        return
      }
      this._inEvent = true
      let subscribers = this.eventSubscriptions[event]
      for (let i = 0; i < subscribers.length; i++) {
        subscribers[i](this, args)
      }
    }
    catch (exc) {
      console.log(exc)
      throw exc
    }
    finally {
      this._inEvent = false

      // fire a generic change event if an attribute has changed
      // required for some DataBinding frameworks or for the Backbone.Model compatibility
      // the event "change" with the corresponding attribute name as additional parameter
      if (event.substring(0, 7) === "change:") {
        this.fireEvent("change", event.substring(7))
      }
    }
  }

  on(event, callback, context?) {
    let events = event.split(" ")
    if (typeof callback === "undefined") {
      debugger
    }
    // the "context" param is add to be compatible with Backbone.Model.
    // The project "backbone.ModelBinder" requires this signature and we want to be nice.
    //
    if (context) {
      callback = callback.bind(context)
      callback.___originalCallback = callback
    }

    for (let i = 0; i < events.length; i++) {
      if (typeof this.eventSubscriptions[events[i]] === 'undefined') {
        this.eventSubscriptions[events[i]] = []
      }
      // avoid duplicate registration for the same event with the same callback method
      if (-1 !== $.inArray(callback, this.eventSubscriptions[events[i]])) {
        //   debugger
      }
      else {
        this.eventSubscriptions[events[i]].push(callback)
      }
    }
    return this
  }

  /**
   * @method
   * The .off() method removes event handlers that were attached with {@link #on}.<br>
   * Calling .off() with no arguments removes all handlers attached to the elements.<br>
   * <br>
   * If a simple event name such as "move" is provided, all events of that type are removed from the figure.
   *
   *
   * @param {String|Function} eventOrFunction the event name of the registerd function or the function itself
   * @since 5.0.0
   */
  off(eventOrFunction) {
    if (typeof eventOrFunction === "undefined") {
      this.eventSubscriptions = {}
    }
    else if (typeof eventOrFunction === 'string') {
      this.eventSubscriptions[eventOrFunction] = []
    }
    else {
      for (let event in this.eventSubscriptions) {
        this.eventSubscriptions[event] = this.eventSubscriptions[event].filter(callback => {
          if (typeof callback.___originalCallback !== "undefined") {
            return callback.___originalCallback !== eventOrFunction
          }
          return callback !== eventOrFunction
        })
      }
    }

    return this
  }


  /**
   * @method
   * Returns the best figure at the location [x,y]. It is a simple hit test. Keep in mind that only visible objects
   * are returned.
   *
   * @param {Number} x The x position.
   * @param {Number} y The y position.
   * @param { .Figure|Array} [figureToIgnore] The figures which should be ignored.
   **/
  getBestChild(x, y, figureToIgnore?) {
    if (!Array.isArray(figureToIgnore)) {
      if (figureToIgnore instanceof Figure) {
        figureToIgnore = [figureToIgnore]
      }
      else {
        figureToIgnore = []
      }
    }

    let result = null

    // tool method to check recursive a figure for hitTest
    //
    let checkRecursive = function (children) {
      children.each(function (i, e) {
        let c = e.figure
        checkRecursive(c.children)
        if (result === null && c.isVisible() === true && c.hitTest(x, y) === true && $.inArray(c, figureToIgnore) === -1) {
          result = c
        }
        return result === null // break the each-loop if we found an element
      })
    }

    checkRecursive(this.children)

    return result
  }

  createCommand(request) {
    if (request === null) {
      return null
    }

    if (request.getPolicy() === CommandType.MOVE) {
      if (!this.isDraggable()) {
        return null
      }
      return new CommandMove(this)
    }

    if (request.getPolicy() === CommandType.DELETE) {
      if (!this.isDeleteable()) {
        return null
      }
      return new CommandDelete(this)
    }

    if (request.getPolicy() === CommandType.RESIZE) {
      if (!this.isResizeable()) {
        return null
      }
      return new CommandResize(this)
    }

    return null
  }

  /**
   * @method
   * Clone the figure. <br>
   * You must override and implement the methods <b>getPersistentAttributes</b> and <b>setPersistentAttributes</b> for your custom
   * figures if the have special attributes.
   *
   * The clone() method performs a deep copy of the object, meaning that it copies the children, ports and decorations
   * per default. You can control the clone procedure with the 'cloneMetaData'.
   *
   *
   * @param {Object} [cloneMetaData] controls the clone procedure
   * @param {Boolean} [cloneMetaData.excludeChildren] set it to true if you want exclude the children.
   *
   * @since 4.1.0
   * @experimental
   */
  clone(cloneMetaData?) {
    cloneMetaData = extend({ exludeChildren: false }, cloneMetaData)

    let clone = eval("new " + this.NAME + "();")
    let initialId = clone.id

    clone.setPersistentAttributes(this.getPersistentAttributes())

    clone.id = initialId

    // add all decorations to the memento
    //
    if (cloneMetaData.exludeChildren === false) {
      clone.resetChildren()
      this.children.each((i, entry) => {
        let child = entry.figure.clone()
        // we can ignore the locator if this didn't provide a "correct" name, this can happen in some
        // Layout shapes like VerticalLayout or Horziontal Layout. This figures injects it own kind
        // of layouter...so didn'T care about this.

        let locator = createInstenceFromType((entry.locator as any).NAME);
        clone.add(child, locator)
      })
    }

    return clone
  }


  getPersistentAttributes() {
    // force deep copy of userData to avoid side effects in the clone method.
    //
    let memento: any = {
      type: this.NAME,
      id: this.id,
      x: this.getX(),
      y: this.getY(),
      width: this.width,
      height: this.height,
      alpha: this.alpha,
      angle: this.rotationAngle,
      userData: extend(true, {}, this.userData)
    }


    if (this.cssClass !== null) {
      memento.cssClass = this.cssClass
    }

    if (this.composite !== null) {
      memento.composite = this.composite.getId()
    }

    return memento
  }

  setPersistentAttributes(memento) {
    this.id = memento.id
    this.setPosition(parseFloat(memento.x), parseFloat(memento.y))

    // width and height are optional parameter for the JSON stuff.
    // We use the defaults if the attributes not present
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



