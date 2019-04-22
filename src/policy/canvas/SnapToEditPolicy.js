import   from '../../packages'
import extend from '../../util/extend'

 .SnapToHelper = {}

 .SnapToHelper.NORTH = 1
 .SnapToHelper.SOUTH = 4
 .SnapToHelper.WEST = 8
 .SnapToHelper.EAST = 16
 .SnapToHelper.CENTER_H = 32
 .SnapToHelper.CENTER_V = 642

 .SnapToHelper.NORTH_EAST =  .SnapToHelper.NORTH |  .SnapToHelper.EAST
 .SnapToHelper.NORTH_WEST =  .SnapToHelper.NORTH |  .SnapToHelper.WEST
 .SnapToHelper.SOUTH_EAST =  .SnapToHelper.SOUTH |  .SnapToHelper.EAST
 .SnapToHelper.SOUTH_WEST =  .SnapToHelper.SOUTH |  .SnapToHelper.WEST
 .SnapToHelper.NORTH_SOUTH =  .SnapToHelper.NORTH |  .SnapToHelper.SOUTH
 .SnapToHelper.EAST_WEST =  .SnapToHelper.EAST |  .SnapToHelper.WEST
 .SnapToHelper.NSEW =  .SnapToHelper.NORTH_SOUTH |  .SnapToHelper.EAST_WEST

/**
 * @class  .policy.canvas.SnapToEditPolicy
 *
 * A helper used by Tools for snapping certain mouse interactions.
 *
 *
 * @author Andreas Herz
 *
 * @extends  .policy.canvas.CanvasPolicy
 */
 .policy.canvas.SnapToEditPolicy =  .policy.canvas.CanvasPolicy.extend({

  NAME: " .policy.canvas.SnapToEditPolicy",

  /**
   * @constructor
   * Creates a new constraint policy for snap to grid
   *
   */
  init: function (attr, setter, getter) {
    this.lineColor = null

    this._super(
      extend({
        lineColor: "#51C1FC"
      }, attr),
      extend({
        /** @attr { .util.Color} color the line color of the snapTo lines */
        lineColor: this.setLineColor
      }, setter),
      extend({
        lineColor: this.getLineColor
      }, getter))
  },

  /**
   * @method
   * Set the color of the snap line.
   *
   *      // Alternatively you can use the attr method:
   *      policy.attr({
   *        lineColor: color
   *      });
   *
   * @param { .util.Color|String} color The new color of the line.
   **/
  setLineColor: function (color) {
    this.lineColor = new  .util.Color(color)
    return this
  },

  /**
   * @method
   * Return the current paint color.
   *
   * @return { .util.Color} The paint color of the line.
   * @since 5.6.1
   **/
  getLineColor: function () {
    return this.lineColor
  },


  /**
   * @method
   * Adjust the coordinates to the given constraint of the policy.
   *
   * @param { .Canvas} canvas the related canvas
   * @param { .Figure} figure the figure to snap
   * @param { .geo.Point} modifiedPos the already modified position of the figure (e.g. from an another Policy)
   * @param { .geo.Point} originalPos the original requested position of the figure
   */
  snap: function (canvas, figure, modifiedPos, originalPos) {
    return modifiedPos
  }
})
