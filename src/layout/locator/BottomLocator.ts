import { Type, Locator, Figure, Port } from "../../imports";


@Type('BottomLocator')
export class BottomLocator extends Locator {
  relocate(index: number, target: Figure) {
    var parent = target.getParent()
    var boundingBox = parent.getBoundingBox()

    var offset = (parent instanceof Port) ? boundingBox.w / 2 : 0


    var targetBoundingBox = target.getBoundingBox()
    if (target instanceof Port) {
      target.setPosition(boundingBox.w / 2 - offset, boundingBox.h)
    } else {
      target.setPosition(boundingBox.w / 2 - targetBoundingBox.getWidth() / 2 - offset, 2 + boundingBox.h)
    }
  }
}
