import { Locator } from "./Locator";
import { Figure } from "../../Figure";
import { Type } from "../../TypeRegistry";

@Type('TopLocator')
export class TopLocator extends Locator {
  relocate(index: number, target: Figure) {
    let parent = target.getParent()
    let boundingBox = parent.getBoundingBox()

    // I made a wrong decision in the port handling: anchor point
    // is in the center and not topLeft. Now I must correct this flaw here, and there, and...
    // shit happens.
    let offset = (parent instanceof draw2d.Port) ? boundingBox.w / 2 : 0


    let targetBoundingBox = target.getBoundingBox()
    if (target instanceof draw2d.Port) {
      target.setPosition(boundingBox.w / 2 - offset, 0)
    }
    else {
      target.setPosition(boundingBox.w / 2 - (targetBoundingBox.w / 2) - offset, -(targetBoundingBox.h + 2))
    }
  }
}
