/**
 * @class  .shape.state.End
 *
 * The end node for a state diagram
 *
 * See the example:
 *
 *     @example preview small frame
 *     let end   = new  .shape.state.End();

 *     // ...add it to the canvas
 *     canvas.add( end, 230,80);
 *
 * @extends  .shape.basic.Circle
 */
import   from '../../packages'

 .shape.state.End =  .shape.basic.Circle.extend({

  NAME: " .shape.state.End",

  DEFAULT_COLOR: new  .util.Color("#4D90FE"),

  init: function (attr, setter, getter) {
    this.innerCircle = new  .shape.basic.Circle(20)

    this._super(attr, setter, getter)

    this.port = this.createPort("input", new  .layout.locator.TopLocator())
    this.port.setConnectionAnchor(new  .layout.anchor.ShortesPathConnectionAnchor(this.port))

    this.setDimension(50, 50)
    this.setBackgroundColor(this.DEFAULT_COLOR)
    this.installEditPolicy(new  .policy.figure.AntSelectionFeedbackPolicy())

    this.innerCircle.setStroke(2)
    this.innerCircle.setBackgroundColor(null)
    this.add(this.innerCircle, new  .layout.locator.CenterLocator())

    this.setStroke(0)
    //this.setColor(this.DEFAULT_COLOR.darker());
  },

  /**
   * @inheritdoc
   */
  setDimension: function (w, h) {
    this._super(w, h)
    this.innerCircle.setDimension(this.getWidth() - 10, this.getHeight() - 10)
  }
})
