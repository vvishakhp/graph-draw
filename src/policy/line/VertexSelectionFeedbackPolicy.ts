import {
  Type, LineSelectionFeedbackPolicy,
  LineStartResizeHandle, LineEndResizeHandle,
  VertexResizeHandle, GhostVertexResizeHandle
} from '../../imports';


@Type('VertexSelectionFeedbackPolicy')
export class VertexSelectionFeedbackPolicy extends LineSelectionFeedbackPolicy {

  onSelect(canvas, figure, isPrimarySelection?: boolean) {
    let startHandle = new LineStartResizeHandle(figure)
    let endHandle = new LineEndResizeHandle(figure)
    figure.selectionHandles.add(startHandle)
    figure.selectionHandles.add(endHandle)

    let points = figure.getVertices()
    let count = points.getSize() - 1
    let i = 1
    for (; i < count; i++) {
      figure.selectionHandles.add(new VertexResizeHandle(figure, i))
      figure.selectionHandles.add(new GhostVertexResizeHandle(figure, i - 1))
    }

    figure.selectionHandles.add(new GhostVertexResizeHandle(figure, i - 1))

    figure.selectionHandles.each((i, e) => {
      e.setDraggable(figure.isResizeable())
      e.show(canvas)
    })

    this.moved(canvas, figure)
  }
}