import { Type, RectangleShape, extend, Canvas, StrongComposite } from "./imports";


@Type('SetFigure')
export class SetFigure extends RectangleShape {
  svgNodes: any;
  originalWidth: any;
  originalHeight: any;
  scaleX: number;
  scaleY: number;
  strokeScale: boolean;
  constructor(attr, setter, getter) {
    super(extend({ stroke: 0, bgColor: null }, attr), setter, getter);
    // collection of SVG DOM nodes
    this.svgNodes = null

    this.originalWidth = null
    this.originalHeight = null

    this.scaleX = 1
    this.scaleY = 1

    this.strokeScale = true
  }

  setCanvas(canvas: Canvas) {

    if (canvas === null && this.svgNodes !== null) {
      this.svgNodes.remove()
      this.svgNodes = null
    }

    return super.setCanvas(canvas);
  }



  setCssClass(cssClass) {
    super.setCssClass(cssClass)

    if (this.svgNodes === null) {
      return this
    }

    if (this.cssClass === null) {
      this.svgNodes.forEach(function (e) {
        e.node.removeAttribute("class")
      })
    }
    else {
      this.svgNodes.forEach(function (e) {
        e.node.setAttribute("class", cssClass)
      })
    }

    return this
  }



  repaint(attributes) {

    if (this.repaintBlocked === true || this.shape === null) {
      return
    }

    if (this.originalWidth !== null) {
      this.scaleX = this.width / this.originalWidth
      this.scaleY = this.height / this.originalHeight
    }

    attributes = attributes || {}

    this.applyAlpha()

    return super.repaint(attributes)
  }


  setVisible(flag, duration?) {
    super.setVisible(flag, duration)

    if (this.svgNodes !== null) {
      if (duration) {
        if (this.visible === true) {
          this.svgNodes.forEach((shape) => {
            $(shape.node).fadeIn(duration, () => shape.show())
          })
        }
        else {
          this.svgNodes.forEach((shape) => {
            $(shape.node).fadeOut(duration, () => shape.hide())
          })
        }
      }
      else {
        if (this.visible === true) {
          this.svgNodes.show()
        }
        else {
          this.svgNodes.hide()
        }
      }
    }
    return this;
  }


  applyAlpha() {
    this.svgNodes.attr({ opacity: this.alpha })
  }


  applyTransformation() {
    let s =
      "S" + this.scaleX + "," + this.scaleY + ",0,0 " +
      "R" + this.rotationAngle + "," + ((this.getWidth() / 2) | 0) + "," + ((this.getHeight() / 2) | 0) +
      "T" + this.getAbsoluteX() + "," + this.getAbsoluteY() +
      ""
    this.svgNodes.transform(s)
    if (this.rotationAngle === 90 || this.rotationAngle === 270) {
      let before = this.svgNodes.getBBox(true)
      let ratio = before.height / before.width
      let reverseRatio = before.width / before.height
      let rs = "...S" + ratio + "," + reverseRatio + "," + (this.getAbsoluteX() + this.getWidth() / 2) + "," + (this.getAbsoluteY() + this.getHeight() / 2)
      this.svgNodes.transform(rs)
    }

    return this
  }


  toFront(figure) {

    if (this.composite instanceof StrongComposite && (typeof figure !== "undefined")) {
      let indexFigure = figure.getZOrder()
      let indexComposite = this.composite.getZOrder()
      if (indexFigure < indexComposite) {
        figure = this.composite
      }
    }

    if (typeof figure === "undefined") {

      this.getShapeElement().toFront()


      if (this.svgNodes !== null) {
        this.svgNodes.toFront()
      }

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

      if (this.svgNodes !== null) {
        this.svgNodes.insertAfter(figure.getTopLevelShapeElement())
      }
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



    this.children.each(function (i, child) {
      child.figure.toFront(figure)
    })


    let _this = this
    this.getPorts().each(function (i, port) {
      port.getConnections().each(function (i, connection) {
        connection.toFront(figure)
      })

      port.toFront(_this)
    })


    this.selectionHandles.each(function (i, handle) {
      handle.toFront()
    })

    return this
  }


  toBack(figure) {
    if (this.composite instanceof StrongComposite) {
      this.toFront(this.composite)
      return
    }


    if (this.canvas !== null) {
      let figures = this.canvas.getFigures()
      let lines = this.canvas.getLines()
      if (figures.remove(this) !== null) {
        figures.insertElementAt(this, 0)
      }
      else if (lines.remove(this) !== null) {
        lines.insertElementAt(this, 0)
      }
    }


    this.children.each(function (i, child) {
      child.figure.toBack(figure)
    }, true)

    if (this.svgNodes !== null) {
      if (typeof figure !== "undefined") {
        this.svgNodes.insertBefore(figure.getShapeElement())
      }
      else {
        this.svgNodes.toBack()
      }
    }


    if (this.canvas !== null) {
      if (typeof figure !== "undefined") {
        this.getShapeElement().insertBefore(figure.getShapeElement())
      }
      else {
        this.getShapeElement().toBack()
      }
    }

    let _this = this
    this.getPorts().each(function (i, port) {
      port.getConnections().each(function (i, connection) {
        connection.toFront(_this)
      })

      port.toFront(_this)
    })

    return this
  }



  getTopLevelShapeElement() {
    if (this.svgNodes.length === 0) {
      return this.shape
    }
    return this.svgNodes
  }


  createShapeElement() {

    let shape = this.canvas.paper.rect(this.getX(), this.getY(), this.getWidth(), this.getHeight())
    this.svgNodes = this.createSet()

    if (typeof this.svgNodes.forEach === "undefined") {
      let set = this.canvas.paper.set()
      set.push(this.svgNodes)
      this.svgNodes = set
    }

    this.svgNodes.attr({ "stroke-scale": this.strokeScale })

    this.setVisible(this.visible)

    this.setCssClass(this.cssClass)

    let bb = this.svgNodes.getBBox()
    this.originalWidth = bb.width
    this.originalHeight = bb.height

    return shape
  }


  createSet() {
    return this.canvas.paper.set()
  }
}