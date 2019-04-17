/**
 * @class  .shape.icon.Home

 * See the example:
 *
 *     @example preview small frame
 *
 *     let icon =  new  .shape.icon.Home();
 *
 *     canvas.add(icon,50,10);
 *
 * @inheritable
 * @author Andreas Herz
 * @extends  .shape.icon.Icon
 */
import   from '../../packages'

 .shape.icon.Home =  .shape.icon.Icon.extend({
  NAME: " .shape.icon.Home",

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
    return this.canvas.paper.path("M27.812,16l-3.062-3.062V5.625h-2.625v4.688L16,4.188L4.188,16L7,15.933v11.942h17.875V16H27.812zM16,26.167h-5.833v-7H16V26.167zM21.667,23.167h-3.833v-4.042h3.833V23.167z")
  }
})

