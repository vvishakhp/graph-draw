/**
 * @class  .shape.node.VerticalBus
 *
 * A horizontal bus shape with a special kind of port handling. The hole figure is a hybrid port.
 *
 * See the example:
 *
 *     @example preview small frame
 *
 *     let figure =  new  .shape.node.VerticalBus({width:40, height:300, text:"Vertical Bus"});
 *
 *     canvas.add(figure,50,10);
 *
 * @extends  .shape.node.Hub
 */
import   from '../../packages'

 .shape.node.VerticalBus =  .shape.node.Hub.extend({

  NAME: " .shape.node.VerticalBus",

  /**
   * @constructor
   *
   * @param {Object} [attr] the configuration of the shape
   */
  init: function (attr, setter, getter) {
    this._super(attr, setter, getter)

    this.setConnectionDirStrategy(2)
    this.installEditPolicy(new  .policy.figure.VBusSelectionFeedbackPolicy())
  },


  /**
   * @method
   * set the label for the Hub
   *
   * @param {String} labelString
   * @since 3.0.4
   */
  setLabel: function (labelString) {
    let mustAdjustTheAngel = this.label === null

    this._super(labelString)

    if (mustAdjustTheAngel === true && this.label !== null) {
      this.label.setRotationAngle(90)
    }
  },

  /**
   * @inheritdoc
   */
  getMinHeight: function () {
    if (this.shape === null && this.label === null) {
      return 0
    }

    if (this.label !== null) {
      return this.label.getMinWidth()
    }

    return this._super()
  },

  /**
   * @inheritdoc
   */
  getMinWidth: function () {
    if (this.shape === null && this.label === null) {
      return 0
    }

    if (this.label !== null) {
      return this.label.getMinHeight()
    }

    return this._super()
  }


})
