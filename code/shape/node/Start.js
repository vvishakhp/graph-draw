/**
 * @class  .shape.node.Start
 *
 * A generic Node which has an OutputPort. Mainly used for demo and examples.
 *
 * See the example:
 *
 *     @example preview small frame
 *
 *     let figure =  new  .shape.node.Start({color: "#3d3d3d"});
 *
 *     canvas.add(figure,50,10);
 *
 * @extends  .shape.basic.Rectangle
 */
import   from '../../packages'

 .shape.node.Start =  .shape.basic.Rectangle.extend({

  NAME: " .shape.node.Start",
  DEFAULT_COLOR: new  .util.Color("#4D90FE"),

  /**
   * @constructor
   *
   * @param {Object} [attr] the configuration of the shape
   */
  init: function (attr, setter, getter) {
    this._super(extend({
      bgColor: this.DEFAULT_COLOR,
      color: this.DEFAULT_COLOR.darker(),
      width: 50,
      height: 50
    }, attr), setter, getter)
    this.createPort("output")
    this.installEditPolicy(new  .policy.figure.RectangleSelectionFeedbackPolicy())
    this.createPort("output")
  }

})
