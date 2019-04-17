/**
 * @class  .shape.node.Between
 * A simple Node which has a  InputPort and OutputPort. Mainly used for demo and examples.
 *
 * See the example:
 *
 *     @example preview small frame
 *
 *     let figure =  new  .shape.node.Between({color: "#3d3d3d"});
 *
 *     canvas.add(figure,50,10);
 *
 * @extends  .shape.basic.Rectangle
 */
import   from '../../packages'

 .shape.node.Between =  .shape.basic.Rectangle.extend({

  NAME: " .shape.node.Between",

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
    this.createPort("input")
  }
})
