/**
 * @class  .command.CommandRotate
 *
 * Set the rotation angle of the given figure
 *
 * @since 4.4.1
 * @inheritable
 * @author Andreas Herz
 * @extends  .command.Command
 */
import   from '../packages'

 .command.CommandRotate =  .command.Command.extend({
  NAME: " .command.CommandRotate",

  /**
   * @constructor
   * Create a new resize Command objects which can be execute via the CommandStack.
   *
   * @param { .Figure} figure the figure to resize
   * @param {Number} angle the angle to rotate
   */
  init: function (figure, angle) {
    this._super( .Configuration.i18n.command.rotateShape)
    this.figure = figure

    this.oldAngle = figure.getRotationAngle()
    this.newAngle = angle
  },


  /**
   * @method
   * Returns [true] if the command can be execute and the execution of the
   * command modify the model. A CommandMove with [startX,startX] == [endX,endY] should
   * return false. <br>
   * the execution of the Command doesn't modify the model.
   *
   * @return {Boolean}
   **/
  canExecute: function () {
    // return false if we doesn't modify the model => NOP Command
    return this.oldAngle !== this.newAngle
  },

  /**
   * @method
   * Execute the command the first time
   *
   **/
  execute: function () {
    this.redo()
  },

  /**
   * @method
   * Undo the command
   *
   **/
  undo: function () {
    this.rotate(this.oldAngle)
  },

  /**
   * @method
   * Redo the command after the user has undo this command
   *
   **/
  redo: function () {
    this.rotate(this.newAngle)
  },

  rotate: function (angle) {
    let w = this.figure.getWidth()
    let h = this.figure.getHeight()

    this.figure.setRotationAngle(angle)

    this.figure.setDimension(h, w)

    this.figure.portRelayoutRequired = true
  }
})
