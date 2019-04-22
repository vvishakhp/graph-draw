/**
 * @class  .policy.canvas.DecorationPolicy
 * The base class for any canvas decoration like grid, chessboard, graph paper or
 * other.
 *
 * @author Andreas Herz
 * @extends  .policy.canvas.CanvasPolicy
 */
import   from '../../packages'

 .policy.canvas.DecorationPolicy =  .policy.canvas.CanvasPolicy.extend({

  NAME: " .policy.canvas.DecorationPolicy",

  /**
   * @constructor
   *
   */
  init: function (attr, setter, getter) {
    this._super(attr, setter, getter)
  }

})

