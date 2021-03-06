/**
 * @class  .policy.canvas.SnapToGridEditPolicy
 *
 * A helper used to perform snapping to a grid, which is specified on the canvas via the various
 * properties defined in this class.
 *
 *
 * @author Andreas Herz
 *
 * @extends  .policy.canvas.ShowGridEditPolicy
 */
import   from '../../packages'

 .policy.canvas.SnapToGridEditPolicy =  .policy.canvas.ShowGridEditPolicy.extend({

  NAME: " .policy.canvas.SnapToGridEditPolicy",


  /**
   * @constructor
   * Creates a new constraint policy for snap to grid
   *
   * @param {Number} grid the grid width of the canvas
   */
  init: function (grid) {
    this._super(grid)
  },


  /**
   * @method
   * Applies a snapping correction to the given result.
   *
   * @param { .Canvas} canvas the related canvas
   * @param { .Figure} figure the figure to snap
   * @param { .geo.Point} modifiedPos the already modified position of the figure (e.g. from an another Policy)
   * @param { .geo.Point} originalPos the original requested position of the figure
   * @since 2.3.0
   */
  snap: function (canvas, figure, modifiedPos, originalPos) {
    // do nothing for lines
    if (figure instanceof  .shape.basic.Line) {
      return modifiedPos
    }

    var snapPoint = figure.getSnapToGridAnchor()

    modifiedPos.x = modifiedPos.x + snapPoint.x
    modifiedPos.y = modifiedPos.y + snapPoint.y


    modifiedPos.x = this.grid * Math.floor(((modifiedPos.x + this.grid / 2.0) / this.grid))
    modifiedPos.y = this.grid * Math.floor(((modifiedPos.y + this.grid / 2.0) / this.grid))

    modifiedPos.x = modifiedPos.x - snapPoint.x
    modifiedPos.y = modifiedPos.y - snapPoint.y

    return modifiedPos
  }
})
