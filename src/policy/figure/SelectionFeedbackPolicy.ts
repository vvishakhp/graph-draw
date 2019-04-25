import { FigureSelectionPolicy, Canvas, Figure, ArrayList, Type } from '../../imports';

@Type('SelectionFeedbackPolicy')
export class SelectionFeedbackPolicy extends FigureSelectionPolicy {
  onUnselect(canvas: Canvas, figure: Figure) {

    super.onUnselect(canvas, figure);

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
