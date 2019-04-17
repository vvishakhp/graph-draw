/**
 * @class  .policy.figure.RoundRectangleSelectionFeedbackPolicy
 *
 * See the example:
 *
 *       @example preview small frame
 *       circle =new  .shape.basic.Circle();
 *       circle.installEditPolicy(new  .policy.RoundRectangleSelectionFeedbackPolicy());
 *       canvas.add(circle,90,50);
 *
 *       canvas.add(new  .shape.basic.Label({text:"Click on the circle to see the selection feedback"}),20,10);
 *
 * @author Andreas Herz
 * @extends  .policy.figure.RectangleSelectionFeedbackPolicy
 */
import   from '../../packages'

 .policy.figure.RoundRectangleSelectionFeedbackPolicy =  .policy.figure.RectangleSelectionFeedbackPolicy.extend({

  NAME: " .policy.figure.RoundRectangleSelectionFeedbackPolicy",

  /**
   * @constructor
   * Creates a new Router object
   */
  init: function (attr, setter, getter) {
    this._super(attr, setter, getter)
  },


  createResizeHandle: function (owner, type) {
    return new  .ResizeHandle({owner: owner, type: type, width: 12, height: 12, radius: 4})
  }
})
