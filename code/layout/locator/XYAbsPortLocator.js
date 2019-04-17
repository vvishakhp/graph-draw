/**
 * @class  .layout.locator.XYAbsPortLocator
 *
 * Create a locator for fixed x/y coordinate position. The port in the example below is
 * always 20px below of the top border.
 *
 * See the example:
 *
 *     @example preview small frame
 *
 *     var figure =  new  .shape.basic.Rectangle({x:130,y:30,width:100,height:60});
 *     figure.createPort("input", new  .layout.locator.XYAbsPortLocator(0,20));
 *
 *     canvas.add(figure);
 *
 * @author Andreas Herz
 * @extend  .layout.locator.PortLocator
 * @since 4.0.0
 */
import   from '../../packages'

 .layout.locator.XYAbsPortLocator =  .layout.locator.PortLocator.extend({
  NAME: " .layout.locator.XYAbsPortLocator",

  /**
   * @constructor
   *
   * {@link  .shape.node.Node}
   *
   * @param {Number} x the x coordinate of the port relative to the left of the parent
   * @param {Number} y the y coordinate of the port relative to the top of the parent
   */
  init: function (x, y) {
    this._super()

    this.x = x
    this.y = y
  },

  /**
   * @method
   * Controls the location of an {@link  .Figure}
   *
   * @param {Number} index child index of the figure
   * @param { .Figure} figure the figure to control
   *
   * @template
   **/
  relocate: function (index, figure) {
    this.applyConsiderRotation(figure, this.x, this.y)
  }

})



