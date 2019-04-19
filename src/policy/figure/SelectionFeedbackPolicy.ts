import { SelectionPolicy } from "./SelectionPolicy";
import { Canvas } from "../../Canvas";
import { Figure } from "../../Figure";
import ArrayList from "../../util/ArrayList";

export class SelectionFeedbackPolicy extends SelectionPolicy {
  onUnselect(canvas: Canvas, figure: Figure) {

    super.onUselect(canvas, figure);

    figure.selectionHandles.each((i, e) => e.hide())
    figure.selectionHandles = new ArrayList()
  }

  onInstall(figure: Figure) {
    super.onInstall(figure);
    let canvas = figure.getCanvas()
    if (canvas !== null) {
      if (canvas.getSelection().contains(figure)) {
        this.onSelect(canvas, figure, true)
      }
    }
  }

  onUninstall(figure: Figure) {
    super.onUninstall(figure);
    figure.selectionHandles.each((i, e) => e.hide())
    figure.selectionHandles = new ArrayList()
  }
}
