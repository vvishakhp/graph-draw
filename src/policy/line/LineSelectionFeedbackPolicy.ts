import { SelectionFeedbackPolicy } from "../figure/SelectionFeedbackPolicy";
import { Type } from "../../TypeRegistry";
import { LineStartResizeHandle } from "../../shape/basic/LineStartResizeHandle";
import { LineEndResizeHandle } from "../../shape/basic/LineEndResizeHandle";

@Type('LineSelectionFeedbackPolicy')
export class LineSelectionFeedbackPolicy extends SelectionFeedbackPolicy {
  onSelect(canvas, figure, isPrimarySelection) {
    if (figure.selectionHandles.isEmpty()) {
      figure.selectionHandles.add(new LineStartResizeHandle(figure))
      figure.selectionHandles.add(new LineEndResizeHandle(figure))

      figure.selectionHandles.each((i, e) => {
        e.setDraggable(figure.isResizeable())
        e.show(canvas)
      })
    }
    this.moved(canvas, figure)
  }


  moved(canvas, figure) {
    figure.selectionHandles.each((i, e) => e.relocate())
  }

}
