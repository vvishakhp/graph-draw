import { Type, Locator, Figure } from '../../imports';
@Type('DraggableLocator')
export class DraggableLocator extends Locator {
  bind(parent: Figure, child: Figure) {
    child.setSelectionAdapter(() => child)
  }

  unbind(parent: Figure, child: Figure) {
    child.setSelectionAdapter(null);
  }
}
