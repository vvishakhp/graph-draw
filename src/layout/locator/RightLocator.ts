import { Locator } from './Locator';
import { AttributeCollection } from '../../Canvas';
import { Port } from '../../Port';
import { Figure } from '../../Figure';
import { Type } from '../../TypeRegistry';

@Type('RightLocator')
export class RightLocator extends Locator {

  private margin: number;

  constructor(attr: AttributeCollection) {
    super();
    this.margin = (attr && ("margin" in attr)) ? attr['margin'] : 5
  }

  relocate(index: number, target: Figure) {
    var parent = target.getParent()
    var boundingBox = parent.getBoundingBox()


    var offset = (parent instanceof Port) ? boundingBox.h / 2 : 0

    if (target instanceof Port) {
      target.setPosition(boundingBox.w, (boundingBox.h / 2) - offset)
    }
    else {
      var targetBoundingBox = target.getBoundingBox()
      target.setPosition(boundingBox.w + this.margin, (boundingBox.h / 2) - (targetBoundingBox.h / 2) - offset)
    }
  }
}
