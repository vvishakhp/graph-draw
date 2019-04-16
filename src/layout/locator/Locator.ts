import { Figure } from '../../Figure';
import { createInstenceFromType, Type } from '../../TypeRegistry';

@Type('Locator')
export class Locator {
  bind(figure: Figure, child: Figure) {
    child.setDraggable(false);
    child.setSelectable(false);
  }

  unbind(parent?: Figure, child?: Figure) {

  }

  relocate(index, figure: Figure) {
    figure.repaint();
  }

  clone() {
    return createInstenceFromType((<any>this).NAME);
  }
}
