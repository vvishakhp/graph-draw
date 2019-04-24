import { Locator } from './Locator';
import { Figure } from '../../Figure';
import { Type } from '../../TypeRegistry';
import { Port } from '../../Port';

@Type('LeftLocator')
export class LeftLocator extends Locator {
  margin: number;
  relocate(index: number, target: Figure) {
    let parent = target.getParent()
    let boundingBox = parent.getBoundingBox()

    // I made a wrong decision in the port handling: anchor point
    // is in the center and not topLeft. Now I must correct this flaw here, and there, and...
    // shit happens.
    let offset = (parent instanceof Port) ? boundingBox.h / 2 : 0


    if (target instanceof Port) {
      target.setPosition(0, (boundingBox.h / 2) - offset)
    }
    else {
      let targetBoundingBox = target.getBoundingBox()
      target.setPosition(-targetBoundingBox.getWidth() - this.margin, (boundingBox.h / 2) - (targetBoundingBox.getHeight() / 2) - offset)
    }
  }
}
