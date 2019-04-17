/**
 * @class  .shape.state.Start
 *
 * The start node for a state diagram
 *
 * See the example:
 *
 *     @example preview small frame
 *
 *     let figure =  new  .shape.state.Start({color:"#3d3d3d"});
 *
 *     canvas.add(figure,50,10);
 *
 * @extends  .shape.basic.Rectangle
 */
import   from '../../packages'

 .shape.state.Start =  .shape.basic.Circle.extend({

  NAME: " .shape.state.Start",

  DEFAULT_COLOR: new  .util.Color("#3369E8"),

  init: function (attr, setter, getter) {
    this._super(attr, setter, getter)

    this.port = this.createPort("output", new  .layout.locator.BottomLocator())
    this.port.setConnectionAnchor(new  .layout.anchor.ShortesPathConnectionAnchor(this.port))

    this.setDimension(50, 50)
    this.setBackgroundColor(this.DEFAULT_COLOR)
    this.installEditPolicy(new  .policy.figure.AntSelectionFeedbackPolicy())

    this.setStroke(0)
    //this.setColor(this.DEFAULT_COLOR.darker());

    let label = new  .shape.basic.Label({text: "START"})
    label.setStroke(0)
    label.setFontColor("#ffffff")
    label.setFontFamily('"Open Sans",sans-serif')
    this.add(label, new  .layout.locator.CenterLocator())
  }
})
