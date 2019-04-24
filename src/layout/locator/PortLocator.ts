/// TODO

import   from '../../packages'
import { Locator } from './Locator';
import { Type } from '../../TypeRegistry';
import { Port } from "../../ Port";
import { matrix } from 'raphael';
import { Figure } from '../../Figure';

@Type('PortLocator')
export class PortLocator extends Locator {
  applyConsiderRotation(port: Figure, x: number, y: number) {
    let parent = port.getParent()

    // determine the width/height before manipulate the 
    // matrix of the shape
    let halfW = parent.getWidth() / 2
    let halfH = parent.getHeight() / 2

    let rotAngle = parent.getRotationAngle()
    let m = matrix(1, 0, 0, 1, 0, 0);
    m.rotate(rotAngle, halfW, halfH)
    if (rotAngle === 90 || rotAngle === 270) {
      let ratio = parent.getHeight() / parent.getWidth()
      m.scale(ratio, 1 / ratio, halfW, halfH)
    }

    port.setPosition(m.x(x, y), m.y(x, y))
  }
}


/**
 * @class  .layout.locator.PortLocator
 *
 * The port locator calculates the position of an port. All ports MUST have a locator
 * if you add them as child to a node.
 *
 * @author Andreas Herz
 * @extend  .layout.locator.Locator
 */

 .layout.locator.PortLocator =  .layout.locator.Locator.extend({
  NAME: " .layout.locator.PortLocator",

  /**
   * @constructor
   * Default constructor for a Locator which can layout a port in context of a
   *
   */
  init: function () {
    this._super()
  },

  applyConsiderRotation: function (port, x, y) {
    let parent = port.getParent()

    // determine the width/height before manipulate the 
    // matrix of the shape
    let halfW = parent.getWidth() / 2
    let halfH = parent.getHeight() / 2

    let rotAngle = parent.getRotationAngle()
    let m = Raphael.matrix()
    m.rotate(rotAngle, halfW, halfH)
    if (rotAngle === 90 || rotAngle === 270) {
      let ratio = parent.getHeight() / parent.getWidth()
      m.scale(ratio, 1 / ratio, halfW, halfH)
    }

    port.setPosition(m.x(x, y), m.y(x, y))
  }
})