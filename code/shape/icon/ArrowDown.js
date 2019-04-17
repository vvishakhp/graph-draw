/**
 * @class  .shape.icon.ArrowDown

 * See the example:
 *
 *     @example preview small frame
 *
 *     let icon =  new  .shape.icon.ArrowDown();
 *
 *     canvas.add(icon,50,10);
 *
 * @inheritable
 * @author Andreas Herz
 * @extends  .shape.icon.Icon
 */
import   from '../../packages'

 .shape.icon.ArrowDown =  .shape.icon.Icon.extend({
  NAME: " .shape.icon.ArrowDown",

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
    return this.canvas.paper.path("M5.318,6.684L15.5,24.316L25.682,6.684H5.318z")
  }
})

