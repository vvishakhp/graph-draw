/**
 * @class  .policy.port.PortFeedbackPolicy
 *
 * Base class for all port feedback policies. Used for grow, highlight or
 * other decorations during drag&drop and connecting of ports.
 *
 * @author Andreas Herz
 * @extends  .policy.figure.DragDropEditPolicy
 */
import   from '../../packages'

 .policy.port.PortFeedbackPolicy =  .policy.figure.DragDropEditPolicy.extend({


  NAME: " .policy.port.PortFeedbackPolicy",

  /**
   * @constructor
   */
  init: function (attr, setter, getter) {
    this._super(attr, setter, getter)
  },

  /**
   * @method
   * Called if the dragged port hove another port
   *
   * @param { .Canvas} canvas
   * @param { .Port}   draggedFigure
   * @param { .Figure} hoverFigure
   */
  onHoverEnter: function (canvas, draggedFigure, hoverFigure) {
  },

  /**
   * @method
   * Fired if the dragged figures leaves the hover figure
   *
   * @param { .Canvas} canvas
   * @param { .Port}   draggedFigure
   * @param { .Figure} hoverFigure
   */
  onHoverLeave: function (canvas, draggedFigure, hoverFigure) {
  }
})
