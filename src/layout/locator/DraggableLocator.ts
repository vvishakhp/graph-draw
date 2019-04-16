import { Type } from '../../TypeRegistry';
import { Locator } from './Locator';
import { Figure } from '../../Figure';

@Type('DraggableLocator')
export class DraggableLocator extends Locator {
  bind(parent: Figure, child: Figure) {
    child.setSelectionAdapter(() => child)
  }

  unbind(parent: Figure, child: Figure) {
    child.setSelectionAdapter(null);
  }
}
