/**
 * @class  .policy.figure.SelectionFeedbackPolicy
 *
 * A {@link   .policy.SelectionFeedbackPolicy} that is sensitive to the canvas selection. Subclasses will typically
 * decorate the {@link  .Figure figure} with things like selection handles and/or focus feedback.
 * <br>
 * If you want to change the handle visibility for a figure, then you should use SelectionFeedbackPolicy to do that.
 *
 * @author Andreas Herz
 * @extends  .policy.figure.DragDropEditPolicy
 */
import   from '../../packages'

 .policy.figure.SelectionPolicy =  .policy.figure.DragDropEditPolicy.extend({

  NAME: " .policy.figure.SelectionPolicy",

  /**
   * @constructor
   *
   */
  init: function (attr, setter, getter) {
    this._super(attr, setter, getter)
  },


  /**
   * @method
   *
   * @template
   * @param figure
   * @param isPrimarySelection
   */
  onSelect: function (canvas, figure, isPrimarySelection) {
  },


  /**
   * @method
   *
   * @param { .Figure} figure the unselected figure
   */
  onUnselect: function (canvas, figure) {
  }

})
