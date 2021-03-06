/**
 * @class  .shape.icon.Stop

 * See the example:
 *
 *     @example preview small frame
 *
 *     let icon =  new  .shape.icon.Stop();
 *
 *     canvas.add(icon,50,10);
 *
 * @inheritable
 * @author Andreas Herz
 * @extends  .shape.icon.Icon
 */
import   from '../../packages'

 .shape.icon.Stop =  .shape.icon.Icon.extend({
  NAME: " .shape.icon.Stop",

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
    return this.canvas.paper.path("M5.5,5.5h20v20h-20z")
  }
})

