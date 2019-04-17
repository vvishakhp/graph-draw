import { Locator } from './Locator';
import { Figure } from '../../Figure';
import { Type } from '../../TypeRegistry';

@Type('LeftLocator')
export class LeftLocator extends Locator {
  relocate(index: number, target: Figure) {
    let parent = target.getParent()
    let boundingBox = parent.getBoundingBox()

    // I made a wrong decision in the port handling: anchor point
    // is in the center and not topLeft. Now I must correct this flaw here, and there, and...
    // shit happens.
    let offset = (parent instanceof  .Port) ? boundingBox.h / 2 : 0


    if (target instanceof  .Port) {
      target.setPosition(0, (boundingBox.h / 2) - offset)
    }
    else {
      let targetBoundingBox = target.getBoundingBox()
      target.setPosition(-targetBoundingBox.w - this.margin, (boundingBox.h / 2) - (targetBoundingBox.h / 2) - offset)
    }
  }
}
