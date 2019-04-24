import { Locator } from './Locator';
import { Figure } from '../../Figure';
import { Port } from "../../Port";
import { Type } from '../../TypeRegistry';

@Type('CenterLocator')
export class CenterLocator extends Locator {
  relocate(index: number, target: Figure) {
    let parent = target.getParent()
    let boundingBox = parent.getBoundingBox()
    if (target instanceof Port) {
      target.setPosition(boundingBox.w / 2, boundingBox.h / 2)
    }
    else {
      let targetBoundingBox = target.getBoundingBox()
      target.setPosition(((boundingBox.w / 2 - targetBoundingBox.getWidth() / 2) | 0) + 0.5, ((boundingBox.h / 2 - (targetBoundingBox.getHeight() / 2)) | 0) + 0.5)
    }
  }
}