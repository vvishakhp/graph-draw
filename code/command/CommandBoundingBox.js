/**
 * @class  .command.CommandBoundingBox
 * Set the bounding box of a figure with undo/redo support
 *
 * @inheritable
 * @author Andreas Herz
 * @extends  .command.Command
 */
import   from '../packages'

 .command.CommandBoundingBox =  .command.Command.extend({
  NAME: " .command.CommandResize",

  /**
   * @constructor
   * Create a new resize Command objects which can be execute via the CommandStack.
   *
   * @param { .Figure} figure the figure to resize
   * @param { .geo.Rectangle} boundingBox the new bounding box of the figure
   */
  init: function (figure, boundingBox) {
    this._super( .Configuration.i18n.command.resizeShape)
    this.figure = figure
    this.oldBoundingBox = this.figure.getBoundingBox()
    this.newBoundingBox = boundingBox
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
    return !this.oldBoundingBox.equals(this.newBoundingBox)
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
    this.figure.setBoundingBox(this.oldBoundingBox)
  },

  /**
   * @method
   * Redo the command after the user has undo this command
   *
   **/
  redo: function () {
    this.figure.setBoundingBox(this.newBoundingBox)
  }
})
