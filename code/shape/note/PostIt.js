/**
 * @class  .shape.note.PostIt
 *
 * Simple Post-it like figure with text. Can be used for annotations or documentation.
 *
 * See the example:
 *
 *     @example preview small frame
 *
 *     let shape =  new  .shape.note.PostIt({
 *        text:"This is a simple sticky note",
 *        color:"#000000",
 *        padding:20
 *     });
 *
 *     canvas.add(shape,40,10);
 *
 * @author Andreas Herz
 * @extends  .shape.basic.Label
 */
import   from '../../packages'

 .shape.note.PostIt =  .shape.basic.Label.extend({

  NAME: " .shape.note.PostIt",

  /**
   * @constructor
   *
   * @param {Object} [attr] the configuration of the shape
   */
  init: function (attr, setter, getter) {
    this._super(attr, setter, getter)

    this.setStroke(1)
    this.setBackgroundColor("#5b5b5b")
    this.setColor("#FFFFFF")
    this.setFontColor("#ffffff")
    this.setFontSize(14)
    this.setPadding(5)
    this.setRadius(5)
  }
})



