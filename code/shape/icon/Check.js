/**
 * @class  .shape.icon.Check

 * See the example:
 *
 *     @example preview small frame
 *
 *     let icon =  new  .shape.icon.Check();
 *
 *     canvas.add(icon,50,10);
 *
 * @inheritable
 * @author Andreas Herz
 * @extends  .shape.icon.Icon
 */
import   from '../../packages'

 .shape.icon.Check =  .shape.icon.Icon.extend({
  NAME: " .shape.icon.Check",

  /**
   *
   * @constructor
   * Creates a new icon element which are not assigned to any canvas.
   *
   * @param {Object} attr the configuration of the shape
   */
  init: function (attr, setter, getter) {
    this._super(extend({width: 50, height: 50}, attr), setter, getter)
  },

  /**
   * @private
   * @returns
   */
  createSet: function () {
    return this.canvas.paper.path("M2.379,14.729 5.208,11.899 12.958,19.648 25.877,6.733 28.707,9.561 12.958,25.308z")
  }
})

