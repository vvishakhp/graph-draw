import { Type, Locator, Figure, Port } from '../../imports';

@Type('TopLocator')
export class TopLocator extends Locator {
  relocate(index: number, target: Figure) {
    let parent = target.getParent()
    let boundingBox = parent.getBoundingBox()

    let offset = (parent instanceof Port) ? boundingBox.w / 2 : 0


    let targetBoundingBox = target.getBoundingBox()
    if (target instanceof Port) {
      target.setPosition(boundingBox.w / 2 - offset, 0)
    }
    else {
      target.setPosition(boundingBox.w / 2 - (targetBoundingBox.getWidth() / 2) - offset, -(targetBoundingBox.getHeight() + 2))
    }
  }
}
