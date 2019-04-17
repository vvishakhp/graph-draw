/**
 * @class  .policy.line.LineSelectionFeedbackPolicy
 *
 *
 * @author Andreas Herz
 * @extends  .policy.figure.SelectionFeedbackPolicy
 */
import   from '../../packages'

 .policy.line.LineSelectionFeedbackPolicy =  .policy.figure.SelectionFeedbackPolicy.extend({

  NAME: " .policy.line.LineSelectionFeedbackPolicy",

  /**
   * @constructor
   * Creates a new selection feedback policy for a line or connection
   */
  init: function (attr, setter, getter) {
    this._super(attr, setter, getter)
  },


  /**
   * @method
   * Called by the framework of the Policy should show a resize handle for the given shape
   *
   * @param { .Canvas} canvas The host canvas
   * @param { .Figure} figure The related figure
   * @param {Boolean} [isPrimarySelection]
   */
  onSelect: function (canvas, figure, isPrimarySelection) {
    if (figure.selectionHandles.isEmpty()) {
      figure.selectionHandles.add(new  .shape.basic.LineStartResizeHandle(figure))
      figure.selectionHandles.add(new  .shape.basic.LineEndResizeHandle(figure))

      figure.selectionHandles.each( (i, e) => {
        e.setDraggable(figure.isResizeable())
        e.show(canvas)
      })
    }
    this.moved(canvas, figure)
  },

  /**
   * @method
   * Callback method if the figure has been moved.
   *
   * @template
   */
  moved: function (canvas, figure) {
    figure.selectionHandles.each( (i, e) => e.relocate())
  }

})
