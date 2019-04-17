/**
 * @class  .shape.icon.Minus

 * See the example:
 *
 *     @example preview small frame
 *
 *     let icon =  new  .shape.icon.Minus();
 *
 *     canvas.add(icon,50,10);
 *
 * @inheritable
 * @author Andreas Herz
 * @extends  .shape.icon.Icon
 */
import   from '../../packages'

 .shape.icon.Minus =  .shape.icon.Icon.extend({
  NAME: " .shape.icon.Minus",

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
    return this.canvas.paper.path("M25.979,12.896,5.979,12.896,5.979,19.562,25.979,19.562z")
  }
})

