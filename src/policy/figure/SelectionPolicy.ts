import { DragDropEditPolicy } from './DragDropEditPolicy';
import { Canvas } from '../../Canvas';
import { Figure } from '../../Figure';
import { Type } from '../../TypeRegistry';

@Type('SelectionPolicy')
export class SelectionPolicy extends DragDropEditPolicy {
  public onSelect(canvas: Canvas, figure: Figure, isPrimarySelection: boolean) {

  }

  public onUnselect(canvas: Canvas, figure: Figure) {

  }
}

