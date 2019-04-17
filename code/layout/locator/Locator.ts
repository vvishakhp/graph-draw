import   from '../../packages'
import { Figure } from '../../../src/Figure';
import { Type, createInstenceFromType } from '../../../src/TypeRegistry';

@Type("Locator")
export class Locator {
  public bind(parent: Figure, child: Figure) {
    child.setDraggable(false)
    child.setSelectable(false)
  }

  public unbind(parent, child) {

  }

  public relocate(index: number, figure: Figure) {
    figure.repaint();
  }

  clone() {
    return createInstenceFromType('Locator');
  }
}
