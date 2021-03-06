import { Type, Locator, AttributeCollection, Figure, Port } from "../../imports";


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
      target.setPosition(boundingBox.getWidth() + this.margin, (boundingBox.h / 2) - (targetBoundingBox.getHeight() / 2) - offset)
    }
  }
}
