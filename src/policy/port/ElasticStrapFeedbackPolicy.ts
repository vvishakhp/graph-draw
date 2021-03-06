import { PortFeedbackPolicy, Canvas, Figure, LineShape, Port } from '../../imports'

export class ElasticStrapFeedbackPolicy extends PortFeedbackPolicy {

  private connectionLine = null;

  onDragStart(canvas: Canvas, figure: Figure, x: number, y: number, shiftKey: boolean, ctrlKey: boolean) {
    this.connectionLine = new LineShape({}, {}, {})
    this.connectionLine.setCanvas(canvas)
    this.connectionLine.getShapeElement()

    this.onDrag(canvas, figure)
    return true;
  }

  onDrag(canvas: Canvas, figure: Figure) {
    var x1 = figure.ox + figure.getParent().getAbsoluteX()
    var y1 = figure.oy + figure.getParent().getAbsoluteY()

    this.connectionLine.setStartPosition(x1, y1)
    this.connectionLine.setEndPosition(figure.getAbsoluteX(), figure.getAbsoluteY())
  }

  onDragEnd(canvas: Canvas, figure: Figure, x: number, y: number, shiftKey: boolean, ctrlKey: boolean) {
    this.connectionLine.setCanvas(null)
    this.connectionLine = null
  }

  onHoverEnter(canvas: Canvas, draggedFigure: Port, hoverFiger: Figure) {
    this.connectionLine.setGlow(true)
    hoverFiger.setGlow(true)
  }

  onHoverLeave(canvas: Canvas, draggedFigure: Port, hoverFiger: Figure) {
    hoverFiger.setGlow(false)
    this.connectionLine.setGlow(false)
  }

}
