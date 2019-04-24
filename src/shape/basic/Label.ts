import { SetFigure } from "../../SetFigure";
import { Type } from "../../TypeRegistry";
import { Color } from "../../util/Color";
import extend from "../../util/extend";
import jsonUtil from "../../util/JSONUtil";
import { DragDropEditPolicy } from "../../policy/figure/DragDropEditPolicy";
import { AntSelectionFeedbackPolicy } from "../../policy/figure/AntSelectionFeedbackPolicy";

@Type('Label')
export class Label extends SetFigure {
  FONT_FALLBACK: {
    'Georgia': 'Georgia, serif',
    'Palatino Linotype': '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    'Times New Roman': '"Times New Roman", Times, serif',
    'Arial': 'Arial, Helvetica, sans-serif',
    'Arial Black': '"Arial Black", Gadget, sans-serif',
    'Comic Sans MS': '"Comic Sans MS", cursive, sans-serif',
    'Impact': 'Impact, Charcoal, sans-serif',
    'Lucida Sans Unicode': '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
    'Tahoma, Geneva': 'Tahoma, Geneva, sans-seri',
    'Trebuchet MS': '"Trebuchet MS", Helvetica, sans-serif',
    'Verdana': 'Verdana, Geneva, sans-serif',
    'Courier New': '"Courier New", Courier, monospace',
    'Lucida Console': '"Lucida Console", Monaco, monospace'
  }
  text: string;
  cachedWidth: any;
  cachedHeight: any;
  cachedMinWidth: any;
  cachedMinHeight: any;
  fontSize: number;
  fontColor: any;
  fontFamily: any;
  padding: { top: number; right: number; bottom: number; left: number; };
  outlineStroke: number;
  outlineColor: any;
  bold: boolean;
  editor: any;
  lastAppliedLabelRotation: string;
  lastAppliedTextAttributes: {};
  constructor(attr, setter, getter) {

    super(extend({ stroke: 1, width: 1, height: 1, resizeable: false }, attr),
      setter, getter);
    this.text = ""

    this.cachedWidth = null
    this.cachedHeight = null
    this.cachedMinWidth = null
    this.cachedMinHeight = null

    this.fontSize = 12
    this.fontColor = new Color(8, 8, 8)
    this.fontFamily = null
    this.padding = { top: 4, right: 4, bottom: 4, left: 4 }

    this.outlineStroke = 0
    this.outlineColor = new Color(null)

    this.bold = false


    this.editor = null


    this.setterWhitelist = extend(this.setterWhitelist, {
      text: this.setText,
      editor: this.installEditor,
      outlineStroke: this.setOutlineStroke,
      outlineColor: this.setOutlineColor,
      fontFamily: this.setFontFamily,
      fontSize: this.setFontSize,
      fontColor: this.setFontColor,
      padding: this.setPadding,
      bold: this.setBold
    }, setter);

    this.getterWhitelist = extend(this.getterWhitelist, {
      text: this.getText,
      outlineStroke: this.getOutlineStroke,
      outlineColor: this.getOutlineColor,
      fontFamily: this.getFontFamily,
      fontSize: this.getFontSize,
      fontColor: this.getFontColor,
      padding: this.getPadding,
      bold: this.isBold
    }, getter);

    this.installEditPolicy(new AntSelectionFeedbackPolicy())

    this.lastAppliedLabelRotation = ""
    this.lastAppliedTextAttributes = {}
  }


  createSet() {
    return this.canvas.paper.text(0, 0, this.text)
  }


  setCanvas(canvas) {
    this.clearCache()
    super.setCanvas(canvas)
    this.clearCache()
    return this;
  }


  repaint(attributes) {
    if (this.repaintBlocked === true || this.shape === null || (this.parent && this.parent.repaintBlocked === true)) {
      return
    }


    let lattr = this.calculateTextAttr()
    lattr['text'] = this.text

    let attrDiff = jsonUtil.flatDiff(lattr, this.lastAppliedTextAttributes)
    this.lastAppliedTextAttributes = lattr

    // the two "attr" calls takes 2/3 of the complete method call (chrome performance check).
    // now we check if any changes happens and call this method only if neccessary.
    if (Object.getOwnPropertyNames(attrDiff).length > 0) {
      this.svgNodes.attr(lattr)
      // set of the x/y must be done AFTER the font-size and bold has been set.
      // Reason: the getBBox method needs the font attributes for calculation
      this.svgNodes.attr({
        x: (this.padding.left + this.stroke),
        y: (this.svgNodes.getBBox(true).height / 2 + this.padding.top + this.getStroke())
      })
    }
    return super.repaint(attributes)
  }



  calculateTextAttr() {
    let lattr = {
      "text-anchor": "start",
      "font-size": this.fontSize,
      "font-weight": (this.bold === true) ? "bold" : "normal",
      fill: this.fontColor.hash(),
      stroke: this.outlineColor.hash(),
      "stroke-width": this.outlineStroke
    }
    if (this.fontFamily !== null) {
      lattr["font-family"] = this.fontFamily
    }
    return lattr
  }


  applyTransformation() {
    let ts = "R" + this.rotationAngle
    //    if(ts!==this.lastAppliedLabelRotation){
    this.shape.transform(ts)
    this.lastAppliedLabelRotation = ts
    //    }

    this.svgNodes.transform(
      "R" + this.rotationAngle +
      "T" + this.getAbsoluteX() + "," + this.getAbsoluteY())

    return this
  }


  /**
   * @method
   * Set the new font size in [pt].
   *
   * @param {Number} size The new font size in <code>pt</code>
   **/
  setFontSize(size) {
    this.clearCache()
    this.fontSize = size

    this.repaint({})

    this.fireEvent("change:fontSize", { value: this.fontSize })
    this.fireEvent("resize")

    // Update the resize handles if the user change the position of the element via an API call.
    //
    let _this = this
    this.editPolicy.each(function (i, e) {
      if (e instanceof DragDropEditPolicy) {
        e.moved(_this.canvas, _this)
      }
    })


    return this
  }


  getFontSize() {
    return this.fontSize
  }


  setBold(bold) {
    this.clearCache()
    this.bold = bold
    this.repaint({})

    this.fireEvent("change:bold", { value: this.bold })
    this.fireEvent("resize")

    // Update the resize handles if the user change the position of the element via an API call.
    //
    let _this = this
    this.editPolicy.each(function (i, e) {
      if (e instanceof DragDropEditPolicy) {
        e.moved(_this.canvas, _this)
      }
    })

    return this
  }


  isBold() {
    return this.bold
  }


  setOutlineColor(color: Color) {
    this.outlineColor = color.clone();
    this.repaint({})
    this.fireEvent("change:outlineColor", { value: this.outlineColor })

    return this
  }

  getOutlineColor() {
    return this.outlineColor
  }


  setOutlineStroke(w) {
    this.outlineStroke = w
    this.repaint({})
    this.fireEvent("change:outlineStroke", { value: this.outlineStroke })

    return this
  }


  getOutlineStroke() {
    return this.outlineStroke
  }

  setFontColor(color: Color) {
    this.fontColor = color.clone();
    this.repaint({})
    this.fireEvent("change:fontColor", { value: this.fontColor })

    return this
  }


  getFontColor() {
    return this.fontColor
  }

  setPadding(padding) {
    this.clearCache()
    if (typeof padding === "number") {
      this.padding = { top: padding, right: padding, bottom: padding, left: padding }
    }
    else {
      extend(this.padding, padding)
    }
    this.repaint({})
    this.fireEvent("change:padding", { value: this.padding })

    return this
  }


  getPadding() {
    return this.padding
  }


  setFontFamily(font) {
    this.clearCache()

    // check for fallback
    //
    if ((typeof font !== "undefined") && font !== null && typeof this.FONT_FALLBACK[font] !== "undefined") {
      font = this.FONT_FALLBACK[font]
    }

    this.fontFamily = font
    this.repaint({})
    this.fireEvent("change:fontFamily", { value: this.fontFamily })

    return this
  }


  getFontFamily() {
    return this.fontFamily
  }



  setDimension(w, h) {
    this.clearCache()

    super.setDimension(w, h)

    return this
  }


  clearCache() {
    this.portRelayoutRequired = true
    this.cachedMinWidth = null
    this.cachedMinHeight = null
    this.cachedWidth = null
    this.cachedHeight = null
    this.lastAppliedTextAttributes = {}

    return this
  }


  getMinWidth() {
    if (this.shape === null) {
      return 0
    }

    if (this.cachedMinWidth === null) {
      this.cachedMinWidth = this.svgNodes.getBBox(true).width
        + this.padding.left
        + this.padding.right
        + 2 * this.getStroke()
    }

    return this.cachedMinWidth
  }


  getMinHeight() {
    if (this.shape === null) {
      return 0
    }

    if (this.cachedMinHeight === null) {
      this.cachedMinHeight = this.svgNodes.getBBox(true).height
        + this.padding.top
        + this.padding.bottom
        + (2 * this.getStroke())
    }

    return this.cachedMinHeight
  }


  getWidth() {
    if (this.shape === null) {
      return 0
    }

    if (this.cachedWidth === null) {
      if (this.resizeable === true) {
        this.cachedWidth = Math.max(this.width, this.getMinWidth())
      }
      else {
        this.cachedWidth = this.getMinWidth()
      }
    }


    return this.cachedWidth
  }


  getHeight() {
    if (this.shape === null) {
      return 0
    }

    if (this.cachedHeight === null) {
      this.cachedHeight = Math.max(this.height, this.getMinHeight())
    }

    return this.cachedHeight
  }

  installEditor(editor) {
    if (typeof editor === "string") {
      editor = eval("new " + editor + "()")
    }
    this.editor = editor

    return this
  }


  onDoubleClick() {
    if (this.editor !== null) {
      this.editor.start(this)
    }
  }



  getText() {
    return this.text
  }


  setText(text) {
    this.clearCache()
    this.text = text

    this.repaint({})
    // Update the resize handles if the user change the position of the element via an API call.
    //
    let _this = this
    this.editPolicy.each(function (i, e) {
      if (e instanceof DragDropEditPolicy) {
        e.moved(_this.canvas, _this)
      }
    })

    this.fireEvent("resize")
    this.fireEvent("change:text", { value: this.text })

    if (this.parent !== null) {
      this.parent.repaint()
    }

    return this
  }


  hitTest(x, y) {
    // apply a simple bounding box test if the label isn'T rotated
    //
    if (this.rotationAngle === 0) {
      return super.hitTest(x, y, null)
    }


    let matrix = this.shape.matrix
    let points = this.getBoundingBox().getVertices()
    points.each(function (i, point) {
      let x = matrix.x(point.getX(), point.getY())
      let y = matrix.y(point.getX(), point.getY())
      point.setX(x);
      point.setY(y);
    })

    let polySides = 4

    let j = polySides - 1
    let oddNodes = false

    for (let i = 0; i < polySides; i++) {
      let pi = points.get(i)
      let pj = points.get(j)
      if ((pi.getY() < y && pj.getY() >= y
        || pj.getY() < y && pi.getY() >= y)
        && (pi.getX() <= x || pj.getX() <= x)) {
        if (pi.getX() + (y - pi.getY()) / (pj.getY() - pi.getY()) * (pj.getX() - pi.getX()) < x) {
          oddNodes = !oddNodes
        }
      }
      j = i
    }
    return oddNodes
  }


  getPersistentAttributes() {
    let memento = super.getPersistentAttributes();

    memento.text = this.text
    memento.outlineStroke = this.outlineStroke
    memento.outlineColor = this.outlineColor.hash()
    memento.fontSize = this.fontSize
    memento.fontColor = this.fontColor.hash()
    memento.fontFamily = this.fontFamily

    if (this.editor !== null) {
      memento.editor = this.editor.NAME
    }
    return memento
  }


  setPersistentAttributes(memento) {
    super.setPersistentAttributes(memento);
    if (typeof memento.text !== "undefined") {
      this.setText(memento.text)
    }
    if (typeof memento.outlineStroke !== "undefined") {
      this.setOutlineStroke(memento.outlineStroke)
    }
    if (typeof memento.outlineColor !== "undefined") {
      this.setOutlineColor(memento.outlineColor)
    }
    if (typeof memento.fontFamily !== "undefined") {
      this.setFontFamily(memento.fontFamily)
    }
    if (typeof memento.fontSize !== "undefined") {
      this.setFontSize(memento.fontSize)
    }
    if (typeof memento.fontColor !== "undefined") {
      this.setFontColor(memento.fontColor)
    }

    if (typeof memento.editor === "string") {
      this.installEditor(eval("new " + memento.editor + "()"))
    }

    return this;
  }


}


