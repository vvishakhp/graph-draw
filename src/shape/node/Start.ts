import { Type, Rectangle, Color, extend, RectangleSelectionFeedbackPolicy } from '../../imports';
@Type('Start')
export class start extends Rectangle {
  public static DEFAULT_COLOR = new Color(77, 144, 254);

  constructor(attr, setter, getter) {
    super(extend({
      bgColor: this.DEFAULT_COLOR,
      color: this.DEFAULT_COLOR.darker(),
      width: 50,
      height: 50
    }, attr), setter, getter)
    this.createPort("output")
    this.installEditPolicy(new RectangleSelectionFeedbackPolicy())
    this.createPort("output")
  }
}