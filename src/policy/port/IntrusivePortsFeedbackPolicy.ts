import { PortFeedbackPolicy, Canvas, Figure, HybridPort, LineShape, Port, shifty } from '../../imports';

export class IntrusivePortsFeedbackPolicy extends PortFeedbackPolicy {
  private tweenable = null;
  private connectionLine = null;

  onDragStart(canvas: Canvas, figure: Figure, x: number, y: number, shiftKey: boolean, ctrlKey: boolean) {
    let start = 0;
    let allPorts = canvas.getAllPorts().clone()
    allPorts.each((i, element) => {
      if (typeof element.__beforeInflate === "undefined") {
        element.__beforeInflate = element.getWidth()
      }
      start = element.__beforeInflate
    })


    // animate the resize of the ports
    //
    allPorts.grep((p) => {
      return (p.NAME != figure.NAME && p.parent !== figure.parent) || (p instanceof HybridPort) || (figure instanceof HybridPort)
    })
    this.tweenable = new shifty.Tweenable()
    this.tweenable.tween({
      from: { 'size': start / 2 },
      to: { 'size': start },
      duration: 200,
      easing: "easeOutSine",
      step: (params) => {
        allPorts.each((i, element) => {
          element.shape.attr({ rx: params.size, ry: params.size })
          element.width = element.height = params.size * 2
        })
      }
    })

    this.connectionLine = new LineShape({}, {}, {})
    this.connectionLine.setCanvas(canvas)
    this.connectionLine.getShapeElement()
    this.connectionLine.setDashArray("- ")
    this.connectionLine.setColor("#30c48a")

    this.onDrag(canvas, figure)

    return true
  }

  onDrag(canvas: Canvas, figure: Figure) {
    let x1 = figure.ox + figure.getParent().getAbsoluteX()
    let y1 = figure.oy + figure.getParent().getAbsoluteY()

    this.connectionLine.setStartPosition(x1, y1)
    this.connectionLine.setEndPosition(figure.getAbsoluteX(), figure.getAbsoluteY())
  }

  onDragEnd(canvas: Canvas, figure: Figure, x: number, y: number, shiftKey: boolean, ctrlKey: boolean) {
    if (this.tweenable) {
      this.tweenable.stop(true)
      this.tweenable.dispose()
      this.tweenable = null
    }
    canvas.getAllPorts().each((i, element) => {
      element.shape.attr({ rx: element.__beforeInflate / 2, ry: element.__beforeInflate / 2 })
      element.width = element.height = element.__beforeInflate
      delete element.__beforeInflate
    })
    this.connectionLine.setCanvas(null)
    this.connectionLine = null
  }

  onHoverEnter(canvas: Canvas, draggedFigure: Port, hoverFiger: Figure) {
    this.connectionLine.setGlow(true)
    hoverFiger.setGlow(true)
  }

  onHoverLeave(canvas: Canvas, draggedFigure: Port, hoverFiger: Figure) {
    hoverFiger.setGlow(false)
    if (this.connectionLine === null) {
    }
    this.connectionLine.setGlow(false)
  }
}