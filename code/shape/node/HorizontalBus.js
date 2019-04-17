/**
 * @class  .shape.node.HorizontalBus
 *
 * A horizontal bus shape with a special kind of port handling. The hole figure is a hybrid port.
 *
 * See the example:
 *
 *     @example preview small frame
 *
 *     let figure =  new  .shape.node.HorizontalBus({width:300, height:20, text:"Horizontal Bus"});
 *
 *     canvas.add(figure,50,10);
 *
 * @extends  .shape.node.Hub
 */
import   from '../../packages'

 .shape.node.HorizontalBus =  .shape.node.Hub.extend({

  NAME: " .shape.node.HorizontalBus",

  /**
   * @constructor
   *
   * @param {Object} [attr] the configuration of the shape
   */
  init: function (attr, setter, getter) {
    this._super(attr, setter, getter)

    this.setConnectionDirStrategy(1)

    this.installEditPolicy(new  .policy.figure.HBusSelectionFeedbackPolicy())
  }

})
