import { Locator } from './Locator';
import { Figure } from '../../Figure';
import { Port } from "../../ Port";
import { Type } from '../../TypeRegistry';

@Type('CenterLocator')
export class CenterLocator extends Locator {
  relocate(index: number, target: Figure) {
    let parent = target.getParent()
    let boundingBox = parent.getBoundingBox()

    // TODO: instanceof is always a HACK. ugly. Redirect the call to the figure instead of 
    // determine the position with a miracle.
    //
    if (target instanceof Port) {
      target.setPosition(boundingBox.w / 2, boundingBox.h / 2)
    }
    else {
      let targetBoundingBox = target.getBoundingBox()
      target.setPosition(((boundingBox.w / 2 - targetBoundingBox.w / 2) | 0) + 0.5, ((boundingBox.h / 2 - (targetBoundingBox.h / 2)) | 0) + 0.5)
    }
  }
}

/**
 * @class  .layout.locator.CenterLocator
 *
 * A CenterLocator is used to place figures in the center of a parent shape.
 *
 *
 * See the example:
 *
 *     @example preview small frame
 *
 *
 *     // create a basic figure and add a Label/child via API call
 *     //
 *     let circle = new  .shape.basic.Circle({diameter:120});
 *     circle.setStroke(3);
 *     circle.setColor("#A63343");
 *     circle.setBackgroundColor("#E65159");
 *     circle.add(new  .shape.basic.Label({text:"Center Label"}), new  .layout.locator.CenterLocator());
 *     canvas.add( circle, 100,50);
 *
 *
 * @author Andreas Herz
 * @extend  .layout.locator.Locator
 */


 .layout.locator.CenterLocator =  .layout.locator.Locator.extend({
  NAME: " .layout.locator.CenterLocator",

  /**
   * @constructor
   * Constructs a locator with associated parent.
   *
   */
  init: function () {
    this._super()
  },


  /**
   * @method
   * Relocates the given Figure.
   *
   * @param {Number} index child index of the target
   * @param { .Figure} target The figure to relocate
   **/
  relocate: function (index, target) {
    let parent = target.getParent()
    let boundingBox = parent.getBoundingBox()

    // TODO: instanceof is always a HACK. ugly. Redirect the call to the figure instead of 
    // determine the position with a miracle.
    //
    if (target instanceof  .Port) {
      target.setPosition(boundingBox.w / 2, boundingBox.h / 2)
    }
    else {
      let targetBoundingBox = target.getBoundingBox()
      target.setPosition(((boundingBox.w / 2 - targetBoundingBox.w / 2) | 0) + 0.5, ((boundingBox.h / 2 - (targetBoundingBox.h / 2)) | 0) + 0.5)
    }
  }
})
