/**
 * @class  .policy.canvas.SelectionPolicy
 *
 *
 * @author Andreas Herz
 * @extends  .policy.canvas.CanvasPolicy
 */
import   from '../../packages'

 .policy.canvas.SelectionPolicy =  .policy.canvas.CanvasPolicy.extend({

  NAME: " .policy.canvas.SelectionPolicy",

  /**
   * @constructor
   * Creates a new selection policy
   */
  init: function (attr, setter, getter) {
    this._super(attr, setter, getter)
  },

  /**
   * @method
   * Selects the given figure within the canvas. The policy must unselect already selected
   * figures or show any decorations.
   *
   * @param { .Canvas} canvas
   * @param { .Figure} figure
   *
   */
  select: function (canvas, figure) {
  },

  /**
   * @method
   * Unselect the given figure in the canvas and remove all resize handles
   *
   * @param { .Canvas} canvas
   * @param { .Figure} figure
   */
  unselect: function (canvas, figure) {
    canvas.getSelection().remove(figure)

    figure.unselect()

    // @since 6.1.42
    canvas.fireEvent("unselect", {figure: figure})
  }
})





