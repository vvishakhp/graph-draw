import { Type, DragDropEditPolicy, Canvas, Figure } from '../../imports';

@Type('FigureSelectionPolicy')
export class FigureSelectionPolicy extends DragDropEditPolicy {
  public onSelect(canvas: Canvas, figure: Figure, isPrimarySelection: boolean) {

  }

  public onUnselect(canvas: Canvas, figure: Figure) {

  }
}

