/**
 * @class  .shape.icon.ArrowUp

 * See the example:
 *
 *     @example preview small frame
 *
 *     let icon =  new  .shape.icon.ArrowUp();
 *
 *     canvas.add(icon,50,10);
 *
 * @inheritable
 * @author Andreas Herz
 * @extends  .shape.icon.Icon
 */
import   from '../../packages'

 .shape.icon.ArrowUp =  .shape.icon.Icon.extend({
  NAME: " .shape.icon.ArrowUp",

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
    return this.canvas.paper.path("M25.682,24.316L15.5,6.684L5.318,24.316H25.682z")
  }
})

