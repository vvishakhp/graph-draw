import { Locator } from './Locator';
import { Figure } from '../../Figure';
import { Type } from '../../TypeRegistry';

@Type('SmartDraggableLocator')
export class SmartDraggableLocator extends Locator {
  boundedCorners: {
    init: boolean;
    parent: number;
    child: number;
    dist: number;
    xOffset: number;
    yOffset: number;
  };

  constructor() {
    super();
    this.boundedCorners = {
      init: false,
      parent: 0,
      child: 0,
      dist: Number.MAX_SAFE_INTEGER,
      xOffset: 0,
      yOffset: 0
    }
  }

  private calcBoundingCorner(child: Figure) {
    this.boundedCorners = {
      init: false,
      parent: 0,
      child: 0,
      dist: Number.MAX_SAFE_INTEGER,
      xOffset: 0,
      yOffset: 0
    }
    let parentVertices = child.getParent().getBoundingBox().getVertices()
    let childVertices = child.getBoundingBox().getVertices()
    let i_parent, i_child
    let p1, p2, distance
    for (i_parent = 0; i_parent < parentVertices.getSize(); i_parent++) {
      for (i_child = 0; i_child < childVertices.getSize(); i_child++) {
        p1 = parentVertices.get(i_parent)
        p2 = childVertices.get(i_child)
        distance = Math.abs(p1.distance(p2))
        if (distance < this.boundedCorners.dist) {
          this.boundedCorners = {
            parent: i_parent,
            child: i_child,
            dist: distance,
            xOffset: p1.x - p2.x,
            yOffset: p1.y - p2.y,
            init: true
          }
        }
      }
    }
  }

  bind(parent: Figure, child: Figure) {
    child.setSelectionAdapter(() => child)

    child.getParent().on("added", () => this.calcBoundingCorner(child))
    child.on("dragend", () => this.calcBoundingCorner(child))
  }

  unbind(parent: Figure, child: Figure) {
    child.setSelectionAdapter(null)
  }

  relocate(index, figure) {
    if (this.boundedCorners.init === true) {
      let parentVertices = figure.getParent().getBoundingBox().getVertices()
      let childVertices = figure.getBoundingBox().getVertices()
      let p1 = parentVertices.get(this.boundedCorners.parent)
      let p2 = childVertices.get(this.boundedCorners.child)

      let xOffset = p1.x - p2.x
      let yOffset = p1.y - p2.y
      figure.translate(xOffset - this.boundedCorners.xOffset, yOffset - this.boundedCorners.yOffset)
    }
  }
}

