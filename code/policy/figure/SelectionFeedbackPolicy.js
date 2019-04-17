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

 .policy.figure.SelectionFeedbackPolicy =  .policy.figure.SelectionPolicy.extend({

  NAME: " .policy.figure.SelectionFeedbackPolicy",

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
   * @param { .Figure} figure the unselected figure
   */
  onUnselect: function (canvas, figure) {
    this._super(canvas, figure)

    figure.selectionHandles.each( (i, e) => e.hide())
    figure.selectionHandles = new  .util.ArrayList()
  },

  /**
   * @method
   * Called by the host if the policy has been installed.
   *
   * @param { .Figure} figure
   */
  onInstall: function (figure) {
    this._super(figure)

    let canvas = figure.getCanvas()
    if (canvas !== null) {
      if (canvas.getSelection().contains(figure)) {
        this.onSelect(canvas, figure, true)
      }
    }
  },


  /**
   * @method
   * Called by the host if the policy has been uninstalled.
   *
   * @param { .Figure} figure
   */
  onUninstall: function (figure) {
    this._super(figure)

    figure.selectionHandles.each( (i, e) => e.hide())
    figure.selectionHandles = new  .util.ArrayList()
  }

})
